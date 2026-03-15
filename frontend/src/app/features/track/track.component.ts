import { Component, inject, signal, computed } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { startOfDay, endOfDay, toISODateString, formatMinutes } from '../../shared/utils/date.utils';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

interface Domain {
  id: number;
  name: string;
}
interface Project {
  id: number;
  name: string;
  domainId: number;
}
interface Task {
  id: number;
  name: string;
  projectId: number;
}
interface TimeEntryRow {
  id: number;
  start: string;
  end: string;
  durationMinutes: number;
  note: string | null;
  domain: { name: string };
  project: { name: string };
  task: { name: string };
}

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
  ],
  template: `
    <h1>Track time</h1>
    <mat-card>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date" />
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Domain</mat-label>
              <mat-select formControlName="domainId" (selectionChange)="onDomainChange()">
                @for (d of domains(); track d.id) {
                  <mat-option [value]="d.id">{{ d.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Project</mat-label>
              <mat-select formControlName="projectId" (selectionChange)="onProjectChange()">
                @for (p of projects(); track p.id) {
                  <mat-option [value]="p.id">{{ p.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Task</mat-label>
              <mat-select formControlName="taskId">
                @for (t of tasks(); track t.id) {
                  <mat-option [value]="t.id">{{ t.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Start time</mat-label>
              <input matInput type="time" formControlName="startTime" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>End time</mat-label>
              <input matInput type="time" formControlName="endTime" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="note">
              <mat-label>Note</mat-label>
              <input matInput formControlName="note" />
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Add entry</button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-header>
        <mat-card-title>Entries for {{ selectedDateLabel() }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="entriesDataSource()" class="entries-table">
          <ng-container matColumnDef="domain">
            <th mat-header-cell *matHeaderCellDef>Domain</th>
            <td mat-cell *matCellDef="let row">{{ row.domain.name }}</td>
          </ng-container>
          <ng-container matColumnDef="project">
            <th mat-header-cell *matHeaderCellDef>Project</th>
            <td mat-cell *matCellDef="let row">{{ row.project.name }}</td>
          </ng-container>
          <ng-container matColumnDef="task">
            <th mat-header-cell *matHeaderCellDef>Task</th>
            <td mat-cell *matCellDef="let row">{{ row.task.name }}</td>
          </ng-container>
          <ng-container matColumnDef="duration">
            <th mat-header-cell *matHeaderCellDef>Duration</th>
            <td mat-cell *matCellDef="let row">{{ formatMinutes(row.durationMinutes) }}</td>
          </ng-container>
          <ng-container matColumnDef="note">
            <th mat-header-cell *matHeaderCellDef>Note</th>
            <td mat-cell *matCellDef="let row">{{ row.note || '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let row">
              <button mat-icon-button (click)="deleteEntry(row.id)" color="warn">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .form-row { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; margin-bottom: 16px; }
    .form-row mat-form-field { min-width: 140px; }
    .note { flex: 1; min-width: 200px; }
    .entries-table { width: 100%; }
  `,
})
export class TrackComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  readonly domains = signal<Domain[]>([]);
  readonly projects = signal<Project[]>([]);
  readonly tasks = signal<Task[]>([]);
  readonly entries = signal<TimeEntryRow[]>([]);

  readonly displayedColumns = ['domain', 'project', 'task', 'duration', 'note', 'actions'];

  readonly form = this.fb.group({
    date: this.fb.control<Date>(new Date()),
    domainId: this.fb.control<number | null>(null),
    projectId: this.fb.control<number | null>(null),
    taskId: this.fb.control<number | null>(null),
    startTime: ['09:00'],
    endTime: ['17:00'],
    note: [''],
  });

  readonly selectedDateLabel = computed(() => {
    const d = this.form.get('date')?.value;
    return d ? toISODateString(d) : '';
  });

  readonly entriesDataSource = computed(() => new MatTableDataSource(this.entries()));

  constructor() {
    this.api.get<Domain[]>('/domains').subscribe((list) => this.domains.set(list));
    const date = this.form.get('date')?.value;
    if (date) this.loadEntries(date);
    this.form.get('date')?.valueChanges?.subscribe((date) => {
      if (date) this.loadEntries(date);
    });
  }

  private loadEntries(date: Date) {
    const from = startOfDay(date).toISOString();
    const to = endOfDay(date).toISOString();
    this.api.get<TimeEntryRow[]>('/time-entries', { from, to }).subscribe((list) => this.entries.set(list));
  }

  onDomainChange() {
    const id = this.form.get('domainId')?.value;
    this.form.patchValue({ projectId: null, taskId: null });
    this.projects.set([]);
    this.tasks.set([]);
    if (id) {
      this.api.get<Project[]>('/projects', { domainId: id }).subscribe((list) => this.projects.set(list));
    }
  }

  onProjectChange() {
    const id = this.form.get('projectId')?.value;
    this.form.patchValue({ taskId: null });
    this.tasks.set([]);
    if (id) {
      this.api.get<Task[]>(`/projects/${id}/tasks`).subscribe((list) => this.tasks.set(list));
    }
  }

  onSubmit() {
    const raw = this.form.getRawValue();
    const taskId = raw.taskId;
    const startTime = raw.startTime;
    const endTime = raw.endTime;
    if (taskId == null || !startTime || !endTime || !raw.date) return;
    const d = toISODateString(raw.date);
    const startDt = `${d}T${startTime}:00`;
    const endDt = `${d}T${endTime}:00`;
    this.api.post<TimeEntryRow>('/time-entries', { taskId, start: startDt, end: endDt, note: raw.note || undefined }).subscribe({
      next: () => {
        this.snackBar.open('Entry added', '', { duration: 2000 });
        this.loadEntries(raw.date!);
        this.form.patchValue({ note: '' });
      },
      error: (err) => this.snackBar.open(err.error?.message ?? 'Failed to add entry', 'Close'),
    });
  }

  deleteEntry(id: number) {
    if (!confirm('Delete this entry?')) return;
    this.api.delete(`/time-entries/${id}`).subscribe({
      next: () => {
        this.snackBar.open('Entry deleted', '', { duration: 2000 });
        const date = this.form.get('date')?.value;
        if (date) this.loadEntries(date);
      },
      error: () => this.snackBar.open('Failed to delete', 'Close'),
    });
  }

  protected formatMinutes = formatMinutes;
}
