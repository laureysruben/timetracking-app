import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
  ],
  template: `
    <div class="login-page">
      <mat-card class="login-card surface-card mat-elevation-z2">
        <mat-card-header>
          <div class="login-badge" mat-card-avatar>
            <mat-icon>schedule</mat-icon>
          </div>
          <mat-card-title>Welcome back</mat-card-title>
          <mat-card-subtitle>Sign in to manage projects and tracked time.</mat-card-subtitle>
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
              <input matInput [type]="showPassword() ? 'text' : 'password'" formControlName="password" />
              <button
                mat-icon-button
                matSuffix
                type="button"
                [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
                (click)="showPassword.set(!showPassword())"
              >
                <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
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
              class="submit-button"
              type="submit"
              [disabled]="form.invalid || loading()"
            >
              @if (loading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Sign in
              }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .login-page {
      min-height: 100vh;
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      background:
        radial-gradient(circle at top left, color-mix(in srgb, var(--mat-sys-primary) 24%, transparent), transparent 46%),
        radial-gradient(circle at bottom right, color-mix(in srgb, var(--mat-sys-tertiary) 18%, transparent), transparent 42%),
        var(--mat-sys-surface-container-lowest);
    }
    .login-card {
      width: min(460px, 100%);
      border-radius: 28px;
      padding: 10px;
    }
    .login-badge {
      display: grid;
      place-items: center;
      background: color-mix(in srgb, var(--mat-sys-primary) 18%, transparent);
      color: var(--mat-sys-primary);
      border-radius: 12px;
    }
    .full-width {
      width: 100%;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 12px;
    }
    .submit-button {
      height: 44px;
      margin-top: 6px;
    }
    .error {
      margin: 0;
      color: var(--mat-form-field-error-text-color, red);
      font: var(--mat-sys-body-medium);
    }
  `,
})
export class LoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected loading = signal(false);
  protected errorMessage = signal('');
  protected showPassword = signal(false);

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
