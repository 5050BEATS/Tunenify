import {RouterModule, Routes} from '@angular/router';
import {EmptyRouteComponent} from '@common/core/ui/empty-route/empty-route.component';
import {UserProfilePageComponent} from './user-profile-page.component';
import {UserProfilePageResolver} from './user-profile-page-resolver.service';
import {NgModule} from '@angular/core';

const routes: Routes = [
    {
        path: ':id/:name',
        component: UserProfilePageComponent,
        resolve: {api: UserProfilePageResolver},
        data: {name: 'user', noReuse: true},
        children: [
            {path: ':tabName', component: EmptyRouteComponent},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserProfileRoutingModule {
}