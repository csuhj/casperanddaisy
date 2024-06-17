import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./containers/home/home.component').then(mod => mod.HomeComponent)},
    { path: 'fixtures', loadComponent: () => import('./containers/fixtures/fixtures.component').then(mod => mod.FixturesComponent)},
    { path: 'predictions', loadComponent: () => import('./containers/predictions/predictions.component').then(mod => mod.PredictionsComponent)},
];
