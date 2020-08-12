import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { ToppyControl, Toppy, GlobalPosition, InsidePlacement } from 'toppy';

import * as models from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth';
import { AlertsService } from 'src/app/modules/alerts';
import { ThrowStmt } from '@angular/compiler';
import { HttpError } from 'src/app/models/site';
import { UploadAvatarComponent } from 'src/app/components/modals/account';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {
  currentUser: models.User;

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
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
    currPassword: new FormControl('', [Validators.required])
  });

  changePasswordForm = new FormGroup({
    newPassword: new FormControl('', Validators.required),
    confirmNewPassword: new FormControl('', Validators.required),
    currPassword: new FormControl('', Validators.required)
  });

  changeProfileForm = new FormGroup({
    newThemePref: new FormControl(this.themePrefOptions[0]),
    newBio: new FormControl('', [Validators.minLength(3), Validators.maxLength(50)])
  });

  changeAvatarModal: ToppyControl;

  constructor(private authService: AuthService, private alertsService: AlertsService, private toppy: Toppy) {
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

      this.changeProfileForm.setValue({
        newThemePref: this.themePrefOptions[themePrefIndex],
        newBio: x.profile.bio
      });

      this.currentUser = x;
    });
  }

  ngOnInit(): void {
    // Settings for the changeAvatar modal
    const position = new GlobalPosition({
      placement: InsidePlacement.CENTER,
      width: '90%',
      height: '90%'
    });

    this.changeAvatarModal = this.toppy
      .position(position)
      .config({closeOnEsc: true, backdrop: true})
      .content(UploadAvatarComponent)
      .create();
  }
  
  get passwordFields() { return this.changePasswordForm.controls; }
  get changeProfileFields() { return this.changeProfileForm.controls; }

  changeEmail = (newEmail: string, password: string): Observable<string> => {
    const changeRequest: models.ChangeEmail = {
      currentPassword: password,
      newEmail: newEmail
    };
    return this.authService.changeEmail(changeRequest)
      .pipe(map(x => {
        if (x) {
          this.alertsService.success("Email successfully changed!");
          return x.email;          
        } else {
          return null;
        }
      }), catchError(_ => {
        return of(null);
      }));
  };

  submitChangePasswordForm() {
    if (this.passwordFields.newPassword.invalid || this.passwordFields.confirmNewPassword.invalid) {
      this.alertsService.warn(`Password fields cannot be empty.`);
      return;
    }

    if (this.passwordFields.newPassword.value !== this.passwordFields.confirmNewPassword.value) {
      this.alertsService.warn('Your new password doesn\'t match.');
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
    if (this.changeProfileFields.newBio.invalid) {
      this.alertsService.warn(`Bios must be between 3 and 50 characters.`);
      return;
    }

    const newProfileInfo: models.ChangeProfile = {
      themePref: this.changeProfileFields.newThemePref.value.name,
      bio: this.changeProfileFields.newBio.value,
    };

    this.authService.changeProfile(newProfileInfo).subscribe(() => {
      location.reload();
    });
  }

  changeAvatar() {
    this.changeAvatarModal.open();
  }
}
