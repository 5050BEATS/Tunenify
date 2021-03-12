import {Component, Injector, ViewEncapsulation} from '@angular/core';
import {Album} from '../../../models/Album';
import {WpUtils} from '../../web-player-utils';
import {ContextMenuComponent} from '../../context-menu/context-menu.component';
import {USER_MODEL} from '@common/core/types/models/User';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {Albums} from '../albums.service';
import {tap} from 'rxjs/operators';

@Component({
    selector: 'album-context-menu',
    templateUrl: './album-context-menu.component.html',
    styleUrls: ['./album-context-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'context-menu'},
})
export class AlbumContextMenuComponent extends ContextMenuComponent<Album> {
    public editAlbumUrl: (string | number)[];
    constructor(
        protected injector: Injector,
        private albums: Albums,
    ) {
        super(injector);
        if (this.currentUser.isAdmin()) {
            this.editAlbumUrl = ['admin/albums', this.data.item.id];
        } else {
            this.editAlbumUrl = ['upload/albums', this.data.item.id, 'edit'];
        }
    }

    public async addToQueue() {
        await this.maybeLoadTracks();
        this.player.queue.prepend(this.getTracks());
        this.contextMenu.close();
    }

    public async openPanel(name: string) {
        if (name === 'playlist') {
            this.maybeLoadTracks();
        }
        this.activePanel = name;
    }

    private maybeLoadTracks() {
        // load album tracks if not loaded already
        if (typeof this.data.item.tracks === 'undefined') {
            return this.albums.get(this.data.item.id, {simplified: true})
                .pipe(tap((response) => {
                    this.data.item.tracks = response.album.tracks;
                    if ( ! this.data.item.tracks.length) {
                        this.toast.open('This album has no tracks yet.');
                    }
                }))
                .toPromise();
        } else {
            return Promise.resolve();
        }
    }

    /**
     * Copy fully qualified album url to clipboard.
     */
    public copyLinkToClipboard() {
        super.copyLinkToClipboard('album');
    }

    /**
     * Get tracks that should be used by context menu.
     */
    public getTracks() {
        return WpUtils.assignAlbumToTracks(this.data.item.tracks, this.data.item);
    }

    public inLibrary() {
        return this.library.has(this.data.item);
    }

    public removeFromLibrary() {
        this.contextMenu.close();

        if ( ! this.currentUser.isLoggedIn()) {
            return this.router.navigate(['/login']);
        }

        this.library.remove([this.data.item]);
        this.toast.open('Removed from library');
    }

    public canEditAlbum(permission = 'albums.update') {
        const userOwnsTrack = this.data.item.artist_type === USER_MODEL &&
            this.data.item.artist_id === this.currentUser.get('id');
        return userOwnsTrack || this.currentUser.hasPermission(permission);
    }

    public maybeDeleteAlbum() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Album',
            body:  'Are you sure you want to delete this album?',
            ok:    'Delete'
        }).beforeClosed().subscribe(confirmed => {
            if (confirmed) {
                this.albums.delete([this.data.item.id]).subscribe(() => {
                    this.toast.open('Album deleted.');
                });
            }
        });
    }
}
