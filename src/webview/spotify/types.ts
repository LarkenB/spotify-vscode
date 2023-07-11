type Track = {
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

type ExternalIds = {
    isrc: string;
    ean: string;
    upc: string;
};

type ExternalUrls = {
    spotify: string;
};

type Restrictions = {
    reason: string;
};

type Album = {
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
}

type Copyright = {
    text: string;
    type: string;
}

type Artist = {
    external_urls: ExternalUrls;
    followers: {
        href: string | null;
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
}

type SimplifiedArtist = {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: 'artist';
    uri: string;
}

type Image = {
    url: string;
    height: number | null;
    width: number | null;
}