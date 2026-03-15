import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Project {
  id: number;
  name: string;
  isActive: boolean;
  domain: { name: string };
}

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <h1>Projects</h1>
    <mat-card>
      <mat-card-content>
        <table mat-table [dataSource]="projects()" class="full-width">
          <ng-container matColumnDef="domain">
            <th mat-header-cell *matHeaderCellDef>Domain</th>
            <td mat-cell *matCellDef="let p">{{ p.domain.name }}</td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let p">{{ p.name }}</td>
          </ng-container>
          <ng-container matColumnDef="active">
            <th mat-header-cell *matHeaderCellDef>Active</th>
            <td mat-cell *matCellDef="let p">{{ p.isActive ? 'Yes' : 'No' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let p">
              <a mat-button [routerLink]="['/projects', p.id]">
                <mat-icon>open_in_new</mat-icon> Open
              </a>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: `.full-width { width: 100%; }`,
})
export class ProjectsListComponent {
  private readonly api = inject(ApiService);
  readonly projects = signal<Project[]>([]);
  readonly displayedColumns = ['domain', 'name', 'active', 'actions'];

  constructor() {
    this.api.get<Project[]>('/projects').subscribe((list) => this.projects.set(list));
  }
}
