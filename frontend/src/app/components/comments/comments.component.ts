import { Component, OnInit, Input } from '@angular/core';
import { User } from 'shared-models';
import { AuthService } from 'src/app/services/auth';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent implements OnInit {
  @Input() itemId: string;
  @Input() itemKind: string;
  @Input() pageNum: number;

  currentUser: User;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

}
