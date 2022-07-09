import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {Post} from '../post.model';
import {NgForm} from '@angular/forms';
import {PostsService} from '../posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = 'create';
  private id: string | null;
  public post: Post | null;
  isLoading = false;

  constructor(
    private postsService: PostsService,
    public route: ActivatedRoute
  ) {
    this.id = '';
    this.post = { content: '', id: '', title: ''};
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        console.log('inside edit mode');
        this.mode = 'edit';
        this.id = paramMap.get('id');
        if (this.id) {
          this.isLoading = true;
          this.postsService.getPost(this.id)
            .subscribe(post => {
              this.isLoading = false;
              const data = post.data;
              this.post = { id: data._id, title: data.title, content: data.content };
            });
        }
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      if (this.id) {
        this.postsService.updatePost(this.id, form.value.title, form.value.content);
      }
    }
    form.resetForm();
  }

}
