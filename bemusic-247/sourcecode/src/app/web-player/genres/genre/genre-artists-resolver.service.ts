import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Genres} from '../genres.service';
import {Genre} from '../../../models/Genre';
import {WebPlayerState} from '../../web-player-state.service';
import {catchError, mergeMap} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import {BackendResponse} from '@common/core/types/backend-response';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {MixedArtist} from '../../artists/mixed-artist';

@Injectable({
    providedIn: 'root'
})
export class GenreArtistsResolver implements Resolve<BackendResponse<{genre: Genre, artists: PaginationResponse<MixedArtist>}>> {

    constructor(
        private genres: Genres,
        private router: Router,
        private state: WebPlayerState
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BackendResponse<{genre: Genre, artists: PaginationResponse<MixedArtist>}> {
        this.state.loading = true;
        const name = route.paramMap.get('name');

        return this.genres.get(name).pipe(
            catchError(() => {
                this.state.loading = false;
                this.router.navigate(['/']);
                return EMPTY;
            }),
            mergeMap(response => {
                this.state.loading = false;

                if (response.artists) {
                    return of(response);
                } else {
                    this.router.navigate(['/']);
                    return EMPTY;
                }
            })
        );
    }
}
