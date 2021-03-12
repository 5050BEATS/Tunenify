import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Album} from '../../../models/Album';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {ComponentCanDeactivate} from '@common/guards/pending-changes/component-can-deactivate';
import {AlbumFormComponent} from '../../../uploading/album-form/album-form.component';
import {Settings} from '@common/core/config/settings.service';
import {CurrentUser} from '@common/auth/current-user';

@Component({
    selector: 'crupdate-album-page',
    templateUrl: './crupdate-album-page.component.html',
    styleUrls: ['./crupdate-album-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UploadQueueService],
})
export class CrupdateAlbumPageComponent implements OnInit, ComponentCanDeactivate {
    @ViewChild(AlbumFormComponent, {static: true}) albumForm: AlbumFormComponent;
    public album: Album;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private currentUser: CurrentUser,
        public settings: Settings,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            if (data.api) {
                this.album = data.api.album;
            }
        });
    }

    public toAlbumsPage() {
        if (this.router.url.includes('admin')) {
            this.router.navigate(['/admin/albums']);
        } else {
            this.router.navigate(['/user', this.currentUser.get('id'), this.currentUser.get('display_name'), 'albums']);
        }
    }

    public canDeactivate() {
        return !this.albumForm.form.dirty;
    }
}
