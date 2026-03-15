import { Component, inject, signal, computed } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { toISODateString, formatMinutes } from '../../shared/utils/date.utils';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

interface ReportByProjectRow {
  projectId: number;
  projectName: string;
  domainName: string;
  totalMinutes: number;
}
interface ReportByUserRow {
  userId: number;
  userName: string;
  userEmail: string;
  totalMinutes: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
  ],
  template: `
    <h1>Reports</h1>
    <mat-card>
      <mat-card-content>
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>From</mat-label>
            <input matInput [matDatepicker]="fromPicker" [ngModel]="from()" (ngModelChange)="from.set($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="fromPicker"></mat-datepicker-toggle>
            <mat-datepicker #fromPicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>To</mat-label>
            <input matInput [matDatepicker]="toPicker" [ngModel]="to()" (ngModelChange)="to.set($event)" />
            <mat-datepicker-toggle matIconSuffix [for]="toPicker"></mat-datepicker-toggle>
            <mat-datepicker #toPicker></mat-datepicker>
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="load()">Apply</button>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-header>
        <mat-card-title>Time by project</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="byProject()" class="full-width">
          <ng-container matColumnDef="project">
            <th mat-header-cell *matHeaderCellDef>Project</th>
            <td mat-cell *matCellDef="let r">{{ r.projectName }}</td>
          </ng-container>
          <ng-container matColumnDef="domain">
            <th mat-header-cell *matHeaderCellDef>Domain</th>
            <td mat-cell *matCellDef="let r">{{ r.domainName }}</td>
          </ng-container>
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef>Total</th>
            <td mat-cell *matCellDef="let r">{{ formatMinutes(r.totalMinutes) }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="projectColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: projectColumns"></tr>
        </table>
      </mat-card-content>
    </mat-card>

    @if (auth.isAdmin()) {
      <mat-card>
        <mat-card-header>
          <mat-card-title>Time by user</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="byUser()" class="full-width">
            <ng-container matColumnDef="user">
              <th mat-header-cell *matHeaderCellDef>User</th>
              <td mat-cell *matCellDef="let r">{{ r.userName }} ({{ r.userEmail }})</td>
            </ng-container>
            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let r">{{ formatMinutes(r.totalMinutes) }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: userColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: `
    .filters { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 16px; }
    .full-width { width: 100%; }
    mat-card { margin-bottom: 16px; }
  `,
})
export class ReportsComponent {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);

  readonly from = signal<Date>((() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  })());
  readonly to = signal<Date>(new Date());

  readonly byProject = signal<ReportByProjectRow[]>([]);
  readonly byUser = signal<ReportByUserRow[]>([]);

  readonly projectColumns = ['project', 'domain', 'total'];
  readonly userColumns = ['user', 'total'];

  constructor() {
    this.load();
  }

  load() {
    const fromStr = toISODateString(this.from());
    const toStr = toISODateString(this.to());
    this.api
      .get<ReportByProjectRow[]>('/reports/projects', { from: fromStr, to: toStr })
      .subscribe((list) => this.byProject.set(list));
    if (this.auth.isAdmin()) {
      this.api
        .get<ReportByUserRow[]>('/reports/users', { from: fromStr, to: toStr })
        .subscribe((list) => this.byUser.set(list));
    }
  }

  protected formatMinutes = formatMinutes;
}
