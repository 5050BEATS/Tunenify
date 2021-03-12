import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Paginator} from '@common/shared/paginator.service';
import {Artist} from '../../models/Artist';
import { MatSort } from '@angular/material/sort';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Artists} from '../../web-player/artists/artists.service';
import {CurrentUser} from '@common/auth/current-user';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {WebPlayerUrls} from '../../web-player/web-player-urls.service';

@Component({
    selector: 'artists',
    templateUrl: './artists.component.html',
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None,
})
export class ArtistsComponent implements OnInit {
    @ViewChild(MatSort, { static: true }) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Artist>;

    constructor(
        public paginator: Paginator<Artist>,
        private artists: Artists,
        private modal: Modal,
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Artist>({
            uri: 'artists',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {order_by: 'spotify_popularity'},
        });
    }

    public maybeDeleteSelectedArtists() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Artists',
            body:  'Are you sure you want to delete selected artists?',
            ok:    'Delete'
        }).beforeClosed().subscribe(confirmed => {
            if (confirmed) {
                this.deleteSelectedArtists();
            } else {
                this.dataSource.deselectAllItems();
            }
        });
    }

    public deleteSelectedArtists() {
        const ids = this.dataSource.getSelectedItems();

        this.artists.delete(ids).subscribe(() => {
            this.dataSource.reset();
            this.dataSource.deselectAllItems();
        });
    }
}
