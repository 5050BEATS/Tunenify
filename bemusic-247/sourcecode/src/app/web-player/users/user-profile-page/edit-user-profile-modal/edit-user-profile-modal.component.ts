import {ChangeDetectionStrategy, Component, Inject, Optional} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {User} from '@common/core/types/models/User';
import {FormArray, FormBuilder} from '@angular/forms';
import {UserProfileService} from '../../user-profile.service';
import {BehaviorSubject} from 'rxjs';
import {delay, finalize} from 'rxjs/operators';
import {UserLink} from '../../../../models/UserLink';
import {AvatarValidator} from '@common/account-settings/avatar-validator';
import {Toast} from '@common/core/ui/toast.service';
import {ImageUploadValidator} from '../../../image-upload-validator';
import {CountryListItem, ValueLists} from '@common/core/services/value-lists.service';
import {UploadApiConfig} from '@common/uploads/types/upload-api-config';

interface EditUserProfileModalData {
    user: User;
}

@Component({
    selector: 'edit-user-profile-modal',
    templateUrl: './edit-user-profile-modal.component.html',
    styleUrls: ['./edit-user-profile-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditUserProfileModalComponent {
    public loading$ = new BehaviorSubject<boolean>(false);

    public form = this.fb.group({
        user: this.fb.group({
            avatar: [''],
            username: [''],
            first_name: [''],
            last_name: [''],
        }),
        profile: this.fb.group({
            city: [''],
            country: [''],
            header_image: [''],
            description: [''],
        }),
        links: this.fb.array([]),
    });
    public countries$ = new BehaviorSubject<CountryListItem[]>([]);

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditUserProfileModalComponent>,
        private profiles: UserProfileService,
        private avatarValidator: AvatarValidator,
        private toast: Toast,
        private imageValidator: ImageUploadValidator,
        private valueLists: ValueLists,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: EditUserProfileModalData,
    ) {
        this.form.patchValue({
            user: this.data.user,
            profile: this.data.user.profile,
        });

        this.data.user.links.forEach(link => {
            this.addNewLink(link);
        });

        this.valueLists.get(['countries']).subscribe(response => {
            this.countries$.next(response.countries);
        });

        this.form.get('profile.header_image')
            .valueChanges
            .pipe(delay(0)) // wait "this.form.value" to update
            .subscribe(() => {
                this.confirm(false);
            });
    }

    public confirm(closeModal = true) {
        this.loading$.next(true);
        this.profiles.update(this.data.user.id, this.form.value)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                if (closeModal) {
                    this.toast.open('Profile updated.');
                    this.close(response.user);
                }
            });
    }

    public close(user?: User) {
        this.dialogRef.close(user);
    }

    public linkArray() {
        return this.form.get('links') as FormArray;
    }

    public addNewLink(link: Partial<UserLink> = {}) {
        this.linkArray().push(this.fb.group({url: [link.url || ''], title: [link.title || '']}));
    }

    public deleteLink(index: number) {
        this.linkArray().removeAt(index);
    }

    public avatarUploadConfig(): UploadApiConfig {
        return {
            uri: `users/${this.data.user.id}/avatar`,
            validator: this.avatarValidator,
        };
    }

    public headerImageUploadConfig(): UploadApiConfig {
        return {
            uri: 'uploads',
            httpParams: {diskPrefix: 'user_header_media', disk: 'public'},
            validator: this.imageValidator,
        };
    }
}
