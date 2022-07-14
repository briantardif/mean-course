import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {Post} from '../post.model';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {PostsService} from '../posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {mimeType} from './mime-type.validator';

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
  imagePreview: string;
  imageName: string | undefined;

  constructor(
    private postsService: PostsService,
    public route: ActivatedRoute
  ) {
    this.id = '';
    this.post = {content: '', id: '', title: '', imagePath: ''};
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
    });
    this.imagePreview = '';
    this.imageName = '';
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
              console.log(post);
              this.isLoading = false;
              const data = post.data;
              this.post = {id: data._id, title: data.title, content: data.content, imagePath: data.imagePath};
              this.form.setValue({title: this.post.title, content: this.post.content, image: this.post.imagePath});
            });
        }
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onSavePost() {
    console.log(this.form);
    if (this.form?.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      if (this.id) {
        this.postsService.updatePost(this.id, this.form.value.title, this.form.value.content, this.form.value.image);
      }
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.form.patchValue({image: file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file as Blob);
    this.imageName = file?.name;
  }

}
