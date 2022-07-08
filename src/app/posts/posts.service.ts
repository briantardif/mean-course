import { Injectable } from '@angular/core';
import {Post} from './post.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((data) => {
        this.posts = data.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post = {
      id: '',
      title,
      content
    };
    this.http.post('http://localhost:3000/api/post', post)
      .subscribe((data: any) => {
        console.log(data.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      })
  }
}
