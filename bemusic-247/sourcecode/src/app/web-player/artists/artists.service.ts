import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {Observable} from 'rxjs';
import {Artist} from '../../models/Artist';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {Track} from '../../models/Track';
import {Album} from '../../models/Album';
import {BackendResponse} from '@common/core/types/backend-response';

export interface GetArtistResponse {
    artist: Artist;
    albums: PaginationResponse<Album>;
    top_tracks?: Track[];
}

@Injectable({
    providedIn: 'root'
})
export class Artists {
    constructor(private httpClient: AppHttpClient) {
    }

    public get(id: number, params = {}): BackendResponse<GetArtistResponse> {
        return this.httpClient.get('artists/' + id, params);
    }

    public create(payload: object): BackendResponse<{artist: Artist}> {
        return this.httpClient.post('artists', payload);
    }

    public update(id: number, payload: object): BackendResponse<{artist: Artist}> {
        return this.httpClient.put('artists/' + id, payload);
    }

    public paginateArtistAlbums(id: number, page = 1): Observable<PaginationResponse<Album>> {
        return this.httpClient.get('artists/' + id + '/albums', {page});
    }

    public getRadioRecommendations(id: number) {
        return this.httpClient.get(`radio/artist/${id}`);
    }

    public delete(ids: number[]) {
        return this.httpClient.delete('artists', {ids});
    }
}
