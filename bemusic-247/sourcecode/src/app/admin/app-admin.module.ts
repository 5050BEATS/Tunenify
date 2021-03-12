import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ArtistsComponent} from './artists/artists.component';
import {NewArtistPageComponent} from './artists/new-artist-page/new-artist-page.component';
import {ArtistAlbumsTableComponent} from './artists/new-artist-page/artist-albums-table/artist-albums-table.component';
import {CrupdateLyricModalComponent} from './lyrics-page/crupdate-lyric-modal/crupdate-lyric-modal.component';
import {AlbumIndexComponent} from './albums/album-index/album-index.component';
import {LyricsPageComponent} from './lyrics-page/lyrics-page.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import {PlaylistsPageComponent} from './playlists-page/playlists-page.component';
import {ProvidersSettingsComponent} from './settings/providers/providers-settings.component';
import {PlayerSettingsComponent} from './settings/player/player-settings.component';
import {BlockedArtistsSettingsComponent} from './settings/blocked-artists/blocked-artists-settings.component';
import {GenresComponent} from './genres/genres.component';
import {CrupdateGenreModalComponent} from './genres/crupdate-genre-modal/crupdate-genre-modal.component';
import {BaseAdminModule} from '@common/admin/base-admin.module';
import {UploadsModule} from '@common/uploads/uploads.module';
import {CrupdateTrackPageComponent} from './tracks/crupdate-track-page/crupdate-track-page.component';
import {MediaImageModule} from '../web-player/shared/media-image/media-image.module';
import {CrupdateAlbumPageComponent} from './albums/crupdate-album-page/crupdate-album-page.component';
import {TrackIndexComponent} from './tracks/track-index/track-index.component';
import {ChannelIndexComponent} from './channels/channel-index/channel-index.component';
import {CrupdateChannelPageComponent} from './channels/crupdate-channel-page/crupdate-channel-page.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {SlugControlModule} from '@common/shared/form-controls/slug-control/slug-control.module';
import {InterfaceComponent} from './settings/interface/interface.component';
import {UploadImageControlModule} from '@common/shared/form-controls/upload-image-control/upload-image-control.module';
import {CrupdateAlbumModalComponent} from './artists/new-artist-page/crupdate-album-modal/crupdate-album-modal.component';
import {UploadingModule} from '../uploading/uploading.module';
import {NoResultsMessageModule} from '@common/core/ui/no-results-message/no-results-message.module';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {InfoPopoverModule} from '@common/core/ui/info-popover/info-popover.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BaseAdminModule,
        UploadsModule,
        UploadingModule,
        NoResultsMessageModule,
        LoadingIndicatorModule,
        InfoPopoverModule,

        SlugControlModule,
        UploadImageControlModule,

        // material
        MatChipsModule,
        MatAutocompleteModule,
        MatProgressBarModule,
        MediaImageModule,
        DragDropModule,
        MatTabsModule,
    ],
    declarations: [
        ArtistsComponent,
        NewArtistPageComponent,
        ArtistAlbumsTableComponent,
        CrupdateLyricModalComponent,
        TrackIndexComponent,
        AlbumIndexComponent,
        LyricsPageComponent,
        PlaylistsPageComponent,
        ChannelIndexComponent,

        // settings
        ProvidersSettingsComponent,
        PlayerSettingsComponent,
        BlockedArtistsSettingsComponent,
        GenresComponent,
        CrupdateGenreModalComponent,
        CrupdateTrackPageComponent,
        CrupdateAlbumPageComponent,
        CrupdateChannelPageComponent,
        InterfaceComponent,
        CrupdateAlbumModalComponent,
    ]
})
export class AppAdminModule {
}
