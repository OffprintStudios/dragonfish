import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoverPicUploadComponent } from '../../components/user/settings/cover-pic-upload/cover-pic-upload.component';
import { FrontendUser } from '@dragonfish/shared/models/users';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PortfolioState } from '@dragonfish/client/repository/portfolio';
import { Select } from '@ngxs/store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SessionQuery } from '@dragonfish/client/repository/session';

@UntilDestroy()
@Component({
    selector: 'dragonfish-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent {
    @Select(PortfolioState.currPortfolio) portUser$: Observable<FrontendUser>;
    canSeeCoverButton = false;

    constructor(public route: ActivatedRoute, private dialog: MatDialog, public sessionQuery: SessionQuery) {}

    openCoverPicUploader() {
        const dialogRef = this.dialog.open(CoverPicUploadComponent);
    }

    toggleCoverButton() {
        this.canSeeCoverButton = !this.canSeeCoverButton;
    }
}
