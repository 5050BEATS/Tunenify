import {Artist} from './Artist';

export const GENRE_MODEL = 'App\\Genre';

export class Genre {
    id: number;
    name: string;
    display_name: string;
    model_type: 'App\\Genre';
    image: string;
    popularity: number;
    created_at: string;
    updated_at: string;
    artists?: Artist[];

    constructor(params: Object = {}) {
        for (const name in params) {
            this[name] = params[name];
        }
    }
}