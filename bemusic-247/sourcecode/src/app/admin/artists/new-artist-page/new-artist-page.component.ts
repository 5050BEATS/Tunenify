import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Settings} from 'common/core/config/settings.service';
import {Artists} from '../../../web-player/artists/artists.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Artist} from '../../../models/Artist';
import {Toast} from 'common/core/ui/toast.service';
import {UploadQueueService} from '@common/uploads/upload-queue/upload-queue.service';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import {GENRE_MODEL} from '../../../models/Genre';
import {map} from 'rxjs/operators';
import {Search} from '../../../web-player/search/search.service';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

@Component({
    selector: 'new-artist-page',
    templateUrl: './new-artist-page.component.html',
    styleUrls: ['./new-artist-page.component.scss'],
    providers: [UploadQueueService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewArtistPageComponent implements OnInit {
    public errors: {[K in keyof Partial<Artist>]: string} = {};
    public artist: Artist;

    public form = this.fb.group({
        name: [''],
        image_small: [''],
        spotify_popularity: [50],
        genres: [[]],
        auto_update: [true],
        bio: [''],
        bio_images: this.fb.array([]),
    });

    constructor(
        private settings: Settings,
        private uploadQueue: UploadQueueService,
        private artists: Artists,
        private route: ActivatedRoute,
        private toast: Toast,
        private router: Router,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        private search: Search,
    ) {}

    ngOnInit() {
        this.bindToRouteData();
    }

    public createOrUpdate() {
        this.artist ? this.update() : this.create();
    }

    public create() {
        return this.artists.create(this.getPayload()).subscribe(response => {
            this.artist = response.artist;
            this.toast.open('Artist created.');
            this.router.navigate(['/admin/artists', this.artist.id, 'edit'], {replaceUrl: true});
            this.errors = {};
        }, (errResponse: BackendErrorResponse) => {
            this.errors = errResponse.errors;
            this.cd.detectChanges();
        });
    }

    public update() {
        return this.artists.update(this.artist.id, this.getPayload()).subscribe(() => {
            this.toast.open('Artist updated.');
            this.router.navigate(['/admin/artists']);
        }, (errResponse: BackendErrorResponse) => {
            this.errors = errResponse.errors;
            this.cd.detectChanges();
        });
    }

    public bioImagesArray() {
        return this.form.get('bio_images') as FormArray;
    }

    private getPayload() {
        const payload = this.form.value;
        payload.bio_images = payload.bio_images.map(url => {
            return {url};
        });
        payload.genres = payload.genres.map(name => {
            return {name};
        });
        return payload;
    }

    private bindToRouteData() {
        this.route.data.subscribe(data => {
            if (data.artist) {
                this.artist = data.artist;
                const formData = {...data.artist};
                formData.bio = formData.bio ? formData.bio.content : '';
                const bioImages = formData.bio_images.map(i => i.url);
                delete formData.bio_images;
                bioImages.forEach(url => {
                    this.addBioImage(url);
                });
                formData.genres = formData.genres.map(g => g.name);
                this.form.patchValue(formData);
            }
        });
    }

    public addBioImage(url = '') {
        this.bioImagesArray().push(new FormControl(url));
    }

    public removeBioImage(index: number) {
        this.bioImagesArray().removeAt(index);
    }

    public suggestGenreFn = (query: string) => {
        return this.search.media(query, {modelTypes: [GENRE_MODEL], limit: 5})
            .pipe(map(response => response.results.genres.map(genre => genre.name)));
    }
}
