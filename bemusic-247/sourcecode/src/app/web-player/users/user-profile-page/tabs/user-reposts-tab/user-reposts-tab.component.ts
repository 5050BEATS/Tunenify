import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BaseProfileTab} from '../base-profile-tab';
import {Repost} from '../../../../../models/repost';
import {ProfileTabFadeAnimation} from '../profile-tab-fade-animation';

@Component({
    selector: 'user-reposts-tab',
    templateUrl: './user-reposts-tab.component.html',
    styleUrls: ['./user-reposts-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [ProfileTabFadeAnimation],
})
export class UserRepostsTabComponent extends BaseProfileTab<Repost> {
    protected contentType = 'reposts';
}
