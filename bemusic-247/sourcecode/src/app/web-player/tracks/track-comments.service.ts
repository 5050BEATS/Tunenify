import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {TrackComment} from '../../models/TrackComment';
import {CommentsService} from '@common/shared/comments/comments.service';
import {Track, TRACK_MODEL} from '../../models/Track';
import {Toast} from '@common/core/ui/toast.service';
import {CurrentUser} from '@common/auth/current-user';
import {Player} from '../player/player.service';
import {finalize} from 'rxjs/operators';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {Tracks} from './tracks.service';

@Injectable({
    providedIn: 'root'
})
export class TrackCommentsService {
    public waveComments$ = new BehaviorSubject<TrackComment[]>([]);
    public pagination$ = new BehaviorSubject<PaginationResponse<TrackComment>>(null);
    public track: Track;
    public loading$ = new BehaviorSubject<boolean>(false);
    public loadingMore$ = new BehaviorSubject<boolean>(false);
    public markerPosition$ = new BehaviorSubject<number|null>(null);
    public markerActive$ = new BehaviorSubject<boolean>(false);

    constructor(
        private comments: CommentsService,
        private toast: Toast,
        private currentUser: CurrentUser,
        private player: Player,
        private tracks: Tracks,
    ) {}

    public create(content: string, inReplyTo?: TrackComment): Promise<TrackComment> {
        return new Promise(resolve => {
            this.loading$.next(true);
            const position = this.markerPosition$.value != null ?
                this.markerPosition$.value :
                (this.player.getCurrentTime() / this.player.getDuration()) * 100;
            this.comments.create<TrackComment>({
                commentable_id: this.track.id,
                commentable_type: TRACK_MODEL,
                content: content,
                position: position || 0,
                inReplyTo,
            }).pipe(finalize(() => this.loading$.next(false))).subscribe(response => {
                const newComment = response.comment;
                newComment.user = this.currentUser.getModel();
                if (inReplyTo) {
                    const i = this.pagination$.value.data.findIndex(c => c.id === inReplyTo.id);
                    this.pagination$.value.data.splice(i + 1, 0, newComment);
                    this.pagination$.next({...this.pagination$.value});
                } else {
                    // wave comments
                    this.waveComments$.next([
                        ...this.waveComments$.value, newComment
                    ]);

                    // paginated comments (if on main track page)
                    if (this.pagination$.value) {
                        this.pagination$.value.data.unshift(newComment);
                        this.pagination$.next({...this.pagination$.value});
                    }
                }
                this.track.comments_count++;
                this.markerPosition$.next(null);
                this.markerActive$.next(false);
                this.toast.open('Comment posted.');
                resolve(response.comment);
            });
        });
    }

    public loadMore() {
        this.loadingMore$.next(true);
        return this.tracks.loadComments(this.track.id, {page: this.pagination$.value.current_page + 1})
            .pipe(finalize(() => this.loadingMore$.next(false)))
            .subscribe(response => {
                this.pagination$.next({
                    ...response.pagination, data: [...this.pagination$.value.data, ...response.pagination.data]
                });
            });
    }
}
