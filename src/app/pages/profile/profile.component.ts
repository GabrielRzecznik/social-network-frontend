import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from "../../components/posts/posts.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostsComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  name: string | null = null;
  surname: string | null = null;
  username: string | null = null;
  birthdate: string | null = null;

  ngOnInit(): void {
    this.name = JSON.parse(localStorage.getItem('user')!).name;
    this.surname = JSON.parse(localStorage.getItem('user')!).surname;
    this.username = JSON.parse(localStorage.getItem('user')!).username;
    this.birthdate = JSON.parse(localStorage.getItem('user')!).birthdate;
  }
}

