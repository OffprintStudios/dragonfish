import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';

import * as models from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth';
import { AlertsService } from 'src/app/modules/alerts';
import { ThrowStmt } from '@angular/compiler';
import { HttpError } from 'src/app/models/site';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {
  currentUser: models.User;
  uploading = false;
  uploader: FileUploader = new FileUploader({
    url: '/api/auth/upload-avatar',
    itemAlias: 'avatar'
  });

  themePrefOptions = [
    { name: 'crimson', displayName: 'Crimson' },
    { name: 'dark-crimson', displayName: 'Dark Crimson' },
    { name: 'aqua', displayName: 'Aqua' },
    { name: 'dark-aqua', displayName: 'Dark Aqua' },
    { name: 'royal', displayName: 'Royal' },
    { name: 'dark-royal', displayName: 'Dark Royal' },
    { name: 'steel', displayName: 'Steel' },
    { name: 'midnight-field', displayName: 'Midnight Field' },
    { name: 'autumn', displayName: 'Autumn' },
    { name: 'dusk-autumn', displayName: 'Autumn at Dusk' }
  ];

  changeUsernameAndEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    currPassword: new FormControl('', [Validators.required])
  });

  changePasswordForm = new FormGroup({
    newPassword: new FormControl('', Validators.required),
    confirmNewPassword: new FormControl('', Validators.required),
    currPassword: new FormControl('', Validators.required)
  });

  changeProfileForm = new FormGroup({
    newThemePref: new FormControl(this.themePrefOptions[0]),
    newBio: new FormControl('')
  });

  constructor(private authService: AuthService, private alertsService: AlertsService) {
    this.authService.currUser.subscribe(x => {
      let themePrefIndex = 0;

      switch (x.profile.themePref) {
        case 'crimson':
          themePrefIndex = 0;
          break;
        case 'dark-crimson':
          themePrefIndex = 1;
          break;
        case 'aqua':
          themePrefIndex = 2;
          break;
        case 'dark-aqua':
          themePrefIndex = 3;
          break;
        case 'royal':
          themePrefIndex = 4;
          break;
        case 'dark-royal':
          themePrefIndex = 5;
          break;
        case 'steel':
          themePrefIndex = 6;
          break;
        case 'midnight-field':
          themePrefIndex = 7;
          break;
        case 'autumn':
          themePrefIndex = 8;
          break;
        case 'dusk-autumn':
          themePrefIndex = 9;
          break;
      }

      this.changeUsernameAndEmailForm.setValue({
        email: x.email,
        username: x.username,
        currPassword: ''
      });

      this.changeProfileForm.setValue({
        newThemePref: this.themePrefOptions[themePrefIndex],
        newBio: x.profile.bio
      });

      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    this.uploader.onAfterAddingFile = () => this.changeAvatar();
  }

  get usernameAndEmailFields() { return this.changeUsernameAndEmailForm.controls; }
  get passwordFields() { return this.changePasswordForm.controls; }
  get changeProfileFields() { return this.changeProfileForm.controls; }

  submitUsernameAndEmailForm() {
    const newNameAndEmail: models.ChangeNameAndEmail = {
      username: this.usernameAndEmailFields.username.value,
      email: this.usernameAndEmailFields.email.value,
      currentPassword: this.usernameAndEmailFields.currPassword.value,
    };

    this.authService.changeNameAndEmail(newNameAndEmail).subscribe(() => {
      location.reload();
    });
  }

  submitChangePasswordForm() {
    if (this.passwordFields.newPassword.value !== this.passwordFields.confirmNewPassword.value) {
      alert('Your new password doesn\'t match.');
      return;
    }

    const newPasswordInfo: models.ChangePassword = {
      currentPassword: this.passwordFields.currPassword.value,
      newPassword: this.passwordFields.newPassword.value,
    };

    this.authService.changePassword(newPasswordInfo).subscribe(() => {
      location.reload();
    });
  }

  submitProfileForm() {
    const newProfileInfo: models.ChangeProfile = {
      themePref: this.changeProfileFields.newThemePref.value.name,
      bio: this.changeProfileFields.newBio.value,
    };

    this.authService.changeProfile(newProfileInfo).subscribe(() => {
      location.reload();
    });
  }

  changeAvatar() {
    this.uploader.authToken = `Bearer ${this.currentUser.token}`;
    this.uploading = true;
    this.authService.changeAvatar(this.uploader).subscribe(
      (newUser: models.User) => {
        this.uploading = false;
        this.alertsService.success('Avatar uploaded successfully!');
      },
      (error: HttpError) => {
        this.uploading = false;
        this.alertsService.error(`Failed to upload your avatar. ${error.message} (HTTP ${error.statusCode} ${error.error})`);
      },
    );
  }

}
