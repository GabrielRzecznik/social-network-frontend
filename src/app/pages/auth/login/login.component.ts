import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/login-request.model';
import { response } from 'express';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
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
    private authService: AuthService
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
    
      console.log('Payload enviado:', data);
    
      this.authService.login(data).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          // Redirigir al usuario a la página principal
          // this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error de login:', err);
          // Mostrar un mensaje de error al usuario (ej: "Credenciales inválidas")
        }
      });
    }
  }
}
