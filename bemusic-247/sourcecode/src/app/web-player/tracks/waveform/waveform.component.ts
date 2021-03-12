import {AfterViewInit, Component, ElementRef, HostBinding, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {ThemeService} from '@common/core/theme.service';
import {BasePlayerSeekbar} from '../../player/player-controls/player-seekbar/base-player-seekbar';
import {FormattedDuration} from '../../player/formatted-duration.service';
import {Player} from '../../player/player.service';
import {WebPlayerState} from '../../web-player-state.service';
import {Tracks} from '../tracks.service';
import {ProfileTabFadeAnimation} from '../../users/user-profile-page/tabs/profile-tab-fade-animation';
import {WAVE_HEIGHT, WAVE_WIDTH} from './waveform-generator';
import {TrackCommentsService} from '../track-comments.service';
import {Track} from '../../../models/Track';

@Component({
    selector: 'waveform',
    templateUrl: './waveform.component.html',
    styleUrls: ['./waveform.component.scss'],
    animations: [ProfileTabFadeAnimation],
})
export class WaveformComponent extends BasePlayerSeekbar implements AfterViewInit, OnDestroy {
    @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('overlayCanvas') overlayCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('seekbar') el: ElementRef<HTMLElement>;
    @HostBinding('@fadeIn') visible = false;
    private observer: IntersectionObserver;

    public waveWidth = WAVE_WIDTH;
    public waveHeight = WAVE_HEIGHT + 25; // + mirror wave

    constructor(
        protected themes: ThemeService,
        protected duration: FormattedDuration,
        protected player: Player,
        protected zone: NgZone,
        protected state: WebPlayerState,
        private tracks: Tracks,
        private trackComments: TrackCommentsService,
    ) {
        super();
    }

    ngAfterViewInit() {
        this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target === this.el.nativeElement) {
                    this.loadWaveData();
                    this.observer.disconnect();
                }
            });
        }, {root: this.state.scrollContainer.nativeElement});
        this.observer.observe(this.el.nativeElement);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.observer.disconnect();
    }

    protected getTrack(): Track {
        return this.trackComments.track;
    }

    private loadWaveData() {
        if ( ! this.track) return;
        this.tracks.loadWaveData(this.track.id).subscribe(response => {
            const accentColor = this.themes.selectedTheme$.value.colors['--be-accent-default'];
            this.drawWaveform(response.waveData, this.canvas.nativeElement, '#666');
            this.drawWaveform(response.waveData, this.overlayCanvas.nativeElement, accentColor);
            super.ngAfterViewInit();
            this.visible = true;
            this.trackComments.waveComments$.next(response.comments);
        });
    }

    private drawWaveform(waveData: number[][], canvas: HTMLCanvasElement, color: string) {
        const context = canvas.getContext('2d');

        // mirror
        context.fillStyle = color;
        context.globalAlpha = 0.5;
        waveData.forEach(lineData => {
            const height = (55 / 100) * lineData[3];
            context.fillRect(lineData[0], (lineData[1] + lineData[3]) + 1, lineData[2], height);
        });

        // main
        context.fillStyle = color;
        context.globalAlpha = 1;
        waveData.forEach(lineData => {
            context.fillRect(lineData[0], lineData[1], lineData[2], lineData[3]);
        });
    }
}
