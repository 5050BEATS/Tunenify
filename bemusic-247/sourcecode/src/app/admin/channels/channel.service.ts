import {Injectable} from '@angular/core';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {PaginatedBackendResponse} from '@common/core/types/pagination/paginated-backend-response';
import {BackendResponse} from '@common/core/types/backend-response';
import {Channel} from './channel';
import {ChannelContentItem} from './channel-content-item';

export const CHANNEL_BASE_URI = 'channel';

@Injectable({
    providedIn: 'root'
})
export class ChannelService {
    constructor(private http: AppHttpClient) {}

    public all(params?: object): PaginatedBackendResponse<Channel> {
        return this.http.get(CHANNEL_BASE_URI, params);
    }

    public get(id: number, options?: {suppressAuthToast?: boolean}): BackendResponse<{ channel: Channel }> {
        return this.http.get(`${CHANNEL_BASE_URI}/${id}`, null, options);
    }

    public create(params: Partial<Channel>): BackendResponse<{ channel: Channel }> {
        return this.http.post(CHANNEL_BASE_URI, params);
    }

    public update(id: number, params: Partial<Channel>): BackendResponse<{ channel: Channel }> {
        return this.http.put(`${CHANNEL_BASE_URI}/${id}`, params);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.http.delete(`${CHANNEL_BASE_URI}/${ids}`);
    }

    public detachItem(channelId: number, item: ChannelContentItem) {
        const payload = {item: {id: item.id, model_type: item.model_type}};
        return this.http.post(`${CHANNEL_BASE_URI}/${channelId}/detach-item`, payload);
    }

    public attachItem(channelId: number, item: Partial<ChannelContentItem>) {
        return this.http.post(`${CHANNEL_BASE_URI}/${channelId}/attach-item`, {item});
    }

    public changeOrder(channelId: number, ids: {[key: number]: number}): BackendResponse<void> {
        return this.http.post(`${CHANNEL_BASE_URI}/${channelId}/change-order`, {ids});
    }

    public autoUpdateContent(channelId: number, params: {contentType?: string} = {}): BackendResponse<{channel: Channel}> {
        return this.http.post(`${CHANNEL_BASE_URI}/${channelId}/auto-update-content`, params);
    }
}
