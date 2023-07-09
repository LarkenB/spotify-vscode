import { authentication, type AuthenticationProvider, type AuthenticationProviderAuthenticationSessionsChangeEvent, type AuthenticationSession, Disposable, env, EventEmitter, type ExtensionContext, ProgressLocation, Uri, type UriHandler, window } from "vscode";
import { type PromiseAdapter, promiseFromEvent } from "./util";
import fetch from 'node-fetch';

const uuid = () => {
    const hexDigits = '0123456789abcdef';
    let uuid = '';
  
    for (let i = 0; i < 32; i++) {
      uuid += hexDigits.charAt(Math.floor(Math.random() * 16));
    }
  
    // Insert hyphens at the appropriate positions to match the UUID format
    uuid = `${uuid.substr(0, 8)}-${uuid.substr(8, 4)}-${uuid.substr(12, 4)}-${uuid.substr(16, 4)}-${uuid.substr(20)}`;
  
    return uuid;
};

export const AUTH_TYPE = `spotify`;
const AUTH_NAME = `Spotify`;
const CLIENT_ID = "7cbd5d9d094d4aa38c18638efab08bce";
const CLIENT_SECRET = "b180d72de8324985ac860ed305388d88";
const SPOTIFY_DOMAIN = `accounts.spotify.com`;
const SESSIONS_SECRET_KEY = `${AUTH_TYPE}.sessions`;

class UriEventHandler extends EventEmitter<Uri> implements UriHandler {
	public handleUri(uri: Uri) {
		this.fire(uri);
	}
}

export class SpotifyAuthenticationProvider implements AuthenticationProvider, Disposable {
  private _sessionChangeEmitter = new EventEmitter<AuthenticationProviderAuthenticationSessionsChangeEvent>();
  private _disposable: Disposable;
  private _pendingStates: string[] = [];
  private _codeExchangePromises = new Map<string, { promise: Promise<string>; cancel: EventEmitter<void> }>();
  private _uriHandler = new UriEventHandler();
  
  constructor(private readonly context: ExtensionContext) {
    this._disposable = Disposable.from(
      authentication.registerAuthenticationProvider(AUTH_TYPE, AUTH_NAME, this, { supportsMultipleAccounts: false }),
      window.registerUriHandler(this._uriHandler)
    )
  }

  get onDidChangeSessions() {
  	return this._sessionChangeEmitter.event;
  }

  get redirectUri() {
    const publisher = this.context.extension.packageJSON.publisher;
    const name = this.context.extension.packageJSON.name;
    return `${env.uriScheme}://${publisher}.${name}`;  // vscode://larkenb.spotify-vscode
  }

  /**
   * Get the existing sessions
   * @param scopes 
   * @returns 
   */
  public async getSessions(scopes?: string[]): Promise<readonly AuthenticationSession[]> {
    const allSessions = await this.context.secrets.get(SESSIONS_SECRET_KEY);

    if (allSessions) {
      return JSON.parse(allSessions) as AuthenticationSession[];
    }

    return [];
  }

  /**
   * Create a new auth session
   * @param scopes 
   * @returns 
   */
  public async createSession(scopes: string[]): Promise<AuthenticationSession> {
    try {
      const token = await this.login(scopes);
      if (!token) {
        throw new Error(`Spotify login failure`);
      }

      const userinfo: { display_name: string, email: string } = await this.getUserInfo(token);

      const session: AuthenticationSession = {
        id: uuid(),
        accessToken: token,
        account: {
          label: userinfo.display_name,
          id: userinfo.email
        },
        scopes: []
      };

      await this.context.secrets.store(SESSIONS_SECRET_KEY, JSON.stringify([session]))

      this._sessionChangeEmitter.fire({ added: [session], removed: [], changed: [] });

      return session;
    } catch (e) {
      window.showErrorMessage(`Sign in failed: ${e}`);
			throw e;
    }
  }

  /**
   * Remove an existing session
   * @param sessionId 
   */
  public async removeSession(sessionId: string): Promise<void> {
    const allSessions = await this.context.secrets.get(SESSIONS_SECRET_KEY);
    if (allSessions) {
      let sessions = JSON.parse(allSessions) as AuthenticationSession[];
      const sessionIdx = sessions.findIndex(s => s.id === sessionId);
      const session = sessions[sessionIdx];
      sessions.splice(sessionIdx, 1);

      await this.context.secrets.store(SESSIONS_SECRET_KEY, JSON.stringify(sessions));

      if (session) {
        this._sessionChangeEmitter.fire({ added: [], removed: [session], changed: [] });
      }      
    }
  }

  /**
   * Dispose the registered services
   */
	public async dispose() {
		this._disposable.dispose();
	}

  /**
   * Log in to Auth0
   */
  private async login(scopes: string[] = []) {
    return await window.withProgress<string>({
			location: ProgressLocation.Notification,
			title: "Signing in to Spotify...",
			cancellable: true
		}, async (_, token) => {
      const stateId = uuid();

      this._pendingStates.push(stateId);

      const scopeString = scopes.join(' ');

      const searchParams = new URLSearchParams([
        ['response_type', 'code'],
        ['client_id', CLIENT_ID],
        ['redirect_uri', this.redirectUri],
        ['state', stateId],
        ['scope', scopes.join(' ')],
        ['show_dialog', 'true']
      ]);
      const uri = Uri.parse(`https://${SPOTIFY_DOMAIN}/authorize?${searchParams.toString()}`);
      await env.openExternal(uri);

      let codeExchangePromise = this._codeExchangePromises.get(scopeString);
      if (!codeExchangePromise) {
        codeExchangePromise = promiseFromEvent(this._uriHandler.event, this.handleUri(scopes));
        this._codeExchangePromises.set(scopeString, codeExchangePromise);
      }

      try {
        return await Promise.race([
          codeExchangePromise.promise,
          new Promise<string>((_, reject) => setTimeout(() => reject('Cancelled'), 60000)),
          promiseFromEvent<any, any>(token.onCancellationRequested, (_, __, reject) => { reject('User Cancelled'); }).promise
        ]);
      } finally {
        this._pendingStates = this._pendingStates.filter(n => n !== stateId);
        codeExchangePromise?.cancel.fire();
        this._codeExchangePromises.delete(scopeString);
      }
    });
  }

  /**
   * Handle the redirect to VS Code (after sign in from Auth0)
   * @param scopes 
   * @returns 
   */
  private handleUri: (scopes: readonly string[]) => PromiseAdapter<Uri, string> = 
  (scopes) => async (uri, resolve, reject) => {
    const query = new URLSearchParams(uri.query);
    const code = query.get('code');
    const state = query.get('state');


    const access_token = await this.getAccessToken(code);

    if (!access_token) {
      reject(new Error('No token'));
      return;
    }
    if (!state) {
      reject(new Error('No state'));
      return;
    }

    // Check if it is a valid auth request started by the extension
    if (!this._pendingStates.some(n => n === state)) {
      reject(new Error('State not found'));
      return;
    }

    resolve(access_token);
  }

  /**
   * Get the user info from Auth0
   * @param token 
   * @returns 
   */
  private async getUserInfo(token: string): Promise<any> {
    const response = await fetch(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return await response.json();
  }

  private async getAccessToken(code: string): Promise<string> {

    const searchParams = new URLSearchParams([
        ['grant_type', 'authorization_code'],
        ['code', code],
        ['redirect_uri', this.redirectUri],
      ]);

    const response = await fetch(`https://accounts.spotify.com/api/token`, {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
    })

    // TODO: use refresh token and find a better way to extract this
    const json = (await response.json()) as any;

    return json.access_token;
  }

}