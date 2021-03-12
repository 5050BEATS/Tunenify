export const MIXED_ARTIST_MODEL = 'App\\MixedArtist';

export interface MixedArtist {
    id: number;
    model_type: 'App\\MixedArtist';
    artist_type: string;
    name: string;
    image: string;
}
