import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    finalize,
    map,
    switchMap
} from 'rxjs/operators';
import {MixedArtist} from '../../../web-player/artists/mixed-artist';
import {Search} from '../../../web-player/search/search.service';
import {ARTIST_MODEL} from '../../../models/Artist';

@Component({
    selector: 'album-artist-control',
    templateUrl: './album-artist-control.component.html',
    styleUrls: ['./album-artist-control.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'tabindex': '0'},
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: AlbumArtistControlComponent,
        multi: true,
    }]
})
export class AlbumArtistControlComponent implements OnInit, ControlValueAccessor {
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef<HTMLInputElement>;
    public searchFormControl = new FormControl();
    public loading$ = new BehaviorSubject(false);
    public artists$ = new BehaviorSubject<MixedArtist[]>([]);
    public selectedArtist$ = new BehaviorSubject<MixedArtist>(null);
    private propagateChange: Function;
    public searchedOnce = false;

    constructor(private search: Search) {}

    ngOnInit() {
        this.bindToSearchControl();
    }

    public writeValue(value: MixedArtist) {
        this.selectedArtist$.next(value);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

    private bindToSearchControl() {
        this.searchFormControl.valueChanges.pipe(
            debounceTime(150),
            distinctUntilChanged(),
            switchMap(query => this.searchArtists(query)),
            catchError(() => of([])),
        ).subscribe(users => {
            this.searchedOnce = true;
            this.artists$.next(users);
        });
    }

    private searchArtists(query: string): Observable<MixedArtist[]> {
        this.loading$.next(true);
        return this.search.media(query, {limit: 7, forceLocal: true, modelTypes: [ARTIST_MODEL]})
            .pipe(
                finalize(() =>  this.loading$.next(false)),
                map(response => response.results.artists),
            );
    }

    public onMenuOpened() {
        if (!this.searchedOnce) {
            this.clearSearchInput();
        }
    }

    public selectArtist(artist: MixedArtist) {
        this.selectedArtist$.next(artist);
        this.propagateChange(artist);
    }

    public clearSearchInput() {
        this.searchFormControl.setValue('');
    }

    public onMenuClosed() {
        this.loading$.next(false);
        this.clearSearchInput();
    }
}
