import {Component, NgZone, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {Subscription} from 'rxjs';
import {Player} from '../../player/player.service';
import {Album} from '../../../models/Album';
import {AlbumContextMenuComponent} from '../../albums/album-context-menu/album-context-menu.component';
import {ArtistContextMenuComponent} from '../artist-context-menu/artist-context-menu.component';
import {WebPlayerState} from '../../web-player-state.service';
import {Settings} from 'common/core/config/settings.service';
import {filter, finalize} from 'rxjs/operators';
import {ContextMenu} from 'common/core/ui/context-menu/context-menu.service';
import {Artist} from '../../../models/Artist';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {InfiniteScroll} from '@common/core/ui/infinite-scroll/infinite.scroll';
import {Artists} from '../artists.service';
import {UserLibrary} from '../../users/user-library/user-library.service';
import {queueId} from '../../player/queue-id';
import { MatTableDataSource } from '@angular/material/table';
import {Track} from '../../../models/Track';

@Component({
    selector: 'artist',
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ArtistComponent extends InfiniteScroll implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    public albumsLayout: 'list' | 'grid';
    public albumsLayoutShouldBeToggleable = true;
    public activeTab = 'overview';
    public artist: Artist;
    public albums: PaginationResponse<Album>;
    public popularTracksCount = 5;
    public loading = false;
    public adding = false;
    public dataSource: MatTableDataSource<Track>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public urls: WebPlayerUrls,
        public player: Player,
        private contextMenu: ContextMenu,
        public state: WebPlayerState,
        public settings: Settings,
        private artists: Artists,
        public library: UserLibrary,
        protected zone: NgZone,
    ) {
        super();
        this.albumsLayout = this.settings.get('player.default_artist_view');
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.popularTracksCount = 5;
            this.artist = data.api.artist;
            this.albums = data.api.albums;
        });
        this.el = this.state.scrollContainer;
        this.setActiveTab(this.router.url);
        this.bindToRouterEvents();
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];
        super.ngOnDestroy();
    }

    public queueId() {
        return queueId(this.artist, 'allTracks');
    }

    public albumQueueId(album: Album) {
        return queueId(album, 'allTracks');
    }

    public togglePopularTracksCount() {
        this.popularTracksCount = this.popularTracksCount === 5 ? 20 : 5;
    }

    public getSimilar(count: number = 20) {
        if ( ! this.artist.similar) return [];
        return this.artist.similar.slice(0, count);
    }

    public hasSimilar() {
        return this.artist.similar.length;
    }

    public showAlbumContextMenu(album: Album, e: MouseEvent) {
        e.stopPropagation();
        this.contextMenu.open(
            AlbumContextMenuComponent,
            e.target,
            {overlayY: 'center', data: {item: album, type: 'album'}}
        );
    }

    public showArtistContextMenu(e: MouseEvent) {
        e.stopPropagation();

        this.contextMenu.open(
            ArtistContextMenuComponent,
            e.target,
            {data: {item: this.artist, type: 'artist'}, originX: 'center', overlayX: 'center'}
        );
    }

    public toggleAlbumsLayout() {
        if (this.albumsLayout === 'grid') {
            this.albumsLayout = 'list';
        } else {
            this.albumsLayout = 'grid';
        }
    }

    public canLoadMore() {
        return this.activeTab === 'overview' && this.albums.current_page < this.albums.last_page;
    }

    protected isLoading() {
        return this.loading;
    }

    protected loadMoreItems() {
        this.loading = true;
        this.artists.paginateArtistAlbums(this.artist.id, this.albums.current_page + 1)
            .pipe(finalize(() => this.loading = false))
            .subscribe(response => {
                this.albums = {...response, data: [...this.albums.data, ...response.data]};
            });
    }

    private bindToRouterEvents() {
        const sub = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.setActiveTab(event.url);
            });
        this.subscriptions.push(sub);
    }

    private setActiveTab(url: string) {
        const tab = url.split('/').pop();
        switch (tab) {
            case 'about':
                this.activeTab = 'about';
                break;
            case 'similar':
                this.activeTab = 'similar';
                break;
            default:
                this.activeTab = 'overview';
        }
    }

    public toggleLike() {
        this.adding = true;
        const promise = this.library.has(this.artist) ?
            this.library.remove([this.artist]) :
            this.library.add([this.artist]);
        promise.then(() => {
            this.adding = false;
        });
    }

    public albumTrackByFn = (i: number, album: Album) => album.id;
}
