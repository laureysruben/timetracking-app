import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddProjectDialogComponent } from './add-project-dialog.component';

interface Project {
  id: number;
  name: string;
  isActive: boolean;
  domain: { name: string };
}

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterLink,
  ],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div class="page-title-group">
          <h1 class="page-title">Projects</h1>
          <p class="page-subtitle">Organize project work by domain and manage active status.</p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreate()">
          <mat-icon>add</mat-icon>
          New project
        </button>
      </header>

      <mat-card class="surface-card">
        <mat-card-content>
          <table mat-table [dataSource]="projects()" class="full-width">
            <ng-container matColumnDef="domain">
              <th mat-header-cell *matHeaderCellDef>Domain</th>
              <td mat-cell *matCellDef="let p">{{ p.domain.name }}</td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let p">{{ p.name }}</td>
            </ng-container>
            <ng-container matColumnDef="active">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let p">
                <mat-chip [highlighted]="true" [color]="p.isActive ? 'primary' : undefined">
                  {{ p.isActive ? 'Active' : 'Paused' }}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Details</th>
              <td mat-cell *matCellDef="let p">
                <a mat-button [routerLink]="['/projects', p.id]">
                  Open
                  <mat-icon>open_in_new</mat-icon>
                </a>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
          @if (projects().length === 0) {
            <div class="table-empty">No projects yet. Create your first project.</div>
          }
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: `
    .full-width {
      width: 100%;
    }
  `,
})
export class ProjectsListComponent {
  private readonly api = inject(ApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  readonly projects = signal<Project[]>([]);
  readonly displayedColumns = ['domain', 'name', 'active', 'actions'];

  constructor() {
    this.load();
  }

  private load() {
    this.api.get<Project[]>('/projects').subscribe((list) => this.projects.set(list));
  }

  openCreate() {
    const ref = this.dialog.open(AddProjectDialogComponent, { width: '560px', maxWidth: '95vw' });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.post<Project>('/projects', result).subscribe({
          next: () => {
            this.snackBar.open('Project created', '', { duration: 2000 });
            this.load();
          },
          error: (err) =>
            this.snackBar.open(err.error?.message ?? 'Failed to create project', 'Close'),
        });
      }
    });
  }
}
