import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import * as models from 'src/app/models/works';
import { AlertsService } from 'src/app/modules/alerts';

@Injectable({
  providedIn: 'root'
})
export class WorksService {
  constructor(private http: HttpClient, private alertsService: AlertsService, private router: Router) { }

  public createWork(info: models.CreateWork) {

  }

  public fetchUserWorks() {

  }

  public deleteWork(workId: string) {

  }

  public submitForPublishing() {

  }

  public editWork(workInfo: models.EditWork) {

  }
}
