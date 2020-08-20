import { Injectable, Provider } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NagBarService {

  private contentChangedSubject: Subject<[any, Provider|undefined]> = new Subject<[any, Provider|undefined]>();  
  private clearRequstedSubject: Subject<void> = new Subject<void>();

  constructor() { }

   /**
   * Queues a new piece of content to occupy the nav bar. If the nav bar is currently
   * empty, it will display immediately. Otherwise, it will have to wait
   * for its turn in the queue. Will open the nag bar if it is closed.
   * @param content The component to place in the nag bar.
   * @param injectable Can be anything marked with `@Injectable()`. Will be injected
   * into the `content` component.
   */
  queueContent(content: any, injectable?: Provider): void {
    this.contentChangedSubject.next([content, injectable]);
  }

  /**
   * Stream of changes to the nag bar's content.
   */
  onContentChanged(): Observable<[any, Provider]> {
    return this.contentChangedSubject.asObservable();
  }

  /**
   * Sends a request to clear the nag bar's current content.
   * If there is any content in the queue, it will take the current
   * content's place. Equivalent to closing the nag bar if there 
   * is no other content in the queue.
   */
  clearCurrentConent(): void {
    this.clearRequstedSubject.next();
  }

  /**
   * Stream of requests to clear the nag bar's current content.
   */
  onClearRequested(): Observable<void> {
    return this.clearRequstedSubject.asObservable();
  }
}
