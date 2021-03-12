import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BaseProfileTab} from '../base-profile-tab';
import {Playlist} from '../../../../../models/Playlist';
import {ProfileTabFadeAnimation} from '../profile-tab-fade-animation';

@Component({
    selector: 'user-playlists-tab',
    templateUrl: './user-playlists-tab.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [ProfileTabFadeAnimation],
})
export class UserPlaylistsTabComponent extends BaseProfileTab<Playlist> {
    protected contentType = 'playlists';
}
