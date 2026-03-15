import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

interface Domain {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-project-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>New project</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Domain</mat-label>
          <mat-select formControlName="domainId">
            @for (d of domains(); track d.id) {
              <mat-option [value]="d.id">{{ d.name }}</mat-option>
            }
          </mat-select>
          @if (domains().length === 0 && !loading()) {
            <mat-hint>No domains yet. Create one under Domains first.</mat-hint>
          }
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Project name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <input matInput formControlName="description" />
        </mat-form-field>
        <mat-checkbox formControlName="isActive">Active</mat-checkbox>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || domains().length === 0">
          Create
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `.full-width { width: 100%; }`,
})
export class AddProjectDialogComponent {
  private readonly ref = inject(MatDialogRef<AddProjectDialogComponent>);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(ApiService);

  readonly domains = signal<Domain[]>([]);
  readonly loading = signal(true);

  readonly form = this.fb.group({
    domainId: this.fb.control<number | null>(null),
    name: [''],
    description: [''],
    isActive: true,
  });

  constructor() {
    this.api.get<Domain[]>('/domains').subscribe({
      next: (list) => {
        this.domains.set(list);
        this.loading.set(false);
        const first = this.domains()[0];
        if (first) {
          this.form.patchValue({ domainId: first.id });
        }
      },
      error: () => this.loading.set(false),
    });
  }

  submit() {
    const raw = this.form.getRawValue();
    if (this.form.valid && raw.domainId != null) {
      this.ref.close({
        domainId: raw.domainId,
        name: raw.name,
        description: raw.description || undefined,
        isActive: raw.isActive,
      });
    }
  }
}
