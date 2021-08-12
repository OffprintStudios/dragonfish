import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AccountForm, LoginModel } from '@dragonfish/shared/models/accounts';
import { AuthService } from '@dragonfish/client/repository/session/services';
import { from, of } from 'rxjs';
import { delay, concatMap, takeLast } from 'rxjs/operators';
import { fadeInOut } from '@dragonfish/client/ui';

enum RegistrationTabs {
    LogIn,
    Register,
}

@Component({
    selector: 'dragonfish-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
    animations: [fadeInOut],
})
export class RegistrationComponent {
    registrationTabs = RegistrationTabs;
    selectedTab = RegistrationTabs.LogIn;
    seeLoadingPage = false;
    loading = false;
    announceText = `Please wait...`;
    hasRegistered = false;
    delayRouting = from([1, 2, 3]).pipe(
        concatMap((item) => of(item).pipe(delay(1200))),
        takeLast(1),
    );

    constructor(
        private router: Router,
        private location: Location,
        public route: ActivatedRoute,
        private auth: AuthService,
    ) {}

    switchTab(newTab: RegistrationTabs) {
        this.selectedTab = newTab;
    }

    isLoggingIn(event: LoginModel) {
        this.seeLoadingPage = true;
        this.loading = true;
        this.announceText = `Logging you in...`;
        this.auth
            .login(event)
            .pipe(delay(1500))
            .subscribe(
                () => {
                    this.loading = false;
                    this.announceText = `Welcome back!`;
                    this.delayRouting.subscribe(() => {
                        this.seeLoadingPage = false;
                        this.router
                            .navigate(['select-pseud'], { relativeTo: this.route })
                            .catch((err) => console.log(err));
                    });
                },
                () => {
                    this.loading = false;
                    this.seeLoadingPage = false;
                },
            );
    }

    isRegistering(event: AccountForm) {
        this.seeLoadingPage = true;
        this.loading = true;
        this.announceText = `Signing you up...`;
        this.auth
            .register(event)
            .pipe(delay(1500))
            .subscribe(
                () => {
                    this.loading = false;
                    this.hasRegistered = true;
                    this.announceText = `Welcome aboard!`;
                    this.delayRouting.subscribe(() => {
                        this.router
                            .navigate(['select-pseud'], { relativeTo: this.route })
                            .catch((err) => console.log(err));
                    });
                },
                () => {
                    this.loading = false;
                    this.seeLoadingPage = false;
                },
            );
    }

    goBack() {
        this.location.back();
    }
}
