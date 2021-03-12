import {Component, Injector, ViewEncapsulation} from '@angular/core';
import {ContextMenuComponent} from '../../context-menu/context-menu.component';
import {Artist} from '../../../models/Artist';
import {Track} from '../../../models/Track';

@Component({
    selector: 'artist-context-menu',
    templateUrl: './artist-context-menu.component.html',
    styleUrls: ['./artist-context-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'context-menu'},
})
export class ArtistContextMenuComponent extends ContextMenuComponent<Artist> {
    constructor(protected injector: Injector) {
        super(injector);
    }

    public copyLinkToClipboard() {
        super.copyLinkToClipboard('artist');
    }

    public getTracks(): Track[] {
        return [];
    }

    public goToArtistRadio() {
        this.contextMenu.close();
        this.router.navigate(this.urls.artistRadio(this.data.item));
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
}
