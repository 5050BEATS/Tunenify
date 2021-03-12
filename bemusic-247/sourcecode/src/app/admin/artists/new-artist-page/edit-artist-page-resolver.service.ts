import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Artists} from '../../../web-player/artists/artists.service';
import {Artist} from '../../../models/Artist';

@Injectable({
    providedIn: 'root',
})
export class EditArtistPageResolver implements Resolve<Artist> {

    constructor(
        private artists: Artists,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Artist> {
        const params = {simplified: true},
            id = +route.paramMap.get('id');

        return this.artists.get(id, params).toPromise().then(response => {
            if (response) {
                return response.artist;
            } else {
                this.router.navigate(['/admin/artists']);
                return false;
            }
        }).catch(() => {
            this.router.navigate(['/admin/artists']);
        }) as any;
    }
}
