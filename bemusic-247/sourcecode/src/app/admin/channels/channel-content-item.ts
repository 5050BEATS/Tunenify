import {Track} from '../../models/Track';
import {Album} from '../../models/Album';
import {Artist} from '../../models/Artist';
import {Playlist} from '../../models/Playlist';
import {User} from '@common/core/types/models/User';
import {MixedArtist} from '../../web-player/artists/mixed-artist';
import {Channel} from './channel';
import {Genre} from '../../models/Genre';

export type ChannelContentItem = (Track | Album | Artist | Playlist | Partial<User> | MixedArtist | Channel | Genre) & {
    channelable_id?: number;
    channelable_order?: number;
};
