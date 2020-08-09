import { Component, OnInit, Input } from '@angular/core';
import { Categories, GenresPoetry, GenresFiction, Fandoms, WorkStatus, ContentRating, WorkMetadata } from 'src/app/models/works';

@Component({
  selector: 'app-short-work-card',
  templateUrl: './short-work-card.component.html',
  styleUrls: ['./short-work-card.component.less']
})
export class ShortWorkCardComponent implements OnInit { 
  @Input() id: string;
  @Input() authorId: string;
  @Input() title: string;
  @Input() author: string;
  @Input() authorAvatarUrl: string;
  @Input() meta: any;
  @Input() shortDesc: string;
  @Input() creationDate: Date;
  @Input() views: number;
  @Input() likes: number;
  @Input() dislikes: number;  
  @Input() words: number;
  
  constructor() { }

  ngOnInit(): void {    
  }

}
