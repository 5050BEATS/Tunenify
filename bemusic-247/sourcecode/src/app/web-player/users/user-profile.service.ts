import {ChangeDetectorRef, Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {BackendResponse} from '@common/core/types/backend-response';
import {User} from '@common/core/types/models/User';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {Track} from '../../models/Track';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';
import {CurrentUser} from '@common/auth/current-user';

const BASE_URI = 'user-profile';

export interface GetProfileResponse {
    user: User;
    canUploadTracks: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UserProfileService {
    constructor(private http: AppHttpClient, private currentUser: CurrentUser) {}

    public get(id: number): BackendResponse<GetProfileResponse> {
        return this.http.get(`${BASE_URI}/${id}`);
    }

    public update(id: number, params: object): BackendResponse<{user: User}> {
        return this.http.put(`${BASE_URI}/${id}`, params);
    }

    public loadMore<T>(userId: number, contentType: string, params: {page: number}): PaginatedBackendResponse<T> {
        return this.http.get(`${BASE_URI}/${userId}/load-more/${contentType}`, params);
    }

    public follow(user: User, cd: ChangeDetectorRef) {
        this.http.post(`users/${user.id}/follow`).subscribe(() => {
            this.currentUser.getModel().followed_users.push(user);
            cd.markForCheck();
        });
    }

    public unfollow(user: User, cd: ChangeDetectorRef) {
        this.http.post(`users/${user.id}/unfollow`).subscribe(() => {
            const followedUsers = this.currentUser.getModel().followed_users,
                i = followedUsers.findIndex(curr => curr.id === user.id);
            followedUsers.splice(i, 1);
            cd.markForCheck();
        });
    }

    public currentUserIsFollowing(user: User): boolean {
        if ( ! this.currentUser.getModel().followed_users) return false;
        return !!this.currentUser.getModel().followed_users.find(curr => curr.id === user.id);
    }
}
