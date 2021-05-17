import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ItemKind } from '@dragonfish/shared/models/comments';
import { PaginateResult } from '@dragonfish/shared/models/util';
import { Comment, CreateComment } from '@dragonfish/shared/models/comments';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { AlertsService } from '@dragonfish/client/alerts';
import { ContentKind } from '@dragonfish/shared/models/content';
import { SessionQuery } from '@dragonfish/client/repository/session';

@Component({
    selector: 'dragonfish-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
    @Input() itemId: string; // The ID of the content
    @Input() itemKind: ItemKind; // The kind of comments thread it is, between all content
    @Input() pageNum: number; // The requested page number
    @Input() banList?: any; // The banList of the thread
    @Output() emitPageChange = new EventEmitter<number>(); // Emits the current page number

    @ViewChild('newCommentSection') newCommentSection: ElementRef;

    loading = false;
    comments: PaginateResult<Comment>;

    newCommentForm = new FormGroup({
        body: new FormControl('', [Validators.required, Validators.minLength(10)]),
    });

    constructor(
        private networkService: DragonfishNetworkService,
        private alerts: AlertsService,
        public sessionQuery: SessionQuery,
    ) {}

    ngOnInit(): void {
        this.fetchData(this.pageNum);
    }

    /**
     * Getter for the new comment form
     */
    get newCommentFields() {
        return this.newCommentForm.controls;
    }

    /**
     * Fetches the requested page of comments.
     *
     * @param pageNum The page desired
     */
    fetchData(pageNum: number) {
        this.loading = true;
        this.networkService.fetchContentComments(this.itemId, pageNum).subscribe((comments) => {
            this.comments = comments;
            this.pageNum = pageNum;
            this.emitPageChange.emit(pageNum);
            this.loading = false;
        });
    }

    /**
     * Scrolls to the new comment form
     */
    scrollToNewCommentForm() {
        this.newCommentSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Refreshes the thread with the current page.
     */
    refreshThread() {
        this.fetchData(this.pageNum);
    }

    /**
     * Creates a new comment
     */
    submitNewComment() {
        if (this.newCommentFields.body.invalid) {
            this.alerts.info('Comments must be at least 10 characters long.');
            return;
        }

        const contentKind: ContentKind =
            this.itemKind === ItemKind.Blog
                ? ContentKind.BlogContent
                : this.itemKind === ItemKind.BlogContent
                ? ContentKind.BlogContent
                : this.itemKind === ItemKind.ProseContent
                    ? ContentKind.ProseContent
                    : this.itemKind === ItemKind.PoetryContent
                        ? ContentKind.PoetryContent
                        : this.itemKind === ItemKind.NewsContent
                            ? ContentKind.NewsContent
                            : ContentKind.ProseContent;

        const comm: CreateComment = {
            body: this.newCommentFields.body.value,
            commentParentKind: contentKind,
        };

        this.networkService.addContentComment(this.itemId, comm).subscribe(() => {
            this.fetchData(this.pageNum);
            this.newCommentForm.reset();
        });
    }
}
