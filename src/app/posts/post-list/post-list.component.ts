import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';

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

  constructor(private postsService: PostsService) {
    this.totalPosts = 0;
    this.postsPerPage = 2;
    this.pageSizeOptions = [1, 2, 5, 10];
    this.currentPage = 1;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], totalPosts: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.totalPosts;
      })
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
  }

}
