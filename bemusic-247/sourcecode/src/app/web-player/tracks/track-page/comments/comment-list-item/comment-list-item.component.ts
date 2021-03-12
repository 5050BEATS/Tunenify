import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {TrackComment} from '../../../../../models/TrackComment';
import {FormattedDuration} from '../../../../player/formatted-duration.service';
import {TrackCommentsService} from '../../../track-comments.service';
import {BehaviorSubject} from 'rxjs';
import {CurrentUser} from '@common/auth/current-user';

@Component({
    selector: 'comment-list-item',
    templateUrl: './comment-list-item.component.html',
    styleUrls: ['./comment-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentListItemComponent {
    @Input() comment: TrackComment;
    @Input() parent: TrackComment;
    public commentFormVisible$ = new BehaviorSubject<boolean>(false);

    @HostBinding('style.padding-left') get paddingLeft() {
        return (this.comment.depth * 25) + 'px';
    }

    @HostBinding('class.nested') get nested() {
        return this.comment.depth;
    }

    constructor(
        public trackDuration: FormattedDuration,
        private trackComments: TrackCommentsService,
        public currentUser: CurrentUser,
    ) {}

    public postedAt(position: number): string {
        return this.trackDuration.fromSeconds((position / 100) * (this.trackComments.track.duration / 1000));
    }

    public toggleNewCommentForm() {
        this.commentFormVisible$.next(!this.commentFormVisible$.value);
    }

    public hideNewCommentForm() {
        this.commentFormVisible$.next(false);
    }
}
