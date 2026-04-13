import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: false,
})
export class SignupComponent {
  form: FormGroup;
  error = '';
  success = '';
  loading = false;
  hidePassword = true;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { username, email, password } = this.form.value;
    this.auth.signup(username, email, password).subscribe({
      next: () => {
        this.success = 'Account created successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1800);
      },
      error: (err: any) => {
        this.error = err.message || 'Signup failed. Please try again.';
        this.loading = false;
      },
    });
  }
}
