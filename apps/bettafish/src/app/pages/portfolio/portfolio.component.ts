import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoverPicUploadComponent } from '../../components/user/settings/cover-pic-upload/cover-pic-upload.component';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SessionQuery } from '@dragonfish/client/repository/session';
import { PortfolioQuery } from '@dragonfish/client/repository/portfolio';

@UntilDestroy()
@Component({
    selector: 'dragonfish-portfolio',
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent {
    canSeeCoverButton = false;

    constructor(
        public route: ActivatedRoute,
        private dialog: MatDialog,
        public sessionQuery: SessionQuery,
        public portQuery: PortfolioQuery,
    ) {}

    openCoverPicUploader() {
        const dialogRef = this.dialog.open(CoverPicUploadComponent);
    }

    toggleCoverButton() {
        this.canSeeCoverButton = !this.canSeeCoverButton;
    }
}
