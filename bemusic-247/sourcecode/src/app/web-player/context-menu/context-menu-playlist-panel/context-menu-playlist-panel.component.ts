import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {UserPlaylists} from "../../playlists/user-playlists.service";
import {Track} from "../../../models/Track";
import {Playlists} from "../../playlists/playlists.service";
import {Playlist} from "../../../models/Playlist";
import {CurrentUser} from "common/auth/current-user";
import {Router} from "@angular/router";
import {CrupdatePlaylistModalComponent} from "../../playlists/crupdate-playlist-modal/crupdate-playlist-modal.component";
import {Modal} from "common/core/ui/dialogs/modal.service";
import {ContextMenu} from 'common/core/ui/context-menu/context-menu.service';
import {Toast} from 'common/core/ui/toast.service';

@Component({
    selector: 'context-menu-playlist-panel',
    templateUrl: './context-menu-playlist-panel.component.html',
    styleUrls: ['./context-menu-playlist-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContextMenuPlaylistPanelComponent {
    @Input() tracks: Track[] = [];
    @Output() close$ = new EventEmitter();

    constructor(
        public userPlaylists: UserPlaylists,
        private playlists: Playlists,
        public contextMenu: ContextMenu,
        private modal: Modal,
        private currentUser: CurrentUser,
        private router: Router,
        private toast: Toast,
    ) {}

    /**
     * Open new playlist modal and attach
     * tracks to newly created playlist.
     */
    public openNewPlaylistModal() {
        this.contextMenu.close();

        if ( ! this.currentUser.isLoggedIn()) {
            return this.router.navigate(['/login']);
        }

        this.modal.open(CrupdatePlaylistModalComponent, null, 'crupdate-playlist-modal-container')
            .afterClosed().subscribe(playlist => {
                if ( ! playlist) return;
                this.userPlaylists.add(playlist);
                this.addTracks(playlist);
            });
    }

    /**
     * Add tracks to specified playlist.
     */
    public addTracks(playlist: Playlist) {
        this.playlists.addTracks(playlist.id, this.tracks)
            .subscribe(() => {
                this.contextMenu.close();
                this.toast.open('Added to playlist');
            }, () => {});
    }

    /**
     * Close playlists panel.
     */
    public closePanel() {
        this.close$.emit();
    }
}
