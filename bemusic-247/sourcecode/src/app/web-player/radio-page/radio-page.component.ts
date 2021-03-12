import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Track} from '../../models/Track';
import {Artist} from '../../models/Artist';
import {Player} from '../player/player.service';
import {Translations} from 'common/core/translations/translations.service';
import {queueId} from '../player/queue-id';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'radio-page',
    templateUrl: './radio-page.component.html',
    styleUrls: ['./radio-page.component.scss'],
})
export class RadioPageComponent implements OnInit {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    public tracks: Track[];
    public seed: Artist|Track;
    public type: string;
    public dataSource: MatTableDataSource<any>;

    constructor(
        private route: ActivatedRoute,
        private player: Player,
        private i18n: Translations,
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.seed = data.radio.seed;
            this.type = this.i18n.t(data.radio.type);

            this.tracks = data.radio.recommendations.map(track => {
                return new Track(track);
            });

            this.dataSource = new MatTableDataSource(this.tracks);
            this.dataSource.sort = this.matSort;
        });
    }

    public queueId(): string {
        return queueId(this.seed, 'radio');
    }
}
