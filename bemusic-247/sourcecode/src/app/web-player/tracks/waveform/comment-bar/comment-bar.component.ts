import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostListener,
    NgZone,
    ViewChild
} from '@angular/core';
import {TrackCommentsService} from '../../track-comments.service';
import {OverlayPanel} from '@common/core/ui/overlay-panel/overlay-panel.service';
import {TrackComment} from '../../../../models/TrackComment';
import {CommentOverlayComponent} from './comment-overlay/comment-overlay.component';
import {OverlayPanelRef} from '@common/core/ui/overlay-panel/overlay-panel-ref';
import {ConnectedPosition} from '@angular/cdk/overlay';
import {CurrentUser} from '@common/auth/current-user';
import {fromEvent} from 'rxjs';

@Component({
    selector: 'comment-bar',
    templateUrl: './comment-bar.component.html',
    styleUrls: ['./comment-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'comment-marker-ancestor'},
})
export class CommentBarComponent implements AfterViewInit {
    @ViewChild('commentMarker') commentMarker: ElementRef<HTMLElement>;
    private overlayRef: OverlayPanelRef<CommentOverlayComponent>;
    private boundingClientRect: ClientRect;
    private readonly canComment: boolean;

    constructor(
        public trackComments: TrackCommentsService,
        private overlayPanel: OverlayPanel,
        private zone: NgZone,
        private el: ElementRef<HTMLElement>,
        public currentUser: CurrentUser,
    ) {
        this.canComment = this.currentUser.isLoggedIn() && this.currentUser.hasPermission('comments.create');
    }

    ngAfterViewInit() {
        this.boundingClientRect = this.el.nativeElement.getBoundingClientRect();
    }

    @HostListener('tap', ['$event'])
    public onTap(e: HammerInput) {
        if (this.canComment) {
            this.repositionCommentMarker(e.center.x);
            this.showCommentMarker();
        }
    }

    @HostListener('panstart', ['$event'])
    public onPanstart() {
        if (this.canComment) {
            this.showCommentMarker();
        }
    }

    @HostListener('panleft', ['$event'])
    @HostListener('panright', ['$event'])
    public onPanHorizontal(e: HammerInput) {
        if (this.canComment) {
            this.repositionCommentMarker(e.center.x);
        }
    }

    private showCommentMarker() {
        if ( ! this.trackComments.markerActive$.value) {
            this.trackComments.markerActive$.next(true);
            this.bindMarkerClick();
        }
    }

    private hideCommentMarker() {
        if (this.trackComments.markerActive$.value) {
            this.trackComments.markerActive$.next(false);
        }
    }

    private bindMarkerClick() {
        fromEvent(document, 'click').subscribe(e => {
            if ( ! (e.target as HTMLElement).closest('.comment-marker-ancestor')) {
                this.hideCommentMarker();
            }
        });
    }

    private repositionCommentMarker(x: number) {
        const rect = this.boundingClientRect;
        const ratio = (x - 12.5 - rect.left) / rect.width, // - marker width,
            percent = ratio * 100,
            rightEdge = 100 - (25 / rect.width * 100);
        let markerPosition = percent;

        if (percent <= 0) {
            return;
        }
        if (percent >= rightEdge) {
            markerPosition = rightEdge;
        }

        this.commentMarker.nativeElement.style.left = markerPosition + '%';
        this.trackComments.markerPosition$.next(percent);
    }

    public hideContent() {
        this.overlayRef && this.overlayRef.close();
    }

    public showContent(e: MouseEvent, comment: TrackComment) {
        const position = [{
            originX: 'start',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: 25
        }] as ConnectedPosition[];
        this.overlayRef = this.overlayPanel.open(CommentOverlayComponent, {
            data: {comment},
            origin: new ElementRef(e.target),
            position: position,
            hasBackdrop: false,
        });
    }
}
