import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent {
  form: FormGroup;
  error = '';
  loading = false;
  hidePassword = true;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) this.router.navigate(['/employees']);
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { username, password } = this.form.value;
    this.auth.login(username, password).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.data.login.token);
        this.router.navigate(['/employees']);
      },
      error: (err: any) => {
        this.error = err.message || 'Invalid credentials. Please try again.';
        this.loading = false;
      },
    });
  }
}
