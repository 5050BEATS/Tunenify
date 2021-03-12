import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Channel} from '../../../../admin/channels/channel';
import {WebPlayerUrls} from '../../../web-player-urls.service';
import {Track, TRACK_MODEL} from '../../../../models/Track';
import {ALBUM_MODEL} from '../../../../models/Album';
import {ARTIST_MODEL} from '../../../../models/Artist';
import {PLAYLIST_MODEL} from '../../../../models/Playlist';
import {USER_MODEL} from '@common/core/types/models/User';
import {GENRE_MODEL} from '../../../../models/Genre';
import {MIXED_ARTIST_MODEL} from '../../../artists/mixed-artist';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {CurrentUser} from '@common/auth/current-user';

@Component({
    selector: 'channel-content',
    templateUrl: './channel-content.component.html',
    styleUrls: ['./channel-content.component.scss'],
})
export class ChannelContentComponent implements AfterViewInit, OnInit {
    @Input() channel: Channel;
    @Input() disablePlayback = false;
    @Input() nested = false;
    @ViewChild(MatSort) matSort: MatSort;

    public trackTableSource: MatTableDataSource<Track>;
    public modelTypes = {
        track: TRACK_MODEL,
        album: ALBUM_MODEL,
        artist: ARTIST_MODEL,
        user: USER_MODEL,
        playlist: PLAYLIST_MODEL,
        genre: GENRE_MODEL,
        mixedArtist: MIXED_ARTIST_MODEL,
    };

    constructor(
        public urls: WebPlayerUrls,
        public user: CurrentUser
    ) {}

    ngOnInit() {
        if (this.channel.layout === 'trackTable') {
            this.trackTableSource = new MatTableDataSource(this.channel.content as Track[]);
        }
    }

    ngAfterViewInit() {
        if (this.channel.layout === 'trackTable') {
            this.trackTableSource.sort = this.matSort;
        }
    }
}
