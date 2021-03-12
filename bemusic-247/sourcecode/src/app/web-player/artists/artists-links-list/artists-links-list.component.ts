import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {Track} from '../../../models/Track';
import {BehaviorSubject} from 'rxjs';
import {MixedArtist} from '../mixed-artist';
import {USER_MODEL} from '@common/core/types/models/User';

@Component({
    selector: 'artists-links-list',
    templateUrl: './artists-links-list.component.html',
    styleUrls: ['./artists-links-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArtistsLinksListComponent implements OnChanges {
    @Input() track: Track;
    @Input() artists: MixedArtist[] = [];

    public artists$ = new BehaviorSubject<{name: string, route: any[] | string}[]>([]);

    constructor(public urls: WebPlayerUrls) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.track && changes.track.currentValue) {
            this.normalizeArtists(changes.track.currentValue.artists);
        }
        if (changes.artists && changes.artists.currentValue) {
            this.normalizeArtists(changes.artists.currentValue);
        }
    }

    private normalizeArtists(artists: MixedArtist[]) {
        const normalizedArtists = (artists || []).filter(a => !!a).map(artist => {
            return {name: artist.name, route: this.urls.artist(artist)};
        });
        this.artists$.next(normalizedArtists);
    }
}
