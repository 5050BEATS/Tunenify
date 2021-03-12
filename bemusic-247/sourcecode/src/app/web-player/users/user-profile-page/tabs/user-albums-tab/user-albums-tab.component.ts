import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    NgZone,
    OnDestroy
} from '@angular/core';
import {BaseProfileTab} from '../base-profile-tab';
import {Album} from '../../../../../models/Album';
import {ProfileTabFadeAnimation} from '../profile-tab-fade-animation';
import {UserProfileService} from '../../../user-profile.service';
import {Tracks} from '../../../../tracks/tracks.service';
import {filter} from 'rxjs/operators';
import {Albums} from '../../../../albums/albums.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'user-albums-tab',
    templateUrl: './user-albums-tab.component.html',
    styleUrls: ['./user-albums-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [ProfileTabFadeAnimation],
})
export class UserAlbumsTabComponent extends BaseProfileTab<Album> implements OnDestroy {
    protected contentType = 'albums';
    private albumDeleteSub: Subscription;

    constructor(
        protected userProfile: UserProfileService,
        protected el: ElementRef<HTMLElement>,
        protected zone: NgZone,
        protected albums: Albums,
    ) {
        super(userProfile, el, zone);

        this.albumDeleteSub = this.albums.albumsDeleted$
            .pipe(filter(() => !!this.pagination$.value))
            .subscribe(albumIds => {
                const newAlbums = this.pagination$.value.data.filter(album => {
                    return !albumIds.includes(album.id);
                });
                this.pagination$.next({
                    ...this.pagination$.value,
                    data: newAlbums
                });
            });
    }

    ngOnDestroy() {
        this.albumDeleteSub.unsubscribe();
        super.ngOnDestroy();
    }
}
