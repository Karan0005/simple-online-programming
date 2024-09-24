import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './shared/components/landing-page/landing-page.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'top',
            preloadingStrategy: NoPreloading
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
