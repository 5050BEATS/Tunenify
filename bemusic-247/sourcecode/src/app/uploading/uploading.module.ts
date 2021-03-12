import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadPageComponent} from './upload-page/upload-page.component';
import {TranslationsModule} from '@common/core/translations/translations.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import {UploadsModule} from '@common/uploads/uploads.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChipInputModule} from '@common/core/ui/chip-input/chip-input.module';
import {TrackFormComponent} from './track-form/track-form.component';
import {UploadImageControlModule} from '@common/shared/form-controls/upload-image-control/upload-image-control.module';
import {AlbumFormComponent} from './album-form/album-form.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TrackUploadHeaderComponent} from './track-upload-header/track-upload-header.component';
import {TrackArtistControlComponent} from './track-form/track-artist-control/track-artist-control.component';
import {AlbumControlComponent} from './track-form/album-control/album-control.component';
import {LoadingIndicatorModule} from '@common/core/ui/loading-indicator/loading-indicator.module';
import {MediaImageModule} from '../web-player/shared/media-image/media-image.module';
import {RouterModule} from '@angular/router';
import {UploadedMediaPreviewComponent} from './uploaded-media-preview/uploaded-media-preview.component';
import { AlbumArtistControlComponent } from './album-form/album-artist-control/album-artist-control.component';
import {UploadingRoutingModule} from './uploading-routing.module';
import { UploadingHostComponent } from './uploading-host/uploading-host.component';

@NgModule({
    declarations: [
        UploadPageComponent,
        TrackFormComponent,
        AlbumFormComponent,
        TrackUploadHeaderComponent,
        TrackArtistControlComponent,
        AlbumControlComponent,
        UploadedMediaPreviewComponent,
        AlbumArtistControlComponent,
        UploadingHostComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        MediaImageModule,
        UploadingRoutingModule,

        MatIconModule,
        MatProgressBarModule,
        TranslationsModule,
        UploadsModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        ChipInputModule,
        MatChipsModule,
        MatSlideToggleModule,
        MatTooltipModule,
        UploadImageControlModule,
        DragDropModule,
        MatAutocompleteModule,
        MatMenuModule,
        LoadingIndicatorModule,
    ],
    exports: [
        TrackFormComponent,
        AlbumFormComponent,
    ]
})
export class UploadingModule {
}
