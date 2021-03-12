import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {Search} from '../../../web-player/search/search.service';
import {MixedArtist} from '../../../web-player/artists/mixed-artist';
import {ARTIST_MODEL} from '../../../models/Artist';

@Component({
    selector: 'track-artist-control',
    templateUrl: './track-artist-control.component.html',
    styleUrls: ['./track-artist-control.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'custom-control'},
    providers: [UploadQueueService, {
        provide: NG_VALUE_ACCESSOR,
        useExisting: TrackArtistControlComponent,
        multi: true,
    }]
})
export class TrackArtistControlComponent implements OnInit, ControlValueAccessor {
    @Input() error: string;
    @Input() searchUsers = false;
    @Input() id: string;

    public searchControl = new FormControl();
    public value$ = new BehaviorSubject<MixedArtist[]>([]);
    public searchResults$: Observable<MixedArtist[]>;
    private propagateChange: Function;

    constructor(
        private search: Search,
    ) {}

    ngOnInit() {
        this.bindSearchControl();
    }

    public writeValue(value: MixedArtist[]) {
        this.value$.next(value);
    }

    public registerOnChange(fn: Function) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {}

    public deselectArtist(artist: MixedArtist) {
        const newArtists = this.value$.value.filter(a => a.id !== artist.id);
        this.value$.next(newArtists);
        this.propagateChange(this.value$.value);
    }

    public selectArtist(artist: MixedArtist) {
        this.value$.next([...this.value$.value, artist]);
        this.propagateChange(this.value$.value);
    }

    private bindSearchControl() {
        this.searchResults$ = this.searchControl.valueChanges
            .pipe(
                distinctUntilChanged(),
                debounceTime(250),
                switchMap(query => this.findMatches(query))
            );
    }

    public findMatches(query: string): Observable<MixedArtist[]> {
        if ( ! query || typeof query !== 'string') {
            return observableOf([]);
        }

        return this.search.media(query, {limit: 7, forceLocal: true, modelTypes: [ARTIST_MODEL]})
            .pipe(map(response => response.results.artists));
    }

    public displayFn(_) {
        return null;
    }
}
