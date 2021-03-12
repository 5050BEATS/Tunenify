import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlayerControlsComponent} from './player/player-controls/player-controls.component';
import {PlayingIndicatorComponent} from './tracks/track-list/playing-indicator/playing-indicator.component';
import {VolumeControlsComponent} from './player/player-controls/volume-controls/volume-controls.component';
import {PlayerSeekbarComponent} from './player/player-controls/player-seekbar/player-seekbar.component';
import {PlaybackControlButtonComponent} from './player/playback-control-button/playback-control-button.component';
import {MainPlaybackButtonsComponent} from './player/player-controls/main-playback-buttons/main-playback-buttons.component';
import {RepeatButtonComponent} from './player/player-controls/repeat-button/repeat-button.component';
import {MobilePlayerControlsComponent} from './player/mobile-player-controls/mobile-player-controls.component';
import {HeaderPlayButtonComponent} from './shared/header-play-button/header-play-button.component';
import {ArtistsLinksListComponent} from './artists/artists-links-list/artists-links-list.component';
import {RouterModule} from '@angular/router';
import {MediaGridComponent} from './media-grid/media-grid.component';
import {PlaylistItemComponent} from './playlists/playlist-item/playlist-item.component';
import {MediaImageModule} from './shared/media-image/media-image.module';
import {ArtistsLinksListModule} from './artists/artists-links-list/artists-links-list.module';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CustomMenuModule} from '@common/core/ui/custom-menu/custom-menu.module';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
    declarations: [
        PlayerControlsComponent,
        PlayingIndicatorComponent,
        VolumeControlsComponent,
        PlayerSeekbarComponent,
        PlaybackControlButtonComponent,
        MainPlaybackButtonsComponent,
        RepeatButtonComponent,
        MobilePlayerControlsComponent,
        HeaderPlayButtonComponent,
        PlaylistItemComponent,
        MediaGridComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        MediaImageModule,
        ArtistsLinksListModule,
        TranslationsModule,
        CustomMenuModule,

        // material
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
    exports: [
        PlayerControlsComponent,
        PlayingIndicatorComponent,
        VolumeControlsComponent,
        PlayerSeekbarComponent,
        PlaybackControlButtonComponent,
        MainPlaybackButtonsComponent,
        RepeatButtonComponent,
        MobilePlayerControlsComponent,
        HeaderPlayButtonComponent,
        ArtistsLinksListComponent,
        PlaylistItemComponent,
        MediaGridComponent,
    ]
})
export class PlayerUiModule {
}
