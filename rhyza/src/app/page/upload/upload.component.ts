import {Component, ElementRef, inject, input, OnInit, ViewChild,} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {MaterialModule} from '../../shared/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SongModel} from '../../models/song.model';
import {Store} from '@ngrx/store';
import {AuthState} from '../../ngrx/auth/auth.state';
import {async, Observable, Subscription} from 'rxjs';
import {AuthModel} from '../../models/auth.model';
import * as SongActions from '../../ngrx/song/song.actions';
import {CategoryState} from '../../ngrx/category/category.state';
import {CategoryModel} from '../../models/category.model';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit{

uploadForm = new FormGroup({
  title: new FormControl('', Validators.required),
  composer: new FormControl('', Validators.required),
  performer_ref: new FormControl('', Validators.required),
  file_path: new FormControl<File | null>(null, Validators.required),
  image_url: new FormControl<File | null>(null, Validators.required),
  category_id: new FormControl('', Validators.required),
  uuid: new FormControl(''),
  createdAt: new FormControl(''),
  views: new FormControl(0),
});

auth$ !: Observable<AuthModel| null>;
categoryList$ !: Observable<CategoryModel[]>;
  authData: AuthModel | null = null;
  subcription: Subscription[] = [];
  constructor(private store: Store<{
    auth:AuthState,
    category:CategoryState
  }>) {
    this.auth$ = this.store.select('auth', 'authData');
    this.categoryList$ = this.store.select('category', 'categoryList');
  }

  ngOnInit() {
    this.subcription.push(
      this.auth$.subscribe((authData) => {
        if(authData?.idToken){
          this.authData = authData;
          console.log('authData', this.authData);
        }
      }),
      this.categoryList$.subscribe((categoryList) => {
        if (categoryList.length>0) {
          console.log('categoryList', categoryList);
        }
      })
    );

  }

  formData: SongModel={} as SongModel;
  confirmForm() {
    this.formData = {
      file_path: this.uploadForm.value.file_path ?? '',
      image_url: this.uploadForm.value.image_url ?? '',
      title: this.uploadForm.value.title ?? '',
      composer: this.uploadForm.value.composer ?? '',
      performer_ref: this.uploadForm.value.performer_ref ?? '',
      category_id: this.uploadForm.value.category_id ?? '',
      uuid: this.authData?.uid ?? '',
      createdAt: new Date().toISOString(),
      views: 0,
    } as SongModel;


    // this.store.dispatch(SongActions.createSong({song: this.formData, idToken: this.authData?.idToken ?? ''}));

    console.log(this.formData);
  }


  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  audioFiles: { name: string; url: string; type: string }[] = [];

  uploadedAudio: any = null;
  audioURL: string | null = null;

  onAudioSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Kiểm tra định dạng file
      const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aiff', 'audio/alac'];
      if (!allowedAudioTypes.includes(file.type)) {
        alert('Chỉ được chọn file audio (.mp3, .wav, .flac, .aiff, .alac)');
        return;
      }

      this.uploadForm.patchValue({ file_path: file });
    }
  }

  openFilePicker() {
    document.getElementById('audioInput')?.click();

  }

 onFileSelected(event: Event) {
   const input = event.target as HTMLInputElement;
   if (input.files && input.files.length > 0) {
     const file = input.files[0]; // Lấy file đầu tiên
     this.uploadForm.patchValue({ file_path: file }); // Lưu file
     this.uploadForm.get('file_path')?.updateValueAndValidity();

     console.log("File đã chọn:", this.uploadForm.get('file_path')?.value);
   }
 }


  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  imagePreview: string | ArrayBuffer | null = null;

  openImagePicker() {
    this.imageInput.nativeElement.click(); // Mở hộp thoại chọn file
  }
  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Kiểm tra định dạng file ảnh
      const allowedImageTypes = ['image/jpeg', 'image/png'];
      if (!allowedImageTypes.includes(file.type)) {
        alert('Chỉ được chọn file ảnh (.jpg, .png)');
        return;
      }

      // Đọc file và hiển thị ảnh xem trước
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.uploadForm.patchValue({ image_url: file });
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid) {
      console.log('Song Submit Successed', this.uploadForm.value);
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Add some visual feedback
    const uploadBox = document.getElementById('upload-box');
    if (uploadBox) {
      uploadBox.style.borderColor = 'green';
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Remove visual feedback
    const uploadBox = document.getElementById('upload-box');
    if (uploadBox) {
      uploadBox.style.borderColor = 'white';
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const uploadBox = document.getElementById('upload-box');
    if (uploadBox) {
      uploadBox.style.borderColor = 'white';
    }
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aiff', 'audio/alac'];
      if (!allowedAudioTypes.includes(file.type)) {
        alert('Chỉ được chọn file audio (.mp3, .wav, .flac, .aiff, .alac)');
        return;
      }
      this.uploadForm.patchValue({ file_path: file });
      event.dataTransfer.clearData();
    }
  }
  onImageDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Add some visual feedback
    const uploadImage = document.getElementById('upload-image');
    if (uploadImage) {
      uploadImage.style.borderColor = 'green';
    }
  }

  onImageDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Remove visual feedback
    const uploadImage = document.getElementById('upload-image');
    if (uploadImage) {
      uploadImage.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    }
  }

  onImageDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const uploadImage = document.getElementById('upload-image');
    if (uploadImage) {
      uploadImage.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    }
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const allowedImageTypes = ['image/jpeg', 'image/png'];
      if (!allowedImageTypes.includes(file.type)) {
        alert('Chỉ được chọn file ảnh (.jpg, .png)');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.uploadForm.patchValue({ file_path: file });
      event.dataTransfer.clearData();
    }
  }

  protected readonly async = async;
}
