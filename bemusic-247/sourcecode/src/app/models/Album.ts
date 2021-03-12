import {Track} from './Track';
import {Tag} from '@common/core/types/models/Tag';
import {MixedArtist} from '../web-player/artists/mixed-artist';
import {Genre} from './Genre';

export const ALBUM_MODEL = 'App\\Album';

export class Album {
    id: number;
    name: string;
    model_type = ALBUM_MODEL;
    release_date?: string;
    image?: string;
    artist_id?: number;
    spotify_popularity?: boolean;
    fully_scraped: boolean;
    temp_id?: string;
    artist?: MixedArtist;
    tracks?: Track[];
    views = 0;
    description?: string;
    tags?: Tag[];
    genres?: Genre[];
    auto_update = true;
    reposts_count?: number;
    likes_count?: number;
    plays_count?: number;
    created_at_relative?: string;
    local_only?: boolean;
    artist_type?: string;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
