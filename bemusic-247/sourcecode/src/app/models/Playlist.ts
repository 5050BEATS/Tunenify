import {Track} from './Track';
import {User} from 'common/core/types/models/User';

export const PLAYLIST_MODEL = 'App\\Playlist';

export class Playlist {
    id: number;
    name: string;
    public: number;
    image: string;
    description: string;
    created_at: string;
    updated_at: string;
    is_owner: string;
    editors?: User[];
    tracks_count?: number;
    tracks?: Track[];
    model_type: string;
    views = 0;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
