import {share} from 'rxjs/operators';
import {EventEmitter, Injectable} from '@angular/core';
import {Track} from '../../models/Track';
import {Playlist} from '../../models/Playlist';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {Observable} from 'rxjs';
import {PaginationResponse} from '@common/core/types/pagination/pagination-response';
import {BackendResponse} from '@common/core/types/backend-response';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';

export interface GetPlaylistResponse {
    playlist: Playlist;
    tracks: PaginationResponse<Track>;
    totalDuration: number;
}

@Injectable({
    providedIn: 'root'
})
export class Playlists {

    /**
     * Fired when tracks are added to a playlist.
     */
    public addedTracks$: EventEmitter<{ id: number, tracks: Track[] }> = new EventEmitter();

    /**
     * Fired when tracks are removed from a playlist.
     */
    public removedTracks$: EventEmitter<{ id: number, tracks: Track[] }> = new EventEmitter();

    /**
     * Fired when playlist is deleted.
     */
    public deleted$: EventEmitter<number[]> = new EventEmitter();

    /**
     * Fired when existing playlist is updated.
     */
    public updated$: EventEmitter<Playlist> = new EventEmitter();

    /**
     * Playlists Service Constructor.
     */
    constructor(private http: AppHttpClient) {
    }

    /**
     * Get all current user playlists.
     */
    public allUserPlaylists(id: number): Observable<Playlist[]> {
        return this.http.get(`user/${id}/playlists`);
    }

    public all(): Observable<PaginationResponse<Playlist>> {
        return this.http.get('playlists');
    }

    public get(id: number): BackendResponse<GetPlaylistResponse> {
        return this.http.get(`playlists/${id}`);
    }

    public create(params = {}): Observable<Playlist> {
        return this.http.post('playlists', params);
    }

    public update(id: number, params: object = {}): Observable<Playlist> {
        const request = this.http.put(`playlists/${id}`, params).pipe(share());
        request.subscribe(playlist => this.updated$.emit(playlist as Playlist), () => {
        });
        return request as any;
    }

    public delete(ids: number[]): Observable<any> {
        const request = this.http.delete('playlists', {ids}).pipe(share());
        request.subscribe(() => this.deleted$.emit(ids), () => {
        });
        return request;
    }

    /**
     * Follow specified playlist with current user.
     */
    public follow(id: number): Observable<boolean> {
        return this.http.post(`playlists/${id}/follow`);
    }

    /**
     * Unfollow specified playlist with current user.
     */
    public unfollow(id: number): Observable<boolean> {
        return this.http.post(`playlists/${id}/unfollow`);
    }

    /**
     * Attach specified tracks to playlist.
     */
    public addTracks(id: number, tracks: Track[]) {
        const ids = tracks.map(track => track.id);
        this.addedTracks$.emit({id, tracks});
        return this.http.post<Playlist>(`playlists/${id}/tracks/add`, {ids});
    }

    /**
     * Detach specified track from playlist.
     */
    public removeTracks(id: number, tracks: Track[]) {
        const ids = tracks.map(track => track.id);
        this.removedTracks$.emit({id, tracks});
        return this.http.post<Playlist>(`playlists/${id}/tracks/remove`, {ids});
    }

    /**
     * Load more tracks for specified playlist.
     */
    public loadMoreTracks(id: number, page: number = 1): PaginatedBackendResponse<Track> {
        return this.http.get(`playlists/${id}/tracks`, {page});
    }

    /**
     * Change the order of playlist tracks.
     */
    public changeTrackOrder(id: number, tracks: number[]) {
        return this.http.post(`playlists/${id}/tracks/order`, {ids: tracks});
    }
}
