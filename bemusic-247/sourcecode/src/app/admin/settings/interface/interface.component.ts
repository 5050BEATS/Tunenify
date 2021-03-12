import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SettingsPanelComponent} from '@common/admin/settings/settings-panel.component';

@Component({
    selector: 'interface',
    templateUrl: './interface.component.html',
    styleUrls: ['./interface.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class InterfaceComponent extends SettingsPanelComponent {
}
