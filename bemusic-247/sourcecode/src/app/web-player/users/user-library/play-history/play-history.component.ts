import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Paginator} from '@common/shared/paginator.service';
import {WebPlayerUrls} from '../../../web-player-urls.service';
import {WebPlayerState} from '../../../web-player-state.service';
import {InfiniteScroll} from '@common/core/ui/infinite-scroll/infinite.scroll';
import {Track} from '../../../../models/Track';
import {CurrentUser} from '@common/auth/current-user';
import {queueId} from '../../../player/queue-id';
import {User} from '@common/core/types/models/User';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'play-history',
    templateUrl: './play-history.component.html',
    styleUrls: ['./play-history.component.scss'],
    providers: [Paginator],

})
export class PlayHistoryComponent extends InfiniteScroll implements OnInit, OnDestroy {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<Track>;

    constructor(
        private paginator: Paginator<Track>,
        public urls: WebPlayerUrls,
        private state: WebPlayerState,
        private currentUser: CurrentUser,
        protected zone: NgZone,
    ) {
        super();
    }

    ngOnInit() {
        this.paginator.dontUpdateQueryParams = true;
        this.dataSource = new PaginatedDataTableSource<Track>({
            uri: `track/plays/${this.currentUser.get('id')}`,
            dataPaginator: this.paginator,
            matSort: this.matSort,
            appendData: true,
        }).init();
        this.el = this.state.scrollContainer;
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.dataSource.disconnect();
        super.ngOnDestroy();
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
        return queueId(this.currentUser.getModel() as User, 'playHistory', this.dataSource.paginationParams);
    }
}
