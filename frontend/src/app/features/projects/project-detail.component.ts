import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddTaskDialogComponent } from './add-task-dialog.component';

interface Task {
  id: number;
  name: string;
  isActive: boolean;
}
interface Project {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  domain: { name: string };
  tasks: Task[];
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    RouterLink,
  ],
  template: `
    <section class="page-shell">
      <header class="page-header">
        <a mat-button routerLink="/projects"><mat-icon>arrow_back</mat-icon> Back to projects</a>
      </header>
      @if (project()) {
        <mat-card class="surface-card">
          <mat-card-header>
            <mat-card-title>{{ project()!.name }}</mat-card-title>
            <mat-card-subtitle>{{ project()!.domain.name }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="meta-row">
              <mat-chip [highlighted]="true" [color]="project()!.isActive ? 'primary' : undefined">
                {{ project()!.isActive ? 'Active project' : 'Paused project' }}
              </mat-chip>
              <p>{{ project()!.description || 'No description provided.' }}</p>
            </div>

            <div class="tasks-header">
              <h3>Tasks</h3>
              <button mat-flat-button color="primary" (click)="openAddTask()">
                <mat-icon>add</mat-icon>
                Add task
              </button>
            </div>

            <mat-list>
              @for (t of project()!.tasks; track t.id) {
                <mat-list-item>
                  <mat-icon matListItemIcon>task_alt</mat-icon>
                  <span matListItemTitle>{{ t.name }}</span>
                </mat-list-item>
              }
            </mat-list>
            @if (project()!.tasks.length === 0) {
              <div class="table-empty">No tasks yet for this project.</div>
            }
          </mat-card-content>
        </mat-card>
      }
    </section>
  `,
  styles: `
    .meta-row {
      display: grid;
      gap: 10px;
      margin: 12px 0 20px;
    }
    .meta-row p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
    }
    .tasks-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    h3 {
      font: var(--mat-sys-title-large);
    }
  `,
})
export class ProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly project = signal<Project | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.get<Project>(`/projects/${id}`).subscribe((p) => this.project.set(p));
    }
  }

  openAddTask() {
    const projectId = this.project()?.id;
    if (!projectId) return;
    const ref = this.dialog.open(AddTaskDialogComponent, {
      data: { projectId },
      width: '460px',
      maxWidth: '95vw',
    });
    ref.afterClosed().subscribe((name) => {
      if (name) {
        this.api.post<Task>(`/projects/${projectId}/tasks`, { projectId, name }).subscribe({
          next: () => {
            this.snackBar.open('Task added', '', { duration: 2000 });
            this.api.get<Project>(`/projects/${projectId}`).subscribe((p) => this.project.set(p));
          },
          error: () => this.snackBar.open('Failed to add task', 'Close'),
        });
      }
    });
  }
}
