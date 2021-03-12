import {Track} from './Track';
import {Playlist} from './Playlist';
import {Repost} from './repost';
import {UserProfile} from './UserProfile';
import {UserLink} from './UserLink';

declare module '@common/core/types/models/User' {
    interface User {
        uploaded_tracks: Track[];
        followed_users?: this[];
        followers_count?: number;
        followed_users_count?: number;
        followers?: this[];
        model_type: string;
        playlists: Playlist[];
        reposts?: Repost[];
        profile?: UserProfile;
        links?: UserLink[];
        unread_notifications_count?: number;
    }
}
