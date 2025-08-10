import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../core/models/post/post.model';
import { PostService } from '../../core/services/post.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private postService = inject(PostService);
  posts: Post[] = [];

  ngOnInit() {
    const username = JSON.parse(localStorage.getItem('user')!).username;

    this.postService.getPostsByUser(username).subscribe({
      next: (posts) => {
        this.posts = posts;
        console.log('Posts:', posts);
      },
      error: (err) => console.error('Error:', err),
    });
  }
}

