import { writable } from 'svelte/store';
import { type PlaybackState, type Track } from './spotify/types';

export const accessToken = writable<string | null>(null);

export const currentTrack = writable<Track | null>(null);

export const playbackState = writable<PlaybackState | null>(null);

playbackState.subscribe((value) => {
  if (value && value.item && value.item.type === 'track') {
    currentTrack.set(value.item);
  }
});
