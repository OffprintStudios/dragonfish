import { Component, OnInit, Input } from '@angular/core';
import { FrontendUser } from '@pulp-fiction/models/users';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent implements OnInit {
  @Input() itemId: string;
  @Input() itemKind: string;
  @Input() pageNum: number;

  currentUser: FrontendUser;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

}
