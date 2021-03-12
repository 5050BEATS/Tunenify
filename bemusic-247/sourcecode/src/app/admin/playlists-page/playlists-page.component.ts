import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {CurrentUser} from 'common/auth/current-user';
import {ConfirmModalComponent} from 'common/core/ui/confirm-modal/confirm-modal.component';
import {WebPlayerImagesService} from '../../web-player/web-player-images.service';
import {Modal} from 'common/core/ui/dialogs/modal.service';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Playlist} from '../../models/Playlist';
import {Paginator} from '@common/shared/paginator.service';
import {Playlists} from '../../web-player/playlists/playlists.service';
import {CrupdatePlaylistModalComponent} from '../../web-player/playlists/crupdate-playlist-modal/crupdate-playlist-modal.component';

@Component({
    selector: 'playlists-page',
    templateUrl: './playlists-page.component.html',
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None
})
export class PlaylistsPageComponent implements OnInit {
    @ViewChild(MatSort, { static: true }) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Playlist>;

    constructor(
        public paginator: Paginator<Playlist>,
        private playlists: Playlists,
        private modal: Modal,
        public currentUser: CurrentUser,
        public wpImages: WebPlayerImagesService,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Playlist>({
            uri: 'playlists',
            dataPaginator: this.paginator,
            matSort: this.matSort,
        });
    }

    /**
     * Show modal for creating a new playlist or updating existing one.
     */
    public showCrupdatePlaylistModal(playlist?: Playlist) {
        this.modal.open(CrupdatePlaylistModalComponent, {playlist}, 'crupdate-playlist-modal-container')
            .beforeClosed()
            .subscribe(playlist => {
                if ( ! playlist) return;
                this.dataSource.deselectAllItems();
                this.dataSource.reset();
            });
    }

    /**
     * Ask user to confirm deletion of selected playlists
     * and delete selected playlists if user confirms.
     */
    public confirmPlaylistsDeletion() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Playlists',
            body: 'Are you sure you want to delete selected playlists?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedPlaylists();
        });
    }

    /**
     * Delete currently selected pages.
     */
    public deleteSelectedPlaylists() {
        const ids = this.dataSource.getSelectedItems();
        this.playlists.delete(ids).subscribe(() => {
            this.dataSource.reset();
            this.dataSource.deselectAllItems();
        });
    }
}
