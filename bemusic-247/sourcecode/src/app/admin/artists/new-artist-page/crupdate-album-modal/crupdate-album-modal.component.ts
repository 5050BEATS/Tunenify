import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Album} from '../../../../models/Album';
import {Artist} from '../../../../models/Artist';

interface CrupdateAlbumModalData {
    album?: Album;
    artist: Artist;
}

@Component({
    selector: 'crupdate-album-modal',
    templateUrl: './crupdate-album-modal.component.html',
    styleUrls: ['./crupdate-album-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrupdateAlbumModalComponent {
    constructor(
        private dialogRef: MatDialogRef<CrupdateAlbumModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateAlbumModalData,
    ) {}

    public close(album?: Album) {
        this.dialogRef.close(album);
    }

    public confirm(album?: Album) {
        this.close(album);
    }
}
