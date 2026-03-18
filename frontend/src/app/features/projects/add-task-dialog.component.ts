import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Add task</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content class="dialog-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Task name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">Add</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `
    .dialog-content {
      min-width: min(460px, 78vw);
      padding-top: 6px;
    }
    .full-width {
      width: 100%;
    }
    @media (max-width: 700px) {
      .dialog-content {
        min-width: auto;
      }
    }
  `,
})
export class AddTaskDialogComponent {
  private readonly ref = inject(MatDialogRef<AddTaskDialogComponent>);
  private readonly fb = inject(NonNullableFormBuilder);
  readonly data = inject<{ projectId: number }>(MAT_DIALOG_DATA);

  readonly form = this.fb.group({ name: [''] });

  submit() {
    if (this.form.valid) {
      this.ref.close(this.form.getRawValue().name);
    }
  }
}
