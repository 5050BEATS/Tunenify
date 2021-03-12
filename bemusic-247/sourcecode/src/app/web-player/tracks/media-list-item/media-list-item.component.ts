import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {Track} from '../../../models/Track';
import {Player} from '../../player/player.service';
import {TrackContextMenuComponent} from '../track-context-menu/track-context-menu.component';
import {ContextMenu} from '@common/core/ui/context-menu/context-menu.service';
import {Album, ALBUM_MODEL} from '../../../models/Album';
import {MixedArtist} from '../../artists/mixed-artist';
import {User} from '@common/core/types/models/User';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {AlbumContextMenuComponent} from '../../albums/album-context-menu/album-context-menu.component';
import {ComponentType} from '@angular/cdk/portal';
import {queueId} from '../../player/queue-id';
import {WpUtils} from '../../web-player-utils';
import {Settings} from '@common/core/config/settings.service';
import {TrackCommentsService} from '../track-comments.service';
import {CurrentUser} from '@common/auth/current-user';

type Media = Track | Album;

@Component({
    selector: 'media-list-item',
    templateUrl: './media-list-item.component.html',
    styleUrls: ['./media-list-item.component.scss'],
    providers: [TrackCommentsService],
})
export class MediaListItemComponent implements OnChanges {
    @Input() media: Media;
    @Input() showArtwork = true;
    @Input() showActions = true;
    @Input() reposter: User;
    @Input() @HostBinding('class.disable-links') disableLinks = false;

    public seekbarType: 'line'|'waveform';
    public artists: MixedArtist[] = [];
    public activeTrack: Track;
    public userLoggedIn: boolean;

    constructor(
        public player: Player,
        private contextMenu: ContextMenu,
        private el: ElementRef<HTMLElement>,
        public urls: WebPlayerUrls,
        private settings: Settings,
        public trackComments: TrackCommentsService,
        private currentUser: CurrentUser,
        private cd: ChangeDetectorRef,
    ) {
        this.seekbarType = this.settings.get('player.seekbar_type');
        this.userLoggedIn = this.currentUser.isLoggedIn();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.media && changes.media.currentValue) {
            if (this.isAlbum(this.media)) {
                this.artists = [this.media.artist];
                this.activeTrack = this.media.tracks && this.media.tracks[0];
                this.el.nativeElement.classList.add('is-album');
                this.media.tracks = WpUtils.assignAlbumToTracks(this.media.tracks, this.media);
            } else {
                this.artists = this.media.artists || [];
                this.activeTrack = this.media;
                this.el.nativeElement.classList.add('is-track');
            }
            this.trackComments.track = this.activeTrack;
        }
    }

    public isAlbum(media?: Album|Track): media is Album {
        if ( ! media) media = this.media;
        return media.model_type === ALBUM_MODEL;
    }

    public asAlbum(media?: Album|Track) {
        return media as Album;
    }

    public play(track: Track) {
        this.activeTrack = track;
        this.trackComments.track = this.activeTrack;
        if (this.isAlbum(this.media)) {
            this.player.playMediaItem(this.albumQueueId(this.media), this.media.tracks, track);
            this.cd.detectChanges();
        } else {
            if ( ! this.player.queue.has(track)) {
                this.player.queue.prepend([track]);
            }
            this.player.cueTrack(track).then(() => {
                this.player.play();
            });
        }
    }

    public albumQueueId(album: Album) {
        return queueId(album, 'allTracks');
    }

    public playing(track: Track) {
        return this.player.state.playing && this.player.cued(track);
    }

    public showContextMenu(media: Media, e: MouseEvent) {
        e.stopPropagation();
        const c = this.isAlbum(media) ? AlbumContextMenuComponent : TrackContextMenuComponent;
        this.contextMenu.open(c as ComponentType<any>, e.target, {data: {item: media}});
    }

    public mediaLink() {
        return this.isAlbum(this.media) ? this.urls.album(this.media) : this.urls.track(this.media);
    }
}
