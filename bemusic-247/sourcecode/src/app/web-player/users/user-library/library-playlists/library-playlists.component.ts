import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {WebPlayerUrls} from '../../../web-player-urls.service';
import {Playlist} from '../../../../models/Playlist';
import {PlaylistContextMenuComponent} from '../../../playlists/playlist-context-menu/playlist-context-menu.component';
import {ActivatedRoute} from '@angular/router';
import {Settings} from 'common/core/config/settings.service';
import {ContextMenu} from 'common/core/ui/context-menu/context-menu.service';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Paginator} from '@common/shared/paginator.service';
import {WebPlayerState} from '../../../web-player-state.service';
import {InfiniteScroll} from '@common/core/ui/infinite-scroll/infinite.scroll';
import {Observable} from 'rxjs';
import {CurrentUser} from '@common/auth/current-user';

@Component({
    selector: 'library-playlists',
    templateUrl: './library-playlists.component.html',
    styleUrls: ['./library-playlists.component.scss'],
    host: {class: 'user-library-page'},
})
export class LibraryPlaylistsComponent extends InfiniteScroll implements OnInit, OnDestroy {
    public playlists$: Observable<Playlist[]>;
    public dataSource: PaginatedDataTableSource<Playlist>;

    constructor(
        public urls: WebPlayerUrls,
        private settings: Settings,
        private contextMenu: ContextMenu,
        private route: ActivatedRoute,
        private paginator: Paginator<Playlist>,
        private state: WebPlayerState,
        protected zone: NgZone,
        private currentUser: CurrentUser,
    ) {
        super();
    }

    public showContextMenu(playlist: Playlist, e: MouseEvent) {
        e.stopPropagation();

        this.contextMenu.open(
            PlaylistContextMenuComponent,
            e.target,
            {data: {item: playlist, type: 'playlist'}}
        );
    }

    ngOnInit() {
        this.paginator.dontUpdateQueryParams = true;
        this.dataSource = new PaginatedDataTableSource<Playlist>({
            uri: `user/${this.currentUser.get('id')}/playlists`,
            dataPaginator: this.paginator,
            appendData: true,
        }).init();
        this.el = this.state.scrollContainer;
        this.playlists$ = this.dataSource.connect();
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

    public trackByFn = (i: number, playlist: Playlist) => playlist.id;
}
