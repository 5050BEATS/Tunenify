import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {Genres} from '../../web-player/genres/genres.service';
import {Genre} from '../../models/Genre';
import {CrupdateGenreModalComponent} from './crupdate-genre-modal/crupdate-genre-modal.component';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CurrentUser} from '@common/auth/current-user';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Paginator} from '@common/shared/paginator.service';
import {WebPlayerUrls} from '../../web-player/web-player-urls.service';

@Component({
    selector: 'genres',
    templateUrl: './genres.component.html',
    styleUrls: ['./genres.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GenresComponent implements OnInit {
    @ViewChild(MatSort, { static: true }) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Genre>;

    constructor(
        public paginator: Paginator<Genre>,
        private genres: Genres,
        private modal: Modal,
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Genre>({
            uri: 'genres',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {withCount: 'artists'}
        });
    }

    public openCrupdateGenreModal(genre?: Genre) {
        this.modal.open(CrupdateGenreModalComponent, {genre}, 'crupdate-genre-modal-container')
            .afterClosed()
            .subscribe(newGenre => {
                if (newGenre) {
                    this.dataSource.deselectAllItems();
                    this.dataSource.reset();
                }
            });
    }

    public confirmGenresDeletion() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Genres',
            body: 'Are you sure you want to delete selected genres?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedGenres();
        });
    }

    public deleteSelectedGenres() {
        const ids = this.dataSource.getSelectedItems();

        this.genres.delete(ids).subscribe(() => {
            this.dataSource.reset();
            this.dataSource.deselectAllItems();
        });
    }
}
