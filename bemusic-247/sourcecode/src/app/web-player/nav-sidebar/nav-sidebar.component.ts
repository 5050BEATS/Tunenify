import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Settings} from 'common/core/config/settings.service';
import {SearchSlideoutPanel} from '../search/search-slideout-panel/search-slideout-panel.service';
import {CurrentUser} from 'common/auth/current-user';
import {Player} from '../player/player.service';
import {WebPlayerUrls} from '../web-player-urls.service';
import {UserPlaylists} from '../playlists/user-playlists.service';
import {Modal} from 'common/core/ui/dialogs/modal.service';
import {CrupdatePlaylistModalComponent} from '../playlists/crupdate-playlist-modal/crupdate-playlist-modal.component';
import {Router} from '@angular/router';
import {AuthService} from 'common/auth/auth.service';
import {ThemeService} from '@common/core/theme.service';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'nav-sidebar',
    templateUrl: './nav-sidebar.component.html',
    styleUrls: ['./nav-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NavSidebarComponent implements OnInit {
    public unreadCount$ = new BehaviorSubject<number>(0);

    constructor(
        public settings: Settings,
        public searchPanel: SearchSlideoutPanel,
        public currentUser: CurrentUser,
        public player: Player,
        public urls: WebPlayerUrls,
        public auth: AuthService,
        public playlists: UserPlaylists,
        private modal: Modal,
        private router: Router,
        public theme: ThemeService,
    ) {}

    ngOnInit() {
        this.unreadCount$.next(this.currentUser.get('unread_notifications_count'));
    }

    public openNewPlaylistModal() {
        if ( ! this.currentUser.isLoggedIn()) {
            return this.router.navigate(['/login']);
        }

        this.modal.open(CrupdatePlaylistModalComponent, null, 'crupdate-playlist-modal-container')
            .afterClosed()
            .subscribe(playlist => {
            if ( ! playlist) return;
            this.playlists.add(playlist);
            this.router.navigate(this.urls.playlist(playlist));
        });
    }
}
