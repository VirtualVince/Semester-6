import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss'],
  standalone: false,
})
export class EmployeeAddComponent {
  form: FormGroup;
  error = '';
  loading = false;
  photoPreview: string | null = null;

  departments = ['Engineering', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales', 'Design', 'IT'];
  genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  constructor(private fb: FormBuilder, private empService: EmployeeService, private router: Router) {
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
    this.empService.add(data).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: (err: any) => {
        this.error = err.message || 'Failed to add employee.';
        this.loading = false;
      },
    });
  }
}
