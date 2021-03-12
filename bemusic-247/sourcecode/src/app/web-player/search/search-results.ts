import {Album} from '../../models/Album';
import {Track} from '../../models/Track';
import {Playlist} from '../../models/Playlist';
import {User} from 'common/core/types/models/User';
import {MixedArtist} from '../artists/mixed-artist';
import {Channel} from '../../admin/channels/channel';
import {Genre} from '../../models/Genre';
import {Tag} from '@common/core/types/models/Tag';

export interface SearchResults {
    artists?: MixedArtist[];
    albums?: Album[];
    tracks?: Track[];
    playlists?: Playlist[];
    users?: User[];
    channels?: Channel[];
    genres?: Genre[];
    tags?: Tag[];
}

export interface SearchResponse {
    query: string;
    results: SearchResults;
}
