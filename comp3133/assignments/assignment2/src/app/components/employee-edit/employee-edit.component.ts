import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'],
  standalone: false,
})
export class EmployeeEditComponent implements OnInit {
  form: FormGroup;
  id = '';
  error = '';
  loading = false;
  fetching = true;
  photoPreview: string | null = null;

  departments = ['Engineering', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales', 'Design', 'IT'];
  genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private empService: EmployeeService,
    private router: Router
  ) {
    this.form = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(1)]],
      date_of_joining: ['', [Validators.required]],
      employee_photo: [''],
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.empService.getById(this.id).subscribe({
      next: (res: any) => {
        const emp = res.data.searchEmployeeById;
        this.form.patchValue({
          first_name: emp.first_name,
          last_name: emp.last_name,
          email: emp.email,
          gender: emp.gender,
          designation: emp.designation,
          department: emp.department,
          salary: emp.salary,
          date_of_joining: emp.date_of_joining,
          employee_photo: emp.employee_photo,
        });
        this.photoPreview = emp.employee_photo || null;
        this.fetching = false;
      },
      error: (err: any) => {
        this.error = err.message;
        this.fetching = false;
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      this.error = 'Image must be under 2MB';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.photoPreview = e.target.result;
      this.form.patchValue({ employee_photo: e.target.result });
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.photoPreview = null;
    this.form.patchValue({ employee_photo: '' });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const data = { ...this.form.value, salary: parseFloat(this.form.value.salary) };
    this.empService.update(this.id, data).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: (err: any) => {
        this.error = err.message || 'Failed to update employee.';
        this.loading = false;
      },
    });
  }
}
