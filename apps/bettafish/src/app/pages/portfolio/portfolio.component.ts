import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { Select } from '@ngxs/store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { UserState } from '../../repo/user';
import { PortfolioState } from '../../repo/portfolio';
import { MatDialog } from '@angular/material/dialog';
import { CoverPicUploadComponent } from '../../components/user/settings/cover-pic-upload/cover-pic-upload.component';

@UntilDestroy()
@Component({
    selector: 'dragonfish-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
    @Select(PortfolioState.currPortfolio) portUser$: Observable<FrontendUser>;
    @Select(UserState.currUser) currentUser$: Observable<FrontendUser>;

    constructor(public route: ActivatedRoute, private dialog: MatDialog) {}

    ngOnInit(): void {}

    openCoverPicUploader() {
        const dialogRef = this.dialog.open(CoverPicUploadComponent);
    }
}
