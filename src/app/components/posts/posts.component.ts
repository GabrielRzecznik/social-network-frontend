import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Post } from '../../core/models/post/post.model';
import { PostService } from '../../core/services/post.service';
import { FullDateTime } from '../../pipes/full-date-time.pipe';

@Component({
  selector: 'app-posts',
  imports: [ FullDateTime ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];

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
}
