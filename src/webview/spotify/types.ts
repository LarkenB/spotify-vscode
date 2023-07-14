export type Track = {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: {};
  restrictions: Restrictions;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
  is_local: boolean;
};

export type Episode = {
  type: 'episode';
};

export type ExternalIds = {
  isrc: string;
  ean: string;
  upc: string;
};

export type ExternalUrls = {
  spotify: string;
};

export type Restrictions = {
  reason: string;
};

export type Album = {
  album_type: 'album' | 'single' | 'compilation';
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  restrictions: Restrictions;
  type: 'album';
  uri: string;
  copyrights: Copyright[];
  external_ids: ExternalIds;
  genres: string[];
  label: string;
  popularity: number;
  album_group: 'album' | 'single' | 'compilation' | 'appears_on';
  artists: SimplifiedArtist[];
};

export type Copyright = {
  text: string;
  type: string;
};

export type Artist = {
  external_urls: ExternalUrls;
  followers: {
    href?: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
};

export type SimplifiedArtist = {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
};

export type Image = {
  url: string;
  height?: number;
  width?: number;
};

export type Device = {
  id?: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent?: number;
};

export type PlaybackState = {
  device: Device;
  repeat_state: 'off' | 'track' | 'context';
  shuffle_state: boolean;
  context?: {
    type: 'artist' | 'playlist' | 'album' | 'show';
    href: string;
    external_urls: ExternalUrls;
    uri: string;
  };
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  item?: Track | Episode;
  current_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
  actions: {
    interrupting_playback: false;
    pausing: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
    toggling_repeat_context: boolean;
    toggling_shuffle: boolean;
    toggling_repeat_track: boolean;
    transferring_playback: boolean;
  };
};
