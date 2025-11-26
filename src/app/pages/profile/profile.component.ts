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

@Component({
  selector: 'app-profile',
  standalone: true,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' }
  ],
  imports: [CommonModule, ReactiveFormsModule, PostsComponent, MatDialogModule, MatButtonModule, MatNativeDateModule],
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
    private dialog: MatDialog
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
    const dialogRef = this.dialog.open(EditUserFormComponent, {
      //width: '400px',
      data: { userForm: this.userForm } // pasar el form al hijo
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'submit') {
        this.onSubmit();  // guardar desde el padre
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
        console.warn('❌ Formulario inválido. No se puede enviar.');
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

    console.log('📅 VALOR DE FECHA ANTES DE PROCESAR:', formValues.birthdate);
    console.log('📅 TIPO DE DATO DE FECHA:', typeof formValues.birthdate);

    // 4. Llamar al servicio y manejar la respuesta
    this.userService.updateProfile(payload).subscribe({
      next: (res: any) => {
        console.log('📌 RESPUESTA BACKEND (EXITOSA):', res);
        
        // 5. Actualizar localStorage con los nuevos datos
        const oldUser = JSON.parse(localStorage.getItem('user')!);
        const updatedUser: User = { ...oldUser, ...res.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // 6. Actualizar el estado reactivo del componente
        this.setProfileData();
        
      },
      error: (err) => {
        // 7. Manejo de errores
        console.error('❌ ERROR AL ACTUALIZAR:', err.error?.message || err);
      },
    });
}
}
