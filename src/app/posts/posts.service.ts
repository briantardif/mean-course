import { Injectable } from '@angular/core';
import {Post} from './post.model';
import {Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {response} from 'express';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], totalPosts: number}>();

  constructor(private http: HttpClient,
              private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `pageSize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, totalPosts: number}>(`http://localhost:3000/api/posts?${queryParams}`)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            }
          }),
          totalPosts: postData.totalPosts
        }
      }))
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({posts: [...this.posts], totalPosts: transformedPostData.totalPosts});
      });
  }

  getPost(id: string) {
    return this.http.get<{message: string, data: {_id: string, title: string, content: string, imagePath: string}}>(`http://localhost:3000/api/post/${id}`);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/post', postData)
      .subscribe((data: any) => {
        this.router.navigate(['/']);
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let post: Post | FormData;
    if (typeof(image) === 'object') {
      post = new FormData();
      post.append('id', id);
      post.append('title', title);
      post.append('content', content);
      post.append('image', image, title);
    } else {
      post = { id, title, content, imagePath: image };
    }
    this.http.put(`http://localhost:3000/api/post/${id}`, post)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(`http://localhost:3000/api/post/${postId}`);
  }
}
