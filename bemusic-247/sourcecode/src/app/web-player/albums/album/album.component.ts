import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Album} from '../../../models/Album';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {FormattedDuration} from '../../player/formatted-duration.service';
import {Player} from '../../player/player.service';
import {AlbumContextMenuComponent} from '../album-context-menu/album-context-menu.component';
import {WpUtils} from '../../web-player-utils';
import {ContextMenu} from 'common/core/ui/context-menu/context-menu.service';
import {queueId} from '../../player/queue-id';
import {UserLibrary} from '../../users/user-library/user-library.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Track} from '../../../models/Track';
import {Tracks} from '../../tracks/tracks.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'album',
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    public album: Album;
    public totalDuration: string;
    public adding = false;
    public dataSource: MatTableDataSource<Track>;
    private deleteTrackSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        public urls: WebPlayerUrls,
        private duration: FormattedDuration,
        private player: Player,
        private contextMenu: ContextMenu,
        public library: UserLibrary,
        private tracksApi: Tracks,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.setAlbum(data.api.album);
            this.dataSource = new MatTableDataSource(this.album.tracks);
            this.dataSource.sort = this.matSort;
            const total = this.album.tracks.reduce((t, track) => t + track.duration, 0);
            this.totalDuration = this.duration.fromMilliseconds(total);
        });

        this.deleteTrackSub = this.tracksApi.tracksDeleted$.subscribe(trackIds => {
            this.dataSource.data = this.dataSource.data.filter(track => {
                return !trackIds.includes(track.id);
            });
        });
    }

    ngOnDestroy() {
        this.deleteTrackSub.unsubscribe();
    }

    public toggleLike() {
        this.adding = true;
        const promise = this.library.has(this.album) ?
            this.library.remove([this.album]) :
            this.library.add([this.album]);
        promise.then(() => {
            this.adding = false;
        });
    }

    public queueId() {
        return queueId(this.album, 'allTracks');
    }

    public openContextMenu(e: MouseEvent) {
        e.stopPropagation();
        this.contextMenu.open(
            AlbumContextMenuComponent,
            e.target,
            {data: {item: this.album, type: 'album'}},
        );
    }

    private setAlbum(album: Album) {
        const simplifiedAlbum = Object.assign({}, album, {tracks: []});
        album.tracks = WpUtils.assignAlbumToTracks(album.tracks, simplifiedAlbum);
        this.album = album;
    }
}
