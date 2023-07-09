import * as vscode from 'vscode';
import { AUTH_TYPE, SpotifyAuthenticationProvider } from './spotifyAuth';

// TODO: delete all cat coding boilerplate references and clean up commands

// TODO: move to another file
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
];

async function getSession() {
  const session = await vscode.authentication.getSession(AUTH_TYPE, SCOPES, {
    createIfNone: false,
  });

  return session;
}

export function activate(context: vscode.ExtensionContext) {
  const subscriptions = context.subscriptions;

  subscriptions.push(
    vscode.commands.registerCommand(
      'vscode-spotify-authprovider.signIn',
      async () => {
        await vscode.authentication.getSession(AUTH_TYPE, SCOPES, {
          createIfNone: true,
        });
      },
    ),
  );

  subscriptions.push(
    vscode.authentication.onDidChangeSessions(async (e) => {
      if (e.provider.id === AUTH_TYPE) {
        const session = await getSession();
        const accessToken = session ? session.accessToken : undefined;

        if (SpotifyPanel.currentPanel) {
          // Send updated accessToken to webview to be used
          SpotifyPanel.currentPanel.sendAccessToken(accessToken);
        }
      }
    }),
  );

  subscriptions.push(new SpotifyAuthenticationProvider(context));

  context.subscriptions.push(
    vscode.commands.registerCommand('catCoding.start', () => {
      SpotifyPanel.createOrShow(context.extensionUri);
    }),
  );

  if (vscode.window.registerWebviewPanelSerializer) {
    // Make sure we register a serializer in activation event
    vscode.window.registerWebviewPanelSerializer(SpotifyPanel.viewType, {
      async deserializeWebviewPanel(
        webviewPanel: vscode.WebviewPanel,
        state: any,
      ) {
        console.log(`Got state: ${state}`);
        // Reset the webview options so we use latest uri for `localResourceRoots`.
        webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
        SpotifyPanel.revive(webviewPanel, context.extensionUri);
      },
    });
  }
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return {
    // Enable javascript in the webview
    enableScripts: true,
    // And restrict the webview to only loading content from our extension's `dist` directory.
    localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
  };
}

/**
 * Manages spotify webview panels
 */
class SpotifyPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: SpotifyPanel | undefined;

  public static readonly viewType = 'catCoding';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static async createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (SpotifyPanel.currentPanel) {
      SpotifyPanel.currentPanel._panel.reveal(column);

      // TODO: pretty sure this is wrong and can be removed
      const session = await getSession();
      if (session.accessToken) {
        SpotifyPanel.currentPanel.sendAccessToken(session.accessToken);
      }
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      SpotifyPanel.viewType,
      'Spotify',
      column || vscode.ViewColumn.One,
      getWebviewOptions(extensionUri),
    );

    SpotifyPanel.currentPanel = new SpotifyPanel(panel, extensionUri);
  }

  public static async revive(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
  ) {
    SpotifyPanel.currentPanel = new SpotifyPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial html content
    const webview = this._panel.webview;
    this._panel.webview.html = this._getHtmlForWebview(webview);

    // Send the current accessToken when making a new panel
    getSession().then((session) => {
      if (session) {
        SpotifyPanel.currentPanel.sendAccessToken(session.accessToken);
      }
    });

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Update the content based on view changes
    this._panel.onDidChangeViewState(
      async () => {
        const session = await getSession();
        if (session) {
          this.sendAccessToken(session.accessToken);
        }
      },
      null,
      this._disposables,
    );

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'alert':
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this._disposables,
    );
  }

  public sendAccessToken(accessToken: string) {
    this._panel.webview.postMessage({
      command: 'accessToken',
      accessToken: accessToken,
    });
  }

  public dispose() {
    SpotifyPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _update() {
    const webview = this._panel.webview;

    this._panel.title = 'Spotify'; // Title of panel tab in editor
    this._panel.webview.html = this._getHtmlForWebview(webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.joinPath(
      this._extensionUri,
      'dist',
      'webview.js',
    );

    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    // Local path to css styles
    // const styleResetPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css');
    // const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css');

    // Uri to load styles into webview
    // const stylesResetUri = webview.asWebviewUri(styleResetPath);
    // const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<title>Cat Coding</title>
			</head>
			<body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
