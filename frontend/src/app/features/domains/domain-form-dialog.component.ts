import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-domain-form-dialog',
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
    <h2 mat-dialog-title>{{ data ? 'Edit domain' : 'New domain' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
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
export class DomainFormDialogComponent {
  private readonly ref = inject(MatDialogRef<DomainFormDialogComponent>);
  private readonly fb = inject(NonNullableFormBuilder);
  readonly data = inject<{ id: number; name: string; description: string | null; isActive: boolean } | null>(
    MAT_DIALOG_DATA
  );

  readonly form = this.fb.group({
    name: this.data?.name ?? '',
    description: this.data?.description ?? '',
    isActive: this.data?.isActive ?? true,
  });

  submit() {
    if (this.form.valid) {
      this.ref.close(this.form.getRawValue());
    }
  }
}
