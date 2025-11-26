import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsComponent } from "../../components/posts/posts.component";
import { UserService } from '../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EditUserFormComponent } from '../../components/forms/edit-user-form/edit-user-form.component';
import { User } from '../../core/models/user/user.model';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' }
  ],
  imports: [CommonModule, ReactiveFormsModule, PostsComponent, MatDialogModule, MatButtonModule, MatNativeDateModule, MatSnackBarModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  public userForm!: FormGroup;

  private userProfileSubject = new BehaviorSubject<User | null>(null);
  public userProfile$: Observable<User | null> = this.userProfileSubject.asObservable();

  public userAvatarUrl = 'https://jornada.us-sea-1.linodeobjects.com/imagenes/2024/6/24/372280_1_102812_raw.jpg';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef, 
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.setProfileData();
  }

  setProfileData() {
    const user = JSON.parse(localStorage.getItem('user')!) as User;
    
    this.userProfileSubject.next(user);

    this.initializeEditUserForm(user);
  }

  initializeEditUserForm(user: User) {
    const initialBirthdate = user.birthdate ? new Date(user.birthdate) : null;
    
    this.userForm = this.fb.group({
      name: [user.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      surname: [user.surname, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      username: [user.username, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]],
      birthdate: [initialBirthdate, [Validators.required]],
    });
  }

  openEditUserDialog() {
    this.setProfileData();

    const dialogRef = this.dialog.open(EditUserFormComponent, {
      data: { userForm: this.userForm }
    });

    dialogRef.componentInstance.submitEvent.subscribe(() => {
      this.onSubmit(dialogRef);
    });
  }

  onSubmit(dialogRef?: any) {
    if (this.userForm.invalid) {
      this.snackBar.open("❌ Formulario inválido. No se puede enviar.", 'Cerrar', {
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error']
      });
      return;
    }

    // 1. Obtener los valores del formulario
    const formValues = this.userForm.value;

    // 2. Procesar la fecha para evitar que el backend detecte un cambio falso
    let birthdateValue = formValues.birthdate;

    if (birthdateValue instanceof Date) {
        const year = birthdateValue.getFullYear();
        const month = String(birthdateValue.getMonth() + 1).padStart(2, '0');
        const day = String(birthdateValue.getDate() + 1).padStart(2, '0');

        // Formar cadena YYYY-MM-DD
        birthdateValue = `${year}-${month}-${day}`;
    }
    
    // 3. Crear el payload con la fecha limpia
    const payload = {
        ...formValues,
        birthdate: birthdateValue
    };

    // 4. Llamar al servicio y manejar la respuesta
    this.userService.updateProfile(payload).subscribe({
      next: (res: any) => {
        this.snackBar.open(res.message, 'Cerrar', {
            duration: 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-error']
          });
        
        // 5. Actualizar localStorage con los nuevos datos
        const oldUser = JSON.parse(localStorage.getItem('user')!);
        const updatedUser: User = { ...oldUser, ...res.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // 6. Actualizar el estado reactivo del componente
        this.setProfileData();
        dialogRef?.close();
      },
      error: (err) => {
        const errorMessage = err?.error?.message || 'Ocurrió un error inesperado';

        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      },
    });
}
}
