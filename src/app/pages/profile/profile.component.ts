import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from "../../components/posts/posts.component";
import { EditProfileComponent } from '../../components/forms/edit-profile/edit-profile.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostsComponent, EditProfileComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  public name: string | null = null;
  public surname: string | null = null;
  public username: string | null = null;
  public birthdate: string | null = null;
  public userAvatarUrl = 'https://jornada.us-sea-1.linodeobjects.com/imagenes/2024/6/24/372280_1_102812_raw.jpg';
  public email: string | null = null;
  public formName: string | null = null;
  public formSurname: string | null = null;
  public formUsername: string | null = null;
  public formBirthdate: string | null = null;

  ngOnInit(): void {
    this.setProfileData();
  }

  setProfileData() {
    this.name = JSON.parse(localStorage.getItem('user')!).name;
    this.surname = JSON.parse(localStorage.getItem('user')!).surname;
    this.username = JSON.parse(localStorage.getItem('user')!).username;
    this.email = JSON.parse(localStorage.getItem('user')!).email;
    this.birthdate = JSON.parse(localStorage.getItem('user')!).birthdate;
  }

  initializeEditUserForm() {
    this.formName = this.name;
    this.formSurname = this.surname;
    this.formUsername = this.username;
    this.formBirthdate = this.birthdate;
  }
}

