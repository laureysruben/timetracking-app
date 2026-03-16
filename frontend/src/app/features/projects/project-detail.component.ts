import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddTaskDialogComponent } from './add-task-dialog.component';
import { EditTaskDialogComponent } from './edit-task-dialog.component';

interface Task {
  id: number;
  name: string;
  description: string | null;
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
  imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule, MatTooltipModule, RouterLink],
  template: `
    <div class="header">
      <a mat-button routerLink="/projects"><mat-icon>arrow_back</mat-icon> Back</a>
    </div>
    @if (project()) {
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ project()!.name }}</mat-card-title>
          <mat-card-subtitle>{{ project()!.domain.name }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{ project()!.description || 'No description' }}</p>
          <h3>Tasks</h3>
          <button mat-flat-button color="primary" (click)="openAddTask()" style="margin-bottom: 12px;">
            <mat-icon>add</mat-icon> Add task
          </button>
          <mat-list>
            @for (t of project()!.tasks; track t.id) {
              <mat-list-item>
                <span class="task-info">
                  <strong>{{ t.name }}</strong>
                  @if (t.description) {
                    <span class="task-desc"> – {{ t.description }}</span>
                  }
                  @if (!t.isActive) {
                    <mat-icon class="inactive-badge" matTooltip="Inactive">cancel</mat-icon>
                  }
                </span>
                <button mat-icon-button (click)="openEditTask(t)" matTooltip="Edit task">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteTask(t)" matTooltip="Delete task">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-list-item>
            }
          </mat-list>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: `
    .header { margin-bottom: 16px; }
    .task-info { flex: 1; }
    .task-desc { color: rgba(0,0,0,0.6); font-size: 0.9em; }
    .inactive-badge { font-size: 18px; width: 18px; height: 18px; vertical-align: middle; margin-left: 4px; }
    mat-list-item { display: flex; align-items: center; }
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
    const ref = this.dialog.open(AddTaskDialogComponent, { data: { projectId }, width: '400px' });
    ref.afterClosed().subscribe((body) => {
      if (body) {
        this.api.post<Task>(`/projects/${projectId}/tasks`, { projectId, ...body }).subscribe({
          next: () => {
            this.snackBar.open('Task added', '', { duration: 2000 });
            this.refreshProject();
          },
          error: () => this.snackBar.open('Failed to add task', 'Close'),
        });
      }
    });
  }

  openEditTask(task: Task) {
    const ref = this.dialog.open(EditTaskDialogComponent, {
      data: {
        id: task.id,
        name: task.name,
        description: task.description,
        isActive: task.isActive,
      },
      width: '400px',
    });
    ref.afterClosed().subscribe((body) => {
      if (body) {
        this.api.patch<Task>(`/tasks/${task.id}`, body).subscribe({
          next: () => {
            this.snackBar.open('Task updated', '', { duration: 2000 });
            this.refreshProject();
          },
          error: () => this.snackBar.open('Failed to update task', 'Close'),
        });
      }
    });
  }

  deleteTask(task: Task) {
    if (!confirm(`Delete task "${task.name}"?`)) return;
    this.api.delete(`/tasks/${task.id}`).subscribe({
      next: () => {
        this.snackBar.open('Task deleted', '', { duration: 2000 });
        this.refreshProject();
      },
      error: () => this.snackBar.open('Failed to delete task', 'Close'),
    });
  }

  private refreshProject() {
    const projectId = this.project()?.id;
    if (projectId) {
      this.api.get<Project>(`/projects/${projectId}`).subscribe((p) => this.project.set(p));
    }
  }
}
