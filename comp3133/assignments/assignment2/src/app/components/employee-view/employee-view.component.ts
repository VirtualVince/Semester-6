import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.scss'],
  standalone: false,
})
export class EmployeeViewComponent implements OnInit {
  employee: any = null;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private empService: EmployeeService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.empService.getById(id).subscribe({
      next: (res: any) => {
        this.employee = res.data.searchEmployeeById;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }
}
