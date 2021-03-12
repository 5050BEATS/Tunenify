import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserLibrary} from '../user-library.service';
import {InfiniteScroll} from '@common/core/ui/infinite-scroll/infinite.scroll';
import {WebPlayerState} from '../../../web-player-state.service';
import {CurrentUser} from '@common/auth/current-user';
import {queueId} from '../../../player/queue-id';
import {User} from '@common/core/types/models/User';
import {Track, TRACK_MODEL} from '../../../../models/Track';
import {Player} from '../../../player/player.service';
import {Paginator} from '@common/shared/paginator.service';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'library-tracks',
    templateUrl: './library-tracks.component.html',
    styleUrls: ['./library-tracks.component.scss'],
    host: {class: 'user-library-page'},
    providers: [Paginator],
})
export class LibraryTracksComponent extends InfiniteScroll implements OnInit, OnDestroy {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<Track>;

    constructor(
        public library: UserLibrary,
        private state: WebPlayerState,
        private currentUser: CurrentUser,
        public player: Player,
        private paginator: Paginator<Track>,
        protected zone: NgZone,
    ) {
        super();
        this.paginator.dontUpdateQueryParams = true;
    }

    ngOnInit() {
        this.el = this.state.scrollContainer;
        this.dataSource = new PaginatedDataTableSource<Track>({
            uri: 'user/library/tracks',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            appendData: true,
        }).init();
        super.ngOnInit();
    }

    public canLoadMore() {
        return this.dataSource.canLoadNextPage();
    }

    protected isLoading() {
        return this.dataSource.loading$.value;
    }

    protected loadMoreItems() {
        this.dataSource.loadNextPage();
    }

    public queueId() {
        return queueId(this.currentUser.getModel() as User, 'libraryTracks', this.dataSource.paginationParams);
    }

    public totalCount(): number {
        return this.library.count(TRACK_MODEL);
    }
}
