import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'track',
        loadComponent: () =>
          import('./features/track/track.component').then((m) => m.TrackComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/projects-list.component').then((m) => m.ProjectsListComponent),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./features/projects/project-detail.component').then((m) => m.ProjectDetailComponent),
      },
      {
        path: 'domains',
        loadComponent: () =>
          import('./features/domains/domains-list.component').then((m) => m.DomainsListComponent),
        canActivate: [adminGuard],
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports.component').then((m) => m.ReportsComponent),
      },
    ],
  },
  { path: '', redirectTo: 'track', pathMatch: 'full' },
  { path: '**', redirectTo: 'track' },
];
