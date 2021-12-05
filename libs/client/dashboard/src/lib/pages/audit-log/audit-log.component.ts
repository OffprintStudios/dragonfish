import { Component, OnInit } from '@angular/core';
import { setThreePartTitle, Constants } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-audit-log',
    templateUrl: './audit-log.component.html',
    styleUrls: ['./audit-log.component.scss'],
})
export class AuditLogComponent implements OnInit {
    ngOnInit(): void {
        setThreePartTitle(Constants.DASHBOARD, Constants.AUDIT_LOG);
    }
}
