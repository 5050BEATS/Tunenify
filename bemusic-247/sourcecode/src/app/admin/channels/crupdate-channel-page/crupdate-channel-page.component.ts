import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {BehaviorSubject, of} from 'rxjs';
import {ChannelService} from '../channel.service';
import {Channel, CHANNEL_MODEL} from '../channel';
import {catchError, debounceTime, distinctUntilChanged, filter, finalize, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ChannelContentItem} from '../channel-content-item';
import {Toast} from '@common/core/ui/toast.service';
import {slugifyString} from '@common/core/utils/slugify-string';
import {Settings} from '@common/core/config/settings.service';
import {Search} from '../../../web-player/search/search.service';
import {MIXED_ARTIST_MODEL, MixedArtist} from '../../../web-player/artists/mixed-artist';
import {CdkDrag, CdkDragMove, CdkDropList, CdkDropListGroup, moveItemInArray} from '@angular/cdk/drag-drop';
import {ViewportRuler} from '@angular/cdk/overlay';
import {MODEL_TYPES} from '../../../models/model_types';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

@Component({
    selector: 'crupdate-channel-page',
    templateUrl: './crupdate-channel-page.component.html',
    styleUrls: ['./crupdate-channel-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrupdateChannelPageComponent implements OnInit {
    public channel: Channel;
    public channelContent$ = new BehaviorSubject<ChannelContentItem[]>([]);
    public form = this.fb.group({
        name: [''],
        slug: [''],
        content_type: ['mixed'],
        hide_title: [false],
        layout: ['grid'],
        auto_update: [null],
        seo_title: [''],
        seo_description: [''],
    });
    public loading$ = new BehaviorSubject<boolean>(null);
    public detaching: number = null;
    public channelUrl$ = new BehaviorSubject<string>('');
    public searchControl = new FormControl();
    public searchResults$ = new BehaviorSubject<ChannelContentItem[]>([]);
    public errors: Partial<Channel> = {};

    @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
    @ViewChild(CdkDropList) placeholder: CdkDropList;
    public target: CdkDropList;
    public targetIndex: number;
    public source: CdkDropList;
    public sourceIndex: number;
    public activeContainer;

    constructor(
        private fb: FormBuilder,
        private channels: ChannelService,
        private route: ActivatedRoute,
        private toast: Toast,
        private search: Search,
        private cd: ChangeDetectorRef,
        public settings: Settings,
        private router: Router,
        private viewportRuler: ViewportRuler,
    ) {}

    ngOnInit() {
        this.form.get('slug').valueChanges
            .pipe(filter(value => !!value), distinctUntilChanged())
            .subscribe(value => {
                this.channelUrl$.next(this.settings.getBaseUrl() + 'channels/' + value);
            });

        this.form.get('name').valueChanges
            .pipe(filter(value => !!value), distinctUntilChanged())
            .subscribe(value => {
                if ( ! this.form.get('slug').dirty) {
                    this.form.get('slug').setValue(slugifyString(value));
                }
            });

        this.form.get('auto_update').valueChanges.subscribe((value: string) => {
            const contentType = this.form.get('content_type');
            if ( ! value) {
                contentType.setValue('mixed');
                contentType.enable();
            } else {
                // spotify:track:top
                contentType.setValue(value.split(':')[1]);
                contentType.disable();
            }
        });

        this.form.get('content_type').valueChanges
            .pipe(filter(value => !!value), distinctUntilChanged())
            .subscribe(value => {
                this.searchResults$.next([]);
                if (value === 'track') {
                    this.form.get('layout').setValue('trackTable');
                } else {
                    this.form.get('layout').setValue('grid');
                }
            });

        this.searchControl.valueChanges
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                filter(query => typeof query === 'string' && !!query),
                switchMap(query => this.searchForContent(query)),
                catchError(() => of({results: []})),
            ).subscribe(response => {
                this.searchResults$.next(response['results'] as ChannelContentItem[]);
            });

        this.route.data.subscribe(data => {
            if (data.api) {
                this.channel = data.api.channel;
                this.form.patchValue(data.api.channel, {emitEvent: false});
                this.channelContent$.next(data.api.channel.content);
            }
        });
    }

    private searchForContent(query: string) {
        const selectedType = this.form.get('content_type').value,
        modelTypes = selectedType === 'mixed' ? Object.values(MODEL_TYPES) : [MODEL_TYPES[selectedType]];
        return this.search.media(query, {modelTypes: modelTypes, flatten: true});
    }

    public submit() {
        this.loading$.next(true);
        const payload = this.form.getRawValue();
        if ( ! this.channel) {
            payload.content = this.channelContent$.value.map(i => this.partialItem(i));
        }
        const request = this.channel ?
            this.channels.update(this.channel.id, payload) :
            this.channels.create(payload);
        request.pipe(finalize(() => this.loading$.next(false)))
            .subscribe(() => {
                this.router.navigate(['/admin/channels']);
                this.toast.open('Channel saved.');
            }, (errResponse: BackendErrorResponse) => {
                this.errors = errResponse.errors;
                this.cd.markForCheck();
            });
    }

    public detachContentItem(item: ChannelContentItem) {
        if (this.channel) {
            this.detaching = item.id;
            this.channels.detachItem(this.channel.id, item)
                .pipe(finalize(() => this.detaching = null))
                .subscribe(() => {
                    this.removeContentItem(item);
                    this.toast.open('Item detached.');
                });
        } else {
           this.removeContentItem(item);
        }
    }

    private removeContentItem(item: ChannelContentItem) {
        const newContent = [...this.channelContent$.value],
            index = newContent.findIndex(c => c.id === item.id && c.model_type === item.model_type);
        newContent.splice(index, 1);
        this.channelContent$.next(newContent);
    }

    public attachContentItem(item: ChannelContentItem) {
        const alreadyAttached = this.channelContent$.value.find(attachedItem => {
            return attachedItem.id === item.id && attachedItem.model_type === item.model_type;
        });
        if (alreadyAttached) {
            return;
        }
        if (this.channel) {
            this.channels.attachItem(this.channel.id, this.partialItem(item))
                .subscribe(() => {
                    this.channelContent$.next([...this.channelContent$.value, item]);
                    this.toast.open('Item attached.');
                }, (errResponse: BackendErrorResponse) => {
                    if (errResponse.message) {
                        this.toast.open(errResponse.message);
                    }
                });
        } else {
            this.channelContent$.next([...this.channelContent$.value, item]);
        }
    }

    public autoUpdateChanelContents() {
        this.loading$.next(true);
        this.channels.autoUpdateContent(this.channel.id, {contentType: this.form.get('auto_update').value})
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.channelContent$.next(response.channel.content);
            });
    }

    public isChannel(item: ChannelContentItem): boolean {
        return item.model_type === CHANNEL_MODEL;
    }

    public displayFn() {
        return null;
    }

    public displayType(item: ChannelContentItem) {
        const modelType = item.model_type === MIXED_ARTIST_MODEL ?
            (item as MixedArtist).artist_type :
            item.model_type;
        return modelType.replace('App\\', '');
    }

    private partialItem(item: ChannelContentItem) {
        return {
            id: item.id,
            model_type: item.model_type === MIXED_ARTIST_MODEL ? (item as MixedArtist).artist_type : item.model_type,
        };
    }

    /* GRID DRAG AND DROP */

    dragMoved(e: CdkDragMove) {
        const point = this.getPointerPositionOnPage(e.event);
        this.listGroup._items.forEach(dropList => {
            if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
                this.activeContainer = dropList;
                return;
            }
        });
    }

    dropListDropped() {
        if ( ! this.target) return;

        const phElement = this.placeholder.element.nativeElement;
        const parent = phElement.parentElement;

        phElement.style.display = 'none';

        parent.removeChild(phElement);
        parent.appendChild(phElement);
        parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

        this.target = null;
        this.source = null;

        if (this.sourceIndex !== this.targetIndex) {
            const channelContent = [...this.channelContent$.value];
            moveItemInArray(channelContent, this.sourceIndex, this.targetIndex);
            this.channelContent$.next(channelContent);
            if (this.channel) {
                const order = {};
                channelContent.forEach((item, i) => order[i] = item.channelable_id);
                this.channels.changeOrder(this.channel.id, order).subscribe();
            }
        }
    }

    dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
        if (drop === this.placeholder) return true;


        if (drop !== this.activeContainer) return false;

        const phElement = this.placeholder.element.nativeElement;
        const sourceElement = drag.dropContainer.element.nativeElement;
        const dropElement = drop.element.nativeElement;

        const dragIndex = __indexOf(dropElement.parentElement.children, (this.source ? phElement : sourceElement));
        const dropIndex = __indexOf(dropElement.parentElement.children, dropElement);

        if ( ! this.source) {
            this.sourceIndex = dragIndex;
            this.source = drag.dropContainer;

            phElement.style.width = sourceElement.clientWidth + 'px';
            phElement.style.height = sourceElement.clientHeight + 'px';

            sourceElement.parentElement.removeChild(sourceElement);
        }

        this.targetIndex = dropIndex;
        this.target = drop;

        phElement.style.display = '';
        dropElement.parentElement.insertBefore(phElement, (dropIndex > dragIndex
            ? dropElement.nextSibling : dropElement));

        //this.placeholder.enterPredicate(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
        this.placeholder._dropListRef.enter(drag._dragRef, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
        return false;
    }

    /** Determines the point of the page that was touched by the user. */
    getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
        // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
        const point = __isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
        const scrollPosition = this.viewportRuler.getViewportScrollPosition();

        return {
            x: point.pageX - scrollPosition.left,
            y: point.pageY - scrollPosition.top
        };
    }
}

function __indexOf(collection, node) {
    return Array.prototype.indexOf.call(collection, node);
}

/** Determines whether an event is a touch event. */
function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return event.type.startsWith('touch');
}

function __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
    const {top, bottom, left, right} = dropList.element.nativeElement.getBoundingClientRect();
    return y >= top && y <= bottom && x >= left && x <= right;
}
