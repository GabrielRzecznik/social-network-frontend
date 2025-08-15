import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Post } from '../../core/models/post/post.model';
import { PostService } from '../../core/services/post.service';
import { FullDateTime } from '../../pipes/full-date-time.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-posts',
  imports: [ FullDateTime, CommonModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  colSize = 3;

  constructor(private postService: PostService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    const username = JSON.parse(localStorage.getItem('user')!).username;

    this.postService.getPostsByUser(username).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.cd.detectChanges();
        console.log('Posts:', posts);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  increaseSize() {
    const sizes = [2, 3, 4, 6, 12];
    const idx = sizes.indexOf(this.colSize);
    if (idx > 0) {
      this.colSize = sizes[idx - 1];
    }
  }

  decreaseSize() {
    const sizes = [2, 3, 4, 6, 12];
    const idx = sizes.indexOf(this.colSize);
    if (idx < sizes.length - 1) {
      this.colSize = sizes[idx + 1];
    }
  }
}
