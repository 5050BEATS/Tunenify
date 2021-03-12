import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Tracks} from '../../../web-player/tracks/tracks.service';
import {FormattedDuration} from '../../../web-player/player/formatted-duration.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Modal} from 'common/core/ui/dialogs/modal.service';
import {CurrentUser} from 'common/auth/current-user';
import {Track} from '../../../models/Track';
import { MatSort } from '@angular/material/sort';
import {CrupdateLyricModalComponent} from '../../lyrics-page/crupdate-lyric-modal/crupdate-lyric-modal.component';
import {ConfirmModalComponent} from 'common/core/ui/confirm-modal/confirm-modal.component';
import {WebPlayerUrls} from '../../../web-player/web-player-urls.service';
import {Paginator} from '@common/shared/paginator.service';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';

@Component({
    selector: 'track-index',
    templateUrl: './track-index.component.html',
    styleUrls: ['./track-index.component.scss'],
    providers: [Paginator],
    encapsulation: ViewEncapsulation.None
})
export class TrackIndexComponent implements OnInit {
    @ViewChild(MatSort, { static: true }) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Track>;

    constructor(
        private modal: Modal,
        private tracks: Tracks,
        private duration: FormattedDuration,
        private route: ActivatedRoute,
        private router: Router,
        public currentUser: CurrentUser,
        private paginator: Paginator<Track>,
        public urls: WebPlayerUrls,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Track>({
            uri: 'tracks',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {order_by: 'spotify_popularity', with: 'artists'}
        });
    }

    public openCrupdateLyricModal(track: Track) {
        this.modal.open(CrupdateLyricModalComponent, {track, lyric: track.lyric}, 'crupdate-lyric-modal-container')
            .afterClosed().subscribe(lyric => {
            if ( ! lyric) return;
            track.lyric = lyric;
        });
    }

    public maybeDeleteSelectedTracks() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Tracks',
            body:  'Are you sure you want to delete selected tracks?',
            ok:    'Delete'
        }).beforeClosed().subscribe(confirmed => {
            if (confirmed) {
                this.deleteSelectedTracks();
            } else {
                this.dataSource.deselectAllItems();
            }
        });
    }

    private deleteSelectedTracks() {
        const ids = this.dataSource.selectedRows.selected.map(track => track.id);
        this.tracks.delete(ids).subscribe(() => {
            this.dataSource.reset();
        });
    }

    public formatDuration(duration: number) {
        return this.duration.fromMilliseconds(duration);
    }
}
