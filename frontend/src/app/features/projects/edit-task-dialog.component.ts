import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

export interface TaskFormValue {
  name: string;
  description?: string | null;
  isActive: boolean;
}

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Edit task</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Task name</mat-label>
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
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `.full-width { width: 100%; }`,
})
export class EditTaskDialogComponent {
  private readonly ref = inject(MatDialogRef<EditTaskDialogComponent>);
  private readonly fb = inject(NonNullableFormBuilder);
  readonly data = inject<{ id: number; name: string; description: string | null; isActive: boolean }>(
    MAT_DIALOG_DATA
  );

  readonly form = this.fb.group({
    name: this.data.name,
    description: this.data.description ?? '',
    isActive: this.data.isActive,
  });

  submit() {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      this.ref.close({
        name: raw.name,
        description: raw.description || null,
        isActive: raw.isActive,
      });
    }
  }
}
