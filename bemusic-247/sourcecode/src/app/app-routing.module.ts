import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContactComponent} from '@common/contact/contact.component';
import {AuthGuard} from '@common/guards/auth-guard.service';

const routes: Routes = [
    {path: 'admin', loadChildren: () => import('app/admin/app-admin.module').then(m => m.AppAdminModule), canLoad: [AuthGuard]},
    {path: 'billing', loadChildren: () => import('common/billing/billing.module').then(m => m.BillingModule)},
    {path: 'notifications', loadChildren: () => import('common/notifications/notifications.module').then(m => m.NotificationsModule)},
    {path: 'contact', component: ContactComponent},
    {path: 'pricing', redirectTo: 'billing/pricing'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
