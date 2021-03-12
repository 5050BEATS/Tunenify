import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap} from 'rxjs/operators';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Album, ALBUM_MODEL} from '../../../models/Album';
import {Search} from '../../../web-player/search/search.service';

@Component({
    selector: 'album-control',
    templateUrl: './album-control.component.html',
    styleUrls: ['./album-control.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: AlbumControlComponent,
        multi: true,
    }]
})
export class AlbumControlComponent implements ControlValueAccessor, OnInit {
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef<HTMLInputElement>;
    public searchFormControl = new FormControl();
    public loading$ = new BehaviorSubject(false);
    public results$ = new BehaviorSubject<Album[]>([]);
    public selectedAlbum$ = new BehaviorSubject<Album>(null);
    private propagateChange: Function;
    public searchedOnce = false;

    constructor(
        private search: Search,
    ) {}

    ngOnInit() {
        this.bindToSearchControl();
    }

    public writeValue(value: Album) {
        this.selectedAlbum$.next(value);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

    private bindToSearchControl() {
        this.searchFormControl.valueChanges.pipe(
            debounceTime(150),
            distinctUntilChanged(),
            switchMap(query => this.searchAlbums(query)),
            catchError(() => of([])),
        ).subscribe(albums => {
            this.searchedOnce = true;
            this.results$.next(albums);
        });
    }

    private searchAlbums(query: string): Observable<Album[]> {
        this.loading$.next(true);
        return this.search.media(query, {forceLocal: true, limit: 7, modelTypes: [ALBUM_MODEL]})
            .pipe(
                finalize(() =>  this.loading$.next(false)),
                map(response => response.results.albums),
            );
    }

    public onMenuOpened() {
        if (!this.searchedOnce) {
            this.clearSearchInput();
        }
    }

    public selectAlbum(album: Album) {
        this.selectedAlbum$.next(album);
        this.propagateChange(album);
    }

    public clearSearchInput() {
        this.searchFormControl.setValue('');
    }

    public onMenuClosed() {
        this.loading$.next(false);
        this.clearSearchInput();
    }
}
