import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Settings} from '@common/core/config/settings.service';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {User} from '@common/core/types/models/User';
import {CurrentUser} from 'common/auth/current-user';
import {Users} from '@common/auth/users.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {EditUserProfileModalComponent} from './edit-user-profile-modal/edit-user-profile-modal.component';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {Toast} from '@common/core/ui/toast.service';
import {DomSanitizer} from '@angular/platform-browser';
import {getFaviconFromUrl} from '@common/core/utils/get-favicon-from-url';
import {UserProfileService} from '../user-profile.service';

@Component({
    selector: 'user-profile-page',
    templateUrl: './user-profile-page.component.html',
    styleUrls: ['./user-profile-page.component.scss'],
    providers: [UploadQueueService],
})
export class UserProfilePageComponent implements OnInit, OnDestroy {
    public tabs$ = new BehaviorSubject<string[]>([]);
    private subscriptions: Subscription[] = [];
    public user$ = new BehaviorSubject<User>(null);
    public activeTab: string;
    public canUploadTracks$ = new BehaviorSubject<boolean>(false);

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected settings: Settings,
        public urls: WebPlayerUrls,
        protected users: Users,
        public currentUser: CurrentUser,
        public cd: ChangeDetectorRef,
        public profile: UserProfileService,
        protected modal: Modal,
        protected toast: Toast,
        protected sanitizer: DomSanitizer,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.canUploadTracks$.next(data.api.canUploadTracks);
            this.user$.next(data.api.user);
            let defaultTabs = ['likes', 'playlists', 'following', 'followers'];
            if (this.canUploadTracks$.value) {
                defaultTabs = [...['tracks', 'albums', 'reposts'], ...defaultTabs];
            }
            this.tabs$.next(defaultTabs);
            this.setActiveTab(this.router.url);
        });
        const sub = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.setActiveTab(event.url);
            });
        this.subscriptions.push(sub);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];
    }

    public getProfileBackground() {
        const profile = this.user$.value.profile;
        if (profile.header_colors || profile.header_image) {
            const background = profile.header_image ?
                `url(${profile.header_image})` :
                `linear-gradient(315deg, ${profile.header_colors[0]} 0%, ${profile.header_colors[1]} 100%)`;
            return this.sanitizer.bypassSecurityTrustStyle(background);
        }
    }

    public activeTabIs(name: string) {
        return this.activeTab === name;
    }

    public setActiveTab(url: string) {
        const tab = url.split('/').pop();
        this.activeTab = this.tabs$.value.includes(tab) ? tab : this.tabs$.value[0];
    }

    public openEditProfileModal() {
        this.modal.open(EditUserProfileModalComponent, {user: this.user$.value})
            .beforeClosed()
            .subscribe(updatedUser => {
                if (updatedUser) {
                    this.user$.next({...this.user$.value, ...updatedUser});
                }
            });
    }

    public favicon(url: string) {
        return getFaviconFromUrl(url);
    }
}
