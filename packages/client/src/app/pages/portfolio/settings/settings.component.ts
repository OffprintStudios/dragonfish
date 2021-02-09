import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie';
import * as lodash from 'lodash';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, UserState } from '../../../shared/user';

import { UploadAvatarComponent } from '../../../components/modals/account';
import {
    ChangeEmail,
    ChangePassword,
    ChangeProfile,
    FrontendUser,
    Roles,
    UpdateTagline,
} from '@dragonfish/models/users';
import { ContentFilter } from '@dragonfish/models/works';

import { Constants, Title } from '@dragonfish/utilities/constants';
import { Global } from '../../../shared/global';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.less'],
})
export class SettingsComponent implements OnInit {
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;
    currentUserSubscription: Subscription;
    currentUser: FrontendUser;

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
        { name: 'dusk-autumn', displayName: 'Autumn at Dusk' },
    ];

    changeUsernameAndEmailForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
        currPassword: new FormControl('', [Validators.required]),
    });

    changePasswordForm = new FormGroup({
        newPassword: new FormControl('', Validators.required),
        confirmNewPassword: new FormControl('', Validators.required),
        currPassword: new FormControl('', Validators.required),
    });

    changeProfileForm = new FormGroup({
        newThemePref: new FormControl(this.themePrefOptions[0]),
        newBio: new FormControl('', [Validators.minLength(3), Validators.maxLength(160)]),
    });

    updateTagline = new FormGroup({
        newTagline: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]),
    });

    setContentFilter = new FormGroup({
        enableMature: new FormControl(false),
        enableExplicit: new FormControl(false),
    });

    constructor(
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private cookies: CookieService,
        private store: Store,
    ) {
        this.currentUserSubscription = this.currentUser$.subscribe((x) => {
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
                newBio: x.profile.bio,
            });

            this.updateTagline.setValue({
                newTagline: x.profile.tagline,
            });

            const contentFilterSetting: ContentFilter = this.cookies.get('contentFilter') as ContentFilter;
            if (contentFilterSetting !== null && contentFilterSetting !== undefined) {
                switch (contentFilterSetting) {
                    case ContentFilter.Default:
                        this.setContentFilter.setValue({
                            enableMature: false,
                            enableExplicit: false,
                        });
                        break;
                    case ContentFilter.Everything:
                        this.setContentFilter.setValue({
                            enableMature: true,
                            enableExplicit: true,
                        });
                        break;
                    case ContentFilter.MatureEnabled:
                        this.setContentFilter.setValue({
                            enableMature: true,
                            enableExplicit: false,
                        });
                        break;
                    case ContentFilter.ExplicitEnabled:
                        this.setContentFilter.setValue({
                            enableMature: false,
                            enableExplicit: true,
                        });
                        break;
                }
            } else {
                this.setContentFilter.setValue({
                    enableMature: false,
                    enableExplicit: false,
                });
            }

            this.currentUser = x;
        });
    }

    ngOnInit(): void {
        Title.setTwoPartTitle(Constants.SETTINGS);
    }

    get passwordFields() {
        return this.changePasswordForm.controls;
    }
    get changeProfileFields() {
        return this.changeProfileForm.controls;
    }
    get updateTaglineFields() {
        return this.updateTagline.controls;
    }
    get setFilterFields() {
        return this.setContentFilter.controls;
    }

    changeEmail(newEmail: string, password: string) {
        const changeRequest: ChangeEmail = {
            currentPassword: password,
            newEmail: newEmail,
        };

        return this.store.dispatch(new User.ChangeEmail(changeRequest)).pipe(
            map((x) => {
                if (x) {
                    this.snackbar.open(`Email successfully changed!`);
                    return x.email;
                } else {
                    return null;
                }
            }),
            catchError((_) => {
                return of(null);
            }),
        );
    }

    submitChangePasswordForm() {
        if (this.passwordFields.newPassword.invalid || this.passwordFields.confirmNewPassword.invalid) {
            this.snackbar.open(`Password fields cannot be empty.`);
            return;
        }

        if (this.passwordFields.newPassword.value !== this.passwordFields.confirmNewPassword.value) {
            this.snackbar.open("Your new password doesn't match.");
            return;
        }

        const newPasswordInfo: ChangePassword = {
            currentPassword: this.passwordFields.currPassword.value,
            newPassword: this.passwordFields.newPassword.value,
        };

        this.store.dispatch(new User.ChangePassword(newPasswordInfo)).subscribe();
    }

    submitProfileForm() {
        if (this.changeProfileFields.newBio.invalid) {
            this.snackbar.open(`Bios must be between 3 and 50 characters.`);
            return;
        }

        const newProfileInfo: ChangeProfile = {
            themePref: this.changeProfileFields.newThemePref.value.name,
            bio: this.changeProfileFields.newBio.value,
        };

        this.store.dispatch(new User.ChangeProfile(newProfileInfo)).subscribe();
    }

    changeAvatar() {
        this.dialog.open(UploadAvatarComponent);
    }

    includesRoles(roles: Roles[]) {
        const hasRoles = lodash.intersection([Roles.Admin, Roles.Moderator, Roles.ChatModerator], roles);

        if (hasRoles.length === 0) {
            return false;
        } else {
            return true;
        }
    }

    submitTagline() {
        if (this.updateTaglineFields.newTagline.invalid) {
            this.snackbar.open('Taglines must be between 3 and 32 characters long.');
            return;
        }

        const taglineInfo: UpdateTagline = {
            newTagline: this.updateTaglineFields.newTagline.value,
        };

        this.store.dispatch(new User.UpdateTagline(taglineInfo)).subscribe();
    }

    submitContentFilter() {
        this.store
            .dispatch(
                new Global.SetContentFilter(
                    this.setFilterFields.enableMature.value,
                    this.setFilterFields.enableExplicit.value,
                ),
            )
            .subscribe(() => {
                location.reload();
            });
    }
}
