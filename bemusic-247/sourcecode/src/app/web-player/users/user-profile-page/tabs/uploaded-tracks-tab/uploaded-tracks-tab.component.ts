import {Component, ElementRef, Input, NgZone, OnDestroy} from '@angular/core';
import {Track} from '../../../../../models/Track';
import {BaseProfileTab} from '../base-profile-tab';
import {ProfileTabFadeAnimation} from '../profile-tab-fade-animation';
import {UserProfileService} from '../../../user-profile.service';
import {Tracks} from '../../../../tracks/tracks.service';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'uploaded-tracks-tab',
    templateUrl: './uploaded-tracks-tab.component.html',
    styleUrls: ['./uploaded-tracks-tab.component.scss'],
    animations: [ProfileTabFadeAnimation],
})
export class UploadedTracksTabComponent extends BaseProfileTab<Track> implements OnDestroy {
    @Input() contentType: string;
    private trackDeleteSub: Subscription;

    constructor(
        protected userProfile: UserProfileService,
        protected el: ElementRef<HTMLElement>,
        protected zone: NgZone,
        protected tracks: Tracks,
    ) {
        super(userProfile, el, zone);

        this.trackDeleteSub = this.tracks.tracksDeleted$
            .pipe(filter(() => !!this.pagination$.value))
            .subscribe(trackIds => {
                const newTracks = this.pagination$.value.data.filter(track => {
                    return !trackIds.includes(track.id);
                });
                this.pagination$.next({
                    ...this.pagination$.value,
                    data: newTracks
                });
            });
    }

    ngOnDestroy() {
        this.trackDeleteSub.unsubscribe();
        super.ngOnDestroy();
    }
}
