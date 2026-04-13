import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  standalone: false,
})
export class EmployeeListComponent implements OnInit {
  displayedColumns = ['photo', 'name', 'email', 'department', 'designation', 'salary', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = true;
  error = '';
  searchDept = '';
  searchDes = '';
  isSearching = false;

  constructor(private empService: EmployeeService, private auth: AuthService) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.error = '';
    this.empService.getAll().valueChanges.subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data.getAllEmployees;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  search() {
    if (!this.searchDept && !this.searchDes) {
      this.loadAll();
      return;
    }
    this.loading = true;
    this.isSearching = true;
    this.empService.search(this.searchDept || undefined, this.searchDes || undefined).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data.searchEmployeeByDepOrDes;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  clearSearch() {
    this.searchDept = '';
    this.searchDes = '';
    this.isSearching = false;
    this.loadAll();
  }

  delete(id: string) {
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) return;
    this.empService.delete(id).subscribe({
      next: () => this.loadAll(),
      error: (err: any) => (this.error = err.message),
    });
  }

  logout() {
    this.auth.logout();
  }
}
