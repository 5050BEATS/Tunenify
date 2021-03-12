import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Album} from '../../../../models/Album';
import {WebPlayerUrls} from '../../../web-player-urls.service';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Paginator} from '@common/shared/paginator.service';
import {Observable} from 'rxjs';
import {InfiniteScroll} from '@common/core/ui/infinite-scroll/infinite.scroll';
import {WebPlayerState} from '../../../web-player-state.service';

@Component({
    selector: 'library-albums',
    templateUrl: './library-albums.component.html',
    styleUrls: ['./library-albums.component.scss'],
    providers: [Paginator],
})
export class LibraryAlbumsComponent extends InfiniteScroll implements OnInit, OnDestroy {
    public dataSource: PaginatedDataTableSource<Album>;
    public albums$: Observable<Album[]>;

    constructor(
        private paginator: Paginator<Album>,
        public urls: WebPlayerUrls,
        private state: WebPlayerState,
        protected zone: NgZone,
    ) {
        super();
    }

    ngOnInit() {
        this.paginator.dontUpdateQueryParams = true;
        this.dataSource = new PaginatedDataTableSource<Album>({
            uri: 'user/library/albums',
            dataPaginator: this.paginator,
            appendData: true,
        }).init();
        this.el = this.state.scrollContainer;
        this.albums$ = this.dataSource.connect();
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

    public trackByFn = (i: number, album: Album) => album.id;
}
