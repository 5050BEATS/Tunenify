import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Settings} from 'common/core/config/settings.service';
import {Albums} from '../../../web-player/albums/albums.service';
import {Modal} from 'common/core/ui/dialogs/modal.service';
import { MatSort } from '@angular/material/sort';
import {Album} from '../../../models/Album';
import {ConfirmModalComponent} from 'common/core/ui/confirm-modal/confirm-modal.component';
import {CurrentUser} from 'common/auth/current-user';
import {WebPlayerUrls} from '../../../web-player/web-player-urls.service';
import {WebPlayerImagesService} from '../../../web-player/web-player-images.service';
import {Paginator} from '@common/shared/paginator.service';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';

@Component({
    selector: 'album-index',
    templateUrl: './album-index.component.html',
    styleUrls: ['./album-index.component.scss'],
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None
})
export class AlbumIndexComponent implements OnInit {
    @ViewChild(MatSort, { static: true }) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Album>;

    constructor(
        private paginator: Paginator<Album>,
        private settings: Settings,
        private modal: Modal,
        private albums: Albums,
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
        public images: WebPlayerImagesService,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Album>({
            uri: 'albums',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {order_by: 'spotify_popularity', withCount: 'tracks'}
        });
    }

    public maybeDeleteSelectedAlbums() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Albums',
            body:  'Are you sure you want to delete selected albums?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedAlbums();
        });
    }

    private deleteSelectedAlbums() {
        const ids = this.dataSource.getSelectedItems();

        this.albums.delete(ids).subscribe(() => {
            this.dataSource.deselectAllItems();
            this.dataSource.reset();
        });
    }
}
