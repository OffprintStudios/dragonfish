import { Component, OnInit, Injector, ReflectiveInjector, Provider, OnDestroy } from '@angular/core';
import { NagBarService } from './nag-bar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nag-bar',
  templateUrl: './nag-bar.component.html',
  styleUrls: ['./nag-bar.component.less']
})
export class NagBarComponent implements OnInit, OnDestroy {
  // This should be a component. It will be inserted into the nag bar's
  // ng-container as an ngComponentOutlet.
  content?: any;
  contentInjector?: Injector;
  shown: boolean = false;
  contentChangedSubscription: Subscription;
  visibilityChangedSubscription: Subscription;
  clearRequestedSubscription: Subscription;

  // Queue of all content requests.
  private contentQueue: [any, Provider|undefined][] = [];

  constructor(private injector: Injector,
    private nagBarService: NagBarService) { }

  ngOnInit(): void {
    this.contentChangedSubscription = this.nagBarService.onContentChanged()
      .subscribe(x => this.onContentChanged(x));

      this.clearRequestedSubscription = this.nagBarService.onClearRequested()
        .subscribe(() => this.onClearRequested());
  }

  ngOnDestroy() {
    this.contentChangedSubscription.unsubscribe();
    this.clearRequestedSubscription.unsubscribe();
  }

  onContentChanged(newContent: [any, Provider|undefined]) {
    this.contentQueue.push(newContent);
    if (!this.content) {
      // If there is no current content, use the new content immediately.      
      const content = this.contentQueue.shift();
      this.content = content[0];
      if (content[1]) {
        this.contentInjector = ReflectiveInjector.resolveAndCreate([content[1]], this.injector);
      }
      this.shown = true;
    }
  }

  onClearRequested(): void {
    this.content = null;
    this.contentInjector = null;
    if (this.contentQueue.length > 0) {
      // Show the next value in the content queue
      const content = this.contentQueue.shift();
      this.content = content[0];
      this.contentInjector = ReflectiveInjector.resolveAndCreate([content[1]], this.injector);
      this.shown = true;
    } else {
      // No more content, close the bar.
      this.shown = false;
    }
  }

}
