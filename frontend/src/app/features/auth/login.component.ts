import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Log in</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" />
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <mat-error>Valid email required</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" />
              @if (form.get('password')?.invalid && form.get('password')?.touched) {
                <mat-error>Password required</mat-error>
              }
            </mat-form-field>
            @if (errorMessage()) {
              <p class="error">{{ errorMessage() }}</p>
            }
            <button
              mat-flat-button
              color="primary"
              type="submit"
              [disabled]="form.invalid || loading()"
            >
              @if (loading()) {
                <mat-spinner diameter="24"></mat-spinner>
              } @else {
                Log in
              }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 16px; }
    mat-card { max-width: 400px; width: 100%; }
    .full-width { width: 100%; }
    form { display: flex; flex-direction: column; gap: 8px; }
    .error { color: var(--mat-form-field-error-text-color, red); margin: 8px 0; }
  `,
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);

  readonly form = this.fb.group({
    email: [''],
    password: [''],
  });

  protected loading = signal(false);
  protected errorMessage = signal('');

  onSubmit() {
    this.errorMessage.set('');
    if (this.form.invalid) return;
    this.loading.set(true);
    this.auth.login(this.form.getRawValue().email, this.form.getRawValue().password).subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Login failed');
      },
    });
  }
}
