import { UsersService } from 'src/app/services/users.service';
import { ImageUploadService } from './../../services/image-upload.service';
import { Component } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from 'firebase/auth';
import { concatMap, switchMap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProfileUser } from 'src/app/models/user-profile';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user$ = this.usersService.currentUserProfile$;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
  });

  constructor(private authService: AuthenticationService,
     private imageUploadService: ImageUploadService,
     private toast: HotToastService,
     private fb: NonNullableFormBuilder,
     private usersService: UsersService
    ){}

  ngOnInit(): void {
    this.usersService.currentUserProfile$.pipe(
      untilDestroyed(this)
    ).subscribe((user) => {
      this.profileForm.patchValue({ ...user })
    })
  }

  uploadImage(event: any, user: ProfileUser) {
    this.imageUploadService.uploadImage(event.target.files[0], `images/profile/${user.uid}`).pipe(
      this.toast.observe({
        loading: 'image is being uploaded...',
        success: 'Image Uploaded',
        error: 'There was an error in uploading'
      }),
      concatMap((photoURL) => this.usersService.updadteUser({ uid: user.uid ,photoURL }))
    ).subscribe()
  }

  saveProfile() {
    const { uid, displayName, firstName, lastName, phone, address } = this.profileForm.value;

    if (!uid || !displayName || !firstName || !lastName || !phone || !address) {
      return;
    }

    this.usersService.updadteUser({ uid, displayName, firstName, lastName, phone, address }).pipe(
      this.toast.observe({
          loading: 'Saving profile data...',
          success: 'Profile updated successfully',
          error: 'There was an error in updating the profile',
      })
    ).subscribe()
  }
}
