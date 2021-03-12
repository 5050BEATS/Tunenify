import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, NgZone} from '@angular/core';
import {BaseProfileTab} from '../base-profile-tab';
import {User} from '@common/core/types/models/User';
import {WebPlayerUrls} from '../../../../web-player-urls.service';
import {CurrentUser} from '@common/auth/current-user';
import {UserProfileService} from '../../../user-profile.service';
import {ProfileTabFadeAnimation} from '../profile-tab-fade-animation';

@Component({
    selector: 'user-follows-tab',
    templateUrl: './user-follows-tab.component.html',
    styleUrls: ['./user-follows-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [ProfileTabFadeAnimation],
})
export class UserFollowsTabComponent extends BaseProfileTab<User> {
    @Input() contentType: string;
    constructor(
        public profile: UserProfileService,
        protected el: ElementRef<HTMLElement>,
        public urls: WebPlayerUrls,
        public currentUser: CurrentUser,
        public cd: ChangeDetectorRef,
        protected zone: NgZone,
    ) {
        super(profile, el, zone);
    }

    public isCurrentUser(user: User) {
        return user.id === this.currentUser.get('id');
    }
}
