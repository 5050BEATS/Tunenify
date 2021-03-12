import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Track} from '../../../models/Track';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {Player} from '../../player/player.service';
import {FormattedDuration} from '../../player/formatted-duration.service';
import {WpUtils} from '../../web-player-utils';
import {ContextMenu} from 'common/core/ui/context-menu/context-menu.service';
import {queueId} from '../../player/queue-id';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {TrackCommentsService} from '../track-comments.service';
import {Settings} from '@common/core/config/settings.service';
import {CurrentUser} from '@common/auth/current-user';

@Component({
    selector: 'track-page',
    templateUrl: './track-page.component.html',
    styleUrls: ['./track-page.component.scss'],
    providers: [TrackCommentsService],
})
export class TrackPageComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    public track: Track;
    public duration: string;
    public dataSource: MatTableDataSource<Track>;
    public tracks: Track[] = [];
    public showWave: boolean;

    constructor(
        private route: ActivatedRoute,
        public urls: WebPlayerUrls,
        private player: Player,
        private contextMenu: ContextMenu,
        private durationService: FormattedDuration,
        public trackComments: TrackCommentsService,
        public settings: Settings,
        public currentUser: CurrentUser,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.track = data.api.track;
            this.showWave = this.track.local_only && this.settings.get('player.seekbar_type') === 'waveform';
            this.duration = this.durationService.fromMilliseconds(this.track.duration);
            this.tracks = this.track.album ?
                WpUtils.assignAlbumToTracks(this.track.album.tracks, this.track.album) :
                [this.track];
            this.dataSource = new MatTableDataSource(this.tracks);
            this.dataSource.sort = this.matSort;

            this.trackComments.track = this.track;
            this.trackComments.pagination$.next(data.api.comments);
        });
    }

    public queueId() {
        return queueId(this.track.album ? this.track.album : this.track, 'allTracks');
    }
}
