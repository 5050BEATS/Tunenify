import {Component, Input} from '@angular/core';
import {Track} from '../../../models/Track';
import {Player} from '../../player/player.service';

@Component({
    selector: 'header-play-button',
    templateUrl: './header-play-button.component.html',
    styleUrls: ['./header-play-button.component.scss'],
})
export class HeaderPlayButtonComponent {
    @Input() queueId: string;
    @Input() tracks: Track[]|null;
    @Input() select: Track;

    constructor(public player: Player) {}
}
