import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfilePageComponent} from './user-profile-page.component';
import {EditUserProfileModalComponent} from './edit-user-profile-modal/edit-user-profile-modal.component';
import {UploadedTracksTabComponent} from './tabs/uploaded-tracks-tab/uploaded-tracks-tab.component';
import {UserAlbumsTabComponent} from './tabs/user-albums-tab/user-albums-tab.component';
import {UserPlaylistsTabComponent} from './tabs/user-playlists-tab/user-playlists-tab.component';
import {UserRepostsTabComponent} from './tabs/user-reposts-tab/user-reposts-tab.component';
import {UserFollowsTabComponent} from './tabs/user-follows-tab/user-follows-tab.component';
import {MediaImageModule} from '../../shared/media-image/media-image.module';
import {RouterModule} from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {UploadImageControlModule} from '@common/shared/form-controls/upload-image-control/upload-image-control.module';
import {MediaListItemModule} from '../../tracks/media-list-item/media-list-item.module';
import {PlayerUiModule} from '../../player-ui.module';
import {TrackActionsBarModule} from '../../tracks/track-actions-bar/track-actions-bar.module';
import {UserProfileRoutingModule} from './user-profile-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslationsModule} from '@common/core/translations/translations.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AdHostModule} from '@common/core/ui/ad-host/ad-host.module';
import {NoResultsMessageModule} from '@common/core/ui/no-results-message/no-results-message.module';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        UserProfilePageComponent,
        EditUserProfileModalComponent,
        UploadedTracksTabComponent,
        UserAlbumsTabComponent,
        UserPlaylistsTabComponent,
        UserRepostsTabComponent,
        UserFollowsTabComponent,
    ],
    imports: [
        CommonModule,
        UploadImageControlModule,
        MediaImageModule,
        MediaListItemModule,
        PlayerUiModule,
        TrackActionsBarModule,
        RouterModule,
        UserProfileRoutingModule,
        TranslationsModule,
        AdHostModule,
        NoResultsMessageModule,
        LoadingIndicatorModule,
        FormsModule,
        ReactiveFormsModule,

        // material
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
})
export class UserProfileModule {
}
