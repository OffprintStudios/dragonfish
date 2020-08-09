import { Component, OnInit, Input } from '@angular/core';
import { Categories, GenresPoetry, GenresFiction, Fandoms, WorkStatus, ContentRating } from 'src/app/models/works';

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
  @Input() coverImageUrl?: string;
  @Input() categories: Categories;
  @Input() genres: GenresFiction[] | GenresPoetry[];
  @Input() fandoms?: Fandoms[];
  @Input() shortDesc: string;
  @Input() creationDate: Date;
  @Input() views: number;
  @Input() likes: number;
  @Input() dislikes: number;
  @Input() status: WorkStatus;
  @Input() rating: ContentRating;
  
  constructor() { }

  ngOnInit(): void {
    console.log("Initted.");
  }

}
