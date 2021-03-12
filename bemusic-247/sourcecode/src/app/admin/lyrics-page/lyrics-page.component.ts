import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {WebPlayerImagesService} from '../../web-player/web-player-images.service';
import {MatSort} from '@angular/material/sort';
import {Paginator} from '@common/shared/paginator.service';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Lyric} from '../../models/Lyric';
import {Lyrics} from '../../web-player/lyrics/lyrics.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CurrentUser} from '@common/auth/current-user';
import {Settings} from '@common/core/config/settings.service';
import {CrupdateLyricModalComponent} from './crupdate-lyric-modal/crupdate-lyric-modal.component';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';

@Component({
    selector: 'lyrics-page',
    templateUrl: './lyrics-page.component.html',
    styleUrls: ['./lyrics-page.component.scss'],
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None
})
export class LyricsPageComponent implements OnInit {
    @ViewChild(MatSort, { static: true }) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Lyric>;

    constructor(
        public paginator: Paginator<Lyric>,
        private lyrics: Lyrics,
        private modal: Modal,
        public currentUser: CurrentUser,
        private settings: Settings,
        private images: WebPlayerImagesService,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Lyric>({
            uri: 'lyrics',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {with: 'track.album.artist'},
        });
    }

    public openCrupdateLyricModal(lyric?: Lyric) {
        this.modal.open(CrupdateLyricModalComponent, {lyric}, 'crupdate-lyric-modal-container')
            .afterClosed().subscribe(() => {
                this.dataSource.deselectAllItems();
                this.dataSource.reset();
            });
    }

    public confirmLyricsDeletion() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Lyrics',
            body: 'Are you sure you want to delete selected lyrics?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedLyrics();
        });
    }

    public deleteSelectedLyrics() {
        const ids = this.dataSource.getSelectedItems();

        this.lyrics.delete(ids).subscribe(() => {
            this.dataSource.reset();
            this.dataSource.deselectAllItems();
        });
    }

    public getLyricImage(lyric: Lyric): string {
        return lyric?.track?.album?.image || this.images.getDefault('album');
    }
}
