import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {PaginatedDataTableSource} from '@common/shared/data-table/data/paginated-data-table-source';
import {Paginator} from '@common/shared/paginator.service';
import {Modal} from '@common/core/ui/dialogs/modal.service';
import {CurrentUser} from '@common/auth/current-user';
import {Settings} from '@common/core/config/settings.service';
import {Toast} from '@common/core/ui/toast.service';
import {ConfirmModalComponent} from '@common/core/ui/confirm-modal/confirm-modal.component';
import {HttpErrors} from '@common/core/http/errors/http-errors.enum';
import {Channel} from '../channel';
import {CHANNEL_BASE_URI, ChannelService} from '../channel.service';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

@Component({
    selector: 'channel-index',
    templateUrl: './channel-index.component.html',
    styleUrls: ['./channel-index.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [Paginator],
})
export class ChannelIndexComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, {static: true}) matSort: MatSort;
    public dataSource: PaginatedDataTableSource<Channel>;

    constructor(
        public paginator: Paginator<Channel>,
        private channels: ChannelService,
        private modal: Modal,
        public currentUser: CurrentUser,
        public settings: Settings,
        private toast: Toast,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Channel>({
            uri: CHANNEL_BASE_URI,
            dataPaginator: this.paginator,
            matSort: this.matSort,
        });
    }

    ngOnDestroy() {
        this.paginator.destroy();
    }

    public maybeDeleteSelectedChannels() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Channels',
            body:  'Are you sure you want to delete selected channels?',
            ok:    'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedChannels();
        });
    }

    public deleteSelectedChannels() {
        const ids = this.dataSource.selectedRows.selected.map(d => d.id);
        this.channels.delete(ids).subscribe(() => {
            this.dataSource.reset();
            this.toast.open('Channels deleted.');
        }, (errResponse: BackendErrorResponse) => {
            this.toast.open(errResponse.message || HttpErrors.Default);
        });
    }
}
