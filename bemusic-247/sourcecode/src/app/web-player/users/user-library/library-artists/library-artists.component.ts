import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Artist} from '../../../../models/Artist';
import {WebPlayerUrls} from '../../../web-player-urls.service';
import {Paginator} from '@common/shared/paginator.service';
import {InfiniteScroll} from '@common/core/ui/infinite-scroll/infinite.scroll';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {WebPlayerState} from '../../../web-player-state.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'library-artists',
    templateUrl: './library-artists.component.html',
    styleUrls: ['./library-artists.component.scss'],
    providers: [Paginator],
})
export class LibraryArtistsComponent extends InfiniteScroll implements OnInit, OnDestroy {
    public dataSource: PaginatedDataTableSource<Artist>;
    public artists$: Observable<Artist[]>;

    constructor(
        private paginator: Paginator<Artist>,
        public urls: WebPlayerUrls,
        private state: WebPlayerState,
        protected zone: NgZone,
    ) {
        super();
    }

    ngOnInit() {
        this.paginator.dontUpdateQueryParams = true;
        this.dataSource = new PaginatedDataTableSource<Artist>({
            uri: 'user/library/artists',
            dataPaginator: this.paginator,
            appendData: true,
        }).init();
        this.el = this.state.scrollContainer;
        this.artists$ = this.dataSource.connect();
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

    public trackByFn = (i: number, artist: Artist) => artist.id;
}
