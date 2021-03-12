import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {Channel} from '../../../admin/channels/channel';

@Component({
    selector: 'channel-show',
    templateUrl: './channel-show.component.html',
    styleUrls: ['./channel-show.component.scss'],
})
export class ChannelShowComponent implements OnInit {
    @Input() disablePlayback = false;
    @Input() set channel(channel: Channel) {
        this.channel$.next(channel);
    }

    public channel$ = new BehaviorSubject<Channel>(null);

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            if (data.api && data.api.channel) {
                this.channel$.next(data.api.channel);
            }
        });
    }
}
