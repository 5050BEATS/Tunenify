import {ChannelContentItem} from '../../admin/channels/channel-content-item';
import {PaginationParams} from '@common/core/types/pagination/pagination-params';

export function queueId(model: ChannelContentItem, kind: string = 'general', params: PaginationParams = {}): string {
    let base = `${model.model_type}.${model.id}.${kind}`;
    if (params.orderBy && params.orderDir) {
        base += `.${params.orderBy}|${params.orderDir}`;
    }
    return base;
}
