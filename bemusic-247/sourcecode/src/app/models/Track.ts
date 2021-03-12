import {Album} from './Album';
import {Playlist} from './Playlist';
import {Lyric} from './Lyric';
import {User} from 'common/core/types/models/User';
import {MixedArtist} from '../web-player/artists/mixed-artist';
import {Tag} from '@common/core/types/models/Tag';
import {Genre} from './Genre';

export const TRACK_MODEL = 'App\\Track';

export class Track {
    id: number;
    name: string;
    model_type = TRACK_MODEL;
    album_name: string;
    number: number;
    duration?: number;
    artists?: MixedArtist[];
    youtube_id?: string;
    spotify_popularity: number;
    album_id: number;
    temp_id?: string;
    url?: string;
    image?: string;
    users?: User[];
    lyric?: Lyric;
    album?: Album;
    playlists?: Playlist[];
    user_id?: number;
    user?: User;
    local_only?: boolean;
    local_popularity?: number;
    description?: string;
    tags: Tag[];
    genres: Genre[];
    likes_count?: number;
    reposts_count?: number;
    plays_count?: number;
    comments_count?: number;
    created_at?: string;
    created_at_relative?: string;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
