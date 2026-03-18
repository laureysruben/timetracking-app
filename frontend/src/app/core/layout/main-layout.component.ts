import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
  ],
  template: `
    <mat-toolbar color="primary" class="top-bar">
      <div class="brand">
        <mat-icon>schedule</mat-icon>
        <span class="brand-text">Team Time Tracker</span>
      </div>
      <span class="spacer"></span>
      <div class="user-area">
        <div class="user-pill">
          <mat-icon>person</mat-icon>
          <span>{{ auth.currentUser()?.name }}</span>
        </div>
        <button mat-stroked-button (click)="auth.logout()">Logout</button>
      </div>
    </mat-toolbar>
    <mat-sidenav-container class="app-shell">
      <mat-sidenav mode="side" opened class="side-nav">
        <div class="nav-header">
          <div class="nav-title">Workspace</div>
          <div class="nav-subtitle">Navigation</div>
        </div>
        <mat-divider />
        <mat-nav-list>
          <a mat-list-item routerLink="/track" routerLinkActive="active-link">
            <mat-icon matListItemIcon>timer</mat-icon>
            <span matListItemTitle>Track</span>
          </a>
          <a mat-list-item routerLink="/projects" routerLinkActive="active-link">
            <mat-icon matListItemIcon>folder</mat-icon>
            <span matListItemTitle>Projects</span>
          </a>
          @if (auth.isAdmin()) {
            <a mat-list-item routerLink="/domains" routerLinkActive="active-link">
              <mat-icon matListItemIcon>category</mat-icon>
              <span matListItemTitle>Domains</span>
            </a>
          }
          <a mat-list-item routerLink="/reports" routerLinkActive="active-link">
            <mat-icon matListItemIcon>analytics</mat-icon>
            <span matListItemTitle>Reports</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <main class="content-shell">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .top-bar {
      position: sticky;
      top: 0;
      z-index: 4;
      gap: 12px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-text {
      font-weight: 500;
      letter-spacing: 0.1px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .user-area {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--mat-sys-primary) 20%, white);
      color: var(--mat-sys-primary);
      font: var(--mat-sys-label-large);
    }
    .app-shell {
      height: calc(100vh - 64px);
      background: var(--mat-sys-surface-container-lowest);
    }
    .side-nav {
      width: 260px;
      border-right: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container-low);
    }
    .nav-header {
      display: grid;
      gap: 2px;
      padding: 20px 16px 14px;
    }
    .nav-title {
      font: var(--mat-sys-title-medium);
    }
    .nav-subtitle {
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-small);
    }
    mat-nav-list {
      padding: 10px;
    }
    .active-link {
      background: color-mix(in srgb, var(--mat-sys-primary) 14%, transparent);
      border-radius: 12px;
      color: var(--mat-sys-primary);
    }
    .content-shell {
      margin: 0 auto;
      padding: 24px;
      max-width: 1280px;
    }
    @media (max-width: 960px) {
      .side-nav {
        width: 220px;
      }
      .content-shell {
        padding: 16px;
      }
      .user-pill span {
        display: none;
      }
    }
  `,
})
export class MainLayoutComponent {
  readonly auth = inject(AuthService);
}
