import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {Post} from '../post.model';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
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
  public post: Post;
  isLoading = false;
  form: FormGroup;

  constructor(
    private postsService: PostsService,
    public route: ActivatedRoute
  ) {
    this.id = '';
    this.post = { content: '', id: '', title: ''};
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.id = paramMap.get('id');
        if (this.id) {
          this.isLoading = true;
          this.postsService.getPost(this.id)
            .subscribe(post => {
              this.isLoading = false;
              const data = post.data;
              this.post = { id: data._id, title: data.title, content: data.content };
              this.form.setValue({title: this.post.title, content: this.post.content});
            });
        }
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onSavePost() {
    if (this.form?.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      if (this.id) {
        this.postsService.updatePost(this.id, this.form.value.title, this.form.value.content);
      }
    }
    this.form.reset();
  }

}
