
export async function pause(accessToken: string) {
    if (!accessToken) return;

    fetch(`https://api.spotify.com/v1/me/player/pause`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
  }

export async function skipToNext(accessToken: string) {
    if (!accessToken) return;

    await fetch(`https://api.spotify.com/v1/me/player/next`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
    });
}

export async function skipToPrevious(accessToken: string) {
    if (!accessToken) return;

    await fetch(`https://api.spotify.com/v1/me/player/previous`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
  }

export async function getCurrentTrack(accessToken: string): Promise<Track | null> {
    if (!accessToken) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      switch(response.status) {
        case 200: {
          return (await response.json()).item as Track;
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }

    return null;
  }

export async function updatePlaybackState(accessToken: string) {
    if (!accessToken) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      switch(response.status) {
        case 200: {
          // TODO: After other spotify types are added, return playback state instead of nothing 
          return;
        }
        case 204: {
          // Playback not available or active
          return;
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }