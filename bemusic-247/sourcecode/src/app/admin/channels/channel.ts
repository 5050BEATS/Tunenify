import {ChannelContentItem} from './channel-content-item';

export const CHANNEL_MODEL = 'App\\Channel';

export interface Channel {
    id: number;
    model_type: string;
    name: string;
    slug: string;
    content_type: string;
    auto_update: string;
    hide_title: boolean;
    layout: string;
    content?: ChannelContentItem[];
}
