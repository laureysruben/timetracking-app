import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomainFormDialogComponent } from './domain-form-dialog.component';

interface Domain {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
}

@Component({
  selector: 'app-domains-list',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <div class="page-title-group">
          <h1 class="page-title">Domains</h1>
          <p class="page-subtitle">
            Create and maintain high-level categorization for project work.
          </p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreate()">
          <mat-icon>add</mat-icon>
          New domain
        </button>
      </header>

      <mat-card class="surface-card">
        <mat-card-content>
          <table mat-table [dataSource]="domains()" class="full-width">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let d">{{ d.name }}</td>
            </ng-container>
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let d">{{ d.description || '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="active">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let d">
                <mat-chip [highlighted]="true" [color]="d.isActive ? 'primary' : undefined">
                  {{ d.isActive ? 'Active' : 'Paused' }}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let d">
                <button mat-icon-button (click)="openEdit(d)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteDomain(d)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
          @if (domains().length === 0) {
            <div class="table-empty">No domains available yet.</div>
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
export class DomainsListComponent {
  private readonly api = inject(ApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly domains = signal<Domain[]>([]);
  readonly displayedColumns = ['name', 'description', 'active', 'actions'];

  constructor() {
    this.load();
  }

  private load() {
    this.api.get<Domain[]>('/domains').subscribe((list) => this.domains.set(list));
  }

  openCreate() {
    const ref = this.dialog.open(DomainFormDialogComponent, {
      data: null,
      width: '520px',
      maxWidth: '95vw',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.post<Domain>('/domains', result).subscribe({
          next: () => {
            this.snackBar.open('Domain created', '', { duration: 2000 });
            this.load();
          },
          error: () => this.snackBar.open('Failed to create domain', 'Close'),
        });
      }
    });
  }

  openEdit(d: Domain) {
    const ref = this.dialog.open(DomainFormDialogComponent, {
      data: d,
      width: '520px',
      maxWidth: '95vw',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.api.patch<Domain>(`/domains/${d.id}`, result).subscribe({
          next: () => {
            this.snackBar.open('Domain updated', '', { duration: 2000 });
            this.load();
          },
          error: () => this.snackBar.open('Failed to update domain', 'Close'),
        });
      }
    });
  }

  deleteDomain(d: Domain) {
    if (!confirm(`Delete domain "${d.name}"?`)) return;
    this.api.delete(`/domains/${d.id}`).subscribe({
      next: () => {
        this.snackBar.open('Domain deleted', '', { duration: 2000 });
        this.load();
      },
      error: () => this.snackBar.open('Failed to delete domain', 'Close'),
    });
  }
}
