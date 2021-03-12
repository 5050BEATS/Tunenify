import {
    ChangeDetectionStrategy,
    Component, ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    Output,
    SimpleChanges, ViewChild
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CurrentUser} from '@common/auth/current-user';
import {TrackCommentsService} from '../track-comments.service';
import {TrackComment} from '../../../models/TrackComment';

@Component({
    selector: 'new-comment-form',
    templateUrl: './new-comment-form.component.html',
    styleUrls: ['./new-comment-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'comment-marker-ancestor'},
})
export class NewCommentFormComponent implements OnChanges {
    @Input() inReplyTo: TrackComment;
    @Input() @HostBinding('class.visible') visible = false;
    @Output() created = new EventEmitter<TrackComment>();
    @ViewChild('input', {static: true}) inputEl: ElementRef<HTMLInputElement>;
    public commentControl = new FormControl();

    constructor(
        public trackComments: TrackCommentsService,
        public currentUser: CurrentUser,
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.visible.previousValue === false && changes.visible.currentValue) {
            setTimeout(() => {
                this.inputEl.nativeElement.focus();
            });
        }
    }

    public submit() {
        this.trackComments.create(this.commentControl.value, this.inReplyTo)
            .then(comment => {
                this.commentControl.reset();
                this.created.emit(comment);
            });
    }
}
