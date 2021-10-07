import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { CommentsQuery } from './comments.query';

export const COMMENTS_PAGINATOR = new InjectionToken('COMMENTS_PAGINATOR', {
    providedIn: 'root',
    factory: () => {
        const commentsQuery = inject(CommentsQuery);
        return new PaginatorPlugin(commentsQuery).withControls().withRange();
    },
});
