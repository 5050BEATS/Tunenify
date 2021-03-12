import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {FormattedDuration} from '../../player/formatted-duration.service';
import {PlaylistContextMenuComponent} from '../playlist-context-menu/playlist-context-menu.component';
import {GetPlaylistResponse, Playlists} from '../playlists.service';
import {Track} from '../../../models/Track';
import {ContextMenu} from 'common/core/ui/context-menu/context-menu.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {WebPlayerState} from '../../web-player-state.service';
import {UserPlaylists} from '../user-playlists.service';
import {queueId} from '../../player/queue-id';
import {Playlist} from '../../../models/Playlist';
import {InfiniteScroll} from '@common/core/ui/infinite-scroll/infinite.scroll';
import {User} from '@common/core/types/models/User';
import {Subscription} from 'rxjs';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Paginator} from '@common/shared/paginator.service';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss'],
    providers: [Paginator],
})
export class PlaylistComponent extends InfiniteScroll implements OnInit, OnDestroy {
    @ViewChild(MatSort, { static: true }) matSort: MatSort;
    public playlist: Playlist;
    public totalDuration: string;
    public following = false;
    private subscriptions: Subscription[] = [];
    public dataSource: PaginatedDataTableSource<Track>;

    constructor(
        private route: ActivatedRoute,
        public urls: WebPlayerUrls,
        private duration: FormattedDuration,
        private contextMenu: ContextMenu,
        private playlists: Playlists,
        public state: WebPlayerState,
        public userPlaylists: UserPlaylists,
        private paginator: Paginator<Track>,
        protected zone: NgZone,
    ) {
        super();
    }

    ngOnInit() {
        this.el = this.state.scrollContainer;
        this.paginator.dontUpdateQueryParams = true;
        this.route.data.subscribe((data: {api: GetPlaylistResponse}) => {
            this.dataSource = new PaginatedDataTableSource<Track>({
                uri: `playlists/${data.api.playlist.id}/tracks`,
                initialData: data.api.tracks,
                dataPaginator: this.paginator,
                matSort: this.matSort,
                appendData: true,
            }).init();
            this.playlist = data.api.playlist;
            this.bindToPlaylistEvents();
            this.totalDuration = this.duration.toVerboseString(data.api.totalDuration);
        });
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.dataSource && this.dataSource.disconnect();
        this.subscriptions.forEach(s => s.unsubscribe());
        super.ngOnDestroy();
    }

    public queueId() {
        return queueId(this.playlist, 'allTracks', this.dataSource.paginationParams);
    }

    public removeTracksFromPlaylist(tracks: Track[]) {
        this.playlists.removeTracks(this.playlist.id, tracks).subscribe();
    }

    public openContextMenu(e: MouseEvent) {
        e.stopPropagation();
        this.contextMenu.open(
            PlaylistContextMenuComponent,
            e.target,
            {originX: 'center', overlayX: 'center', data: {item: this.playlist, type: 'playlist'}}
        );
    }

    public reorderPlaylist(e: CdkDragDrop<Track>) {
        const newData = [...this.dataSource.data];
        moveItemInArray(newData, e.previousIndex, e.currentIndex);
        const ids = newData.map(track => track.id);
        this.playlists.changeTrackOrder(this.playlist.id, ids).subscribe();
        this.dataSource.data = newData;
    }

    public toggleFollow() {
        this.userPlaylists.following(this.playlist.id) ?
            this.userPlaylists.unfollow(this.playlist) :
            this.userPlaylists.follow(this.playlist);
    }

    public getCreator(): User {
        return this.playlist.editors[0];
    }

    public bindToPlaylistEvents() {
        const sub1 = this.playlists.addedTracks$.subscribe(e => {
            if (e.id !== this.playlist.id) return;
            this.dataSource.data = this.dataSource.data.concat(e.tracks);
        });
        const sub2 = this.playlists.removedTracks$.subscribe(e => {
            if (e.id !== this.playlist.id) return;
            e.tracks.forEach(track => {
                const i = this.dataSource.data.findIndex(curr => curr.id === track.id);
                this.dataSource.data.splice(i, 1);
                this.dataSource.data = this.dataSource.data;
            });
        });
        const sub3 = this.playlists.updated$.subscribe(playlist => {
            this.playlist = playlist;
        });
        this.subscriptions = [sub1, sub2, sub3];
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
}
