import { AfterViewInit, ElementRef, HostBinding, Input, NgZone, OnChanges, SimpleChanges, Directive } from '@angular/core';
import {UserProfileService} from '../../user-profile.service';
import {User} from '@common/core/types/models/User';
import {BehaviorSubject} from 'rxjs';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {InfiniteScroll} from '@common/core/ui/infinite-scroll/infinite.scroll';
import {finalize} from 'rxjs/operators';

@Directive()
export abstract class BaseProfileTab<T> extends InfiniteScroll implements AfterViewInit, OnChanges {
    @Input() user: User;
    @Input() @HostBinding('class.visible') visible: boolean;
    protected abstract contentType: string;
    public pagination$ = new BehaviorSubject<PaginationResponse<T>>(null);
    public loading$ = new BehaviorSubject<boolean>(false);

    constructor(
        protected userProfile: UserProfileService,
        protected el: ElementRef<HTMLElement>,
        protected zone: NgZone,
    ) {
        super();
    }

    ngOnChanges(changes: SimpleChanges) {
        // initial content load
        if (this.visible && !this.pagination$.value && !this.isLoading()) {
            this.loadMoreItems();
        }
    }

    ngAfterViewInit() {
        const scrollContainer = this.el.nativeElement.closest('.page-wrapper') as HTMLElement;
        this.el = new ElementRef(scrollContainer);
        super.ngOnInit();
    }

    protected canLoadMore(): boolean {
        return this.visible && (!this.pagination$.value || (this.pagination$.value.last_page > this.pagination$.value.current_page));
    }

    protected isLoading(): boolean {
        return this.loading$.value;
    }

    protected loadMoreItems() {
        this.loading$.next(true);
        this.userProfile.loadMore<T>(this.user.id, this.contentType, {page: this.currentPage() + 1})
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.pagination$.next({
                    ...response.pagination,
                    data: [...this.currentData(), ...response.pagination.data],
                });
            });
    }

    protected currentPage() {
        return this.pagination$.value ? this.pagination$.value.current_page : 0;
    }

    protected currentData() {
        return this.pagination$.value ? this.pagination$.value.data : [];
    }
}
