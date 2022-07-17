import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  public posts: Post[] = [];
  public isLoading = false;
  private postsSub: Subscription | undefined;
  public totalPosts: number;
  public postsPerPage: number;
  public pageSizeOptions: number[];
  private currentPage: number;
  private authStatusSub!: Subscription;
  public isUserAuthenticated: boolean;

  constructor(private postsService: PostsService, private authService: AuthService) {
    this.totalPosts = 0;
    this.postsPerPage = 2;
    this.pageSizeOptions = [1, 2, 5, 10];
    this.currentPage = 1;
    this.isUserAuthenticated = false;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], totalPosts: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.totalPosts;
      });
    this.isUserAuthenticated = this.authService.getAuthStatus();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
      });
  }

  onDelete(postId: string) {
    if (this.posts.length === 1 && (this.totalPosts - (this.postsPerPage * this.currentPage)) < this.totalPosts){
      this.currentPage -= 1;
    }
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub?.unsubscribe();
    this.authStatusSub?.unsubscribe();
  }

}
