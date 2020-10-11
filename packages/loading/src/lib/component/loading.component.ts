import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LoadingService } from '../service/loading.service';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less']
})
export class LoadingComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  loadingSubscription: Subscription;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.loadingService.loadingStatus.pipe(debounceTime(200))
      .subscribe(val => {
        this.loading = val;
      });
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }
}
