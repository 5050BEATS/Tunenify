import {Routes} from '@angular/router';
import {ArtistsComponent} from './artists/artists.component';
import {NewArtistPageComponent} from './artists/new-artist-page/new-artist-page.component';
import {EditArtistPageResolver} from './artists/new-artist-page/edit-artist-page-resolver.service';
import {AlbumIndexComponent} from './albums/album-index/album-index.component';
import {GenresComponent} from './genres/genres.component';
import {LyricsPageComponent} from './lyrics-page/lyrics-page.component';
import {PlaylistsPageComponent} from './playlists-page/playlists-page.component';
import {ProvidersSettingsComponent} from './settings/providers/providers-settings.component';
import {PlayerSettingsComponent} from './settings/player/player-settings.component';
import {CrupdateTrackPageComponent} from './tracks/crupdate-track-page/crupdate-track-page.component';
import {TrackPageResolver} from '../web-player/tracks/track-page/track-page-resolver.service';
import {CrupdateAlbumPageComponent} from './albums/crupdate-album-page/crupdate-album-page.component';
import {AlbumResolver} from '../web-player/albums/album/album-resolver.service';
import {PendingChangesGuard} from '@common/guards/pending-changes/pending-changes-guard.service';
import {UploadPageComponent} from '../uploading/upload-page/upload-page.component';
import {TrackIndexComponent} from './tracks/track-index/track-index.component';
import {ChannelIndexComponent} from './channels/channel-index/channel-index.component';
import {CrupdateChannelPageComponent} from './channels/crupdate-channel-page/crupdate-channel-page.component';
import {ChannelResolverService} from './channels/crupdate-channel-page/channel-resolver.service';
import {InterfaceComponent} from './settings/interface/interface.component';

export const APP_ADMIN_ROUTES: Routes = [
    {
        path: 'artists',
        children: [
            {path: '', component: ArtistsComponent, data: {permissions: ['artists.update']}},
            {path: 'new', component: NewArtistPageComponent, data: {permissions: ['artists.create']}},
            {
                path: ':id/edit',
                component: NewArtistPageComponent,
                resolve: {artist: EditArtistPageResolver},
                data: {permissions: ['artists.update'], simplified: true}
            },
        ]
    },

    // CHANNELS
    {
        path: 'channels',
        component: ChannelIndexComponent,
        data: {permissions: ['channels.view']}
    },
    {
        path: 'channels/new',
        component: CrupdateChannelPageComponent,
        data: {permissions: ['channels.create']}
    },
    {
        path: 'channels/:id',
        component: CrupdateChannelPageComponent,
        resolve: {api: ChannelResolverService},
        data: {permissions: ['channels.update'], failRedirectUri: '/admin/channels'},
    },

    // ALBUMS
    {
        path: 'albums',
        component: AlbumIndexComponent,
        data: {permissions: ['albums.view']}
    },
    {
        path: 'albums/new',
        component: CrupdateAlbumPageComponent,
        canDeactivate: [PendingChangesGuard],
        data: {permissions: ['albums.create']}
    },
    {
        path: 'albums/:id',
        component: CrupdateAlbumPageComponent,
        resolve: {api: AlbumResolver},
        canDeactivate: [PendingChangesGuard],
        data: {permissions: ['albums.update'], simplified: true},
    },

    // TRACKS
    {
        path: 'tracks',
        component: TrackIndexComponent,
        data: {permissions: ['tracks.view']}
    },
    {
        path: 'tracks/new',
        component: CrupdateTrackPageComponent,
        canDeactivate: [PendingChangesGuard],
        data: {permissions: ['tracks.create']}
    },
    {
        path: 'tracks/:id',
        component: CrupdateTrackPageComponent,
        resolve: {api: TrackPageResolver},
        canDeactivate: [PendingChangesGuard],
        data: {permissions: ['tracks.update']}
    },

    {
        path: 'upload',
        component: UploadPageComponent,
        data: {permissions: ['tracks.create', 'albums.create']}
    },

    {
        path: 'genres',
        component: GenresComponent,
        data: {permissions: ['genres.view']}
    },
    {
        path: 'lyrics',
        component: LyricsPageComponent,
        data: {permissions: ['lyrics.view']}
    },
    {
        path: 'playlists',
        component: PlaylistsPageComponent,
        data: {permissions: ['playlists.view']}
    },
];

export const APP_SETTING_ROUTES: Routes = [
    {path: 'providers', component: ProvidersSettingsComponent},
    {path: 'player', component: PlayerSettingsComponent},
    {path: 'interface', component: InterfaceComponent},
];

export const APP_ANALYTIC_ROUTES: Routes = [
    //
];
