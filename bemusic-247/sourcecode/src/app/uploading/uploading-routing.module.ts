import {UploadPageComponent} from './upload-page/upload-page.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {TrackPageResolver} from '../web-player/tracks/track-page/track-page-resolver.service';
import {CrupdateTrackPageComponent} from '../admin/tracks/crupdate-track-page/crupdate-track-page.component';
import {CrupdateAlbumPageComponent} from '../admin/albums/crupdate-album-page/crupdate-album-page.component';
import {AlbumResolver} from '../web-player/albums/album/album-resolver.service';
import {PendingChangesGuard} from '@common/guards/pending-changes/pending-changes-guard.service';
import {UploadingHostComponent} from './uploading-host/uploading-host.component';

const routes: Routes = [
    {
        path: '',
        component: UploadingHostComponent,
        children: [
            {
                path: '',
                component: UploadPageComponent,
                data: {permissions: ['tracks.create', 'albums.create']}
            },
            {
                path: 'tracks/:id/edit',
                component: CrupdateTrackPageComponent,
                resolve: {api: TrackPageResolver},
                canDeactivate: [PendingChangesGuard],
            },
            {
                path: 'albums/:id/edit',
                component: CrupdateAlbumPageComponent,
                resolve: {api: AlbumResolver},
                canDeactivate: [PendingChangesGuard],
                data: {simplified: true},
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UploadingRoutingModule {
}
