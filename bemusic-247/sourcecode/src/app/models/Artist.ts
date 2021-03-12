import {Album} from './Album';
import {Genre} from './Genre';
import {Track} from './Track';

export const ARTIST_MODEL = 'App\\Artist';

export class Artist {
    id: number;
    name: string;
    model_type: string;
    spotify_followers?: number;
    spotify_popularity?: boolean;
    image_small?: string;
    image_large?: string;
    fully_scraped = true;
    updated_at?: string;
    bio?: {content: string};
    bio_images?: {url: string}[];
    top_tracks?: Track[];
    albums?: Album[];
    similar?: Artist[];
    genres?: Genre[];
    views = 0;
    auto_update = true;

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}
