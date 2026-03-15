import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

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
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Time Tracker</span>
      <span class="spacer"></span>
      <span>{{ auth.currentUser()?.name }}</span>
      <button mat-button (click)="auth.logout()">Logout</button>
    </mat-toolbar>
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened>
        <mat-nav-list>
          <a mat-list-item routerLink="/track" routerLinkActive="active">Track</a>
          <a mat-list-item routerLink="/projects" routerLinkActive="active">Projects</a>
          @if (auth.isAdmin()) {
            <a mat-list-item routerLink="/domains" routerLinkActive="active">Domains</a>
          }
          <a mat-list-item routerLink="/reports" routerLinkActive="active">Reports</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <main class="content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .spacer { flex: 1 1 auto; }
    mat-sidenav-container { height: calc(100vh - 64px); }
    mat-sidenav { width: 200px; }
    .content { padding: 16px; }
    .active { background: rgba(0,0,0,0.04); }
  `,
})
export class MainLayoutComponent {
  readonly auth = inject(AuthService);
}
