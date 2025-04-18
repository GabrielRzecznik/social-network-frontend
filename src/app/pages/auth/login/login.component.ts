import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth/login-request.model';
import { response } from 'express';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    //private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { usernameOrEmail, password } = this.loginForm.value;
    
      const data: LoginRequest = usernameOrEmail.includes('@')
        ? { email: usernameOrEmail, password }
        : { username: usernameOrEmail, password };
    
      this.authService.login(data).subscribe({
        next: (response) => {
          // Redirigir al usuario a la página principal
          // this.router.navigate(['/home']);
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Ocurrió un error inesperado';
          console.error('Mensaje de error:', errorMessage);

          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 20000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  }
}
