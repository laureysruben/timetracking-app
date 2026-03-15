import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
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
  imports: [MatCardModule, MatButtonModule, MatListModule, MatIconModule, RouterLink],
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
          <button mat-flat-button color="primary" (click)="openAddTask()">
            <mat-icon>add</mat-icon> Add task
          </button>
          <mat-list>
            @for (t of project()!.tasks; track t.id) {
              <mat-list-item>{{ t.name }}</mat-list-item>
            }
          </mat-list>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: `.header { margin-bottom: 16px; }`,
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
