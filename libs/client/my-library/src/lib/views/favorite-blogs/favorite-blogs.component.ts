import { Component, OnInit } from '@angular/core';
import { setThreePartTitle, Constants } from '@dragonfish/shared/constants';

@Component({
    selector: 'dragonfish-favorite-blogs',
    templateUrl: './favorite-blogs.component.html',
})
export class FavoriteBlogsComponent implements OnInit {
    ngOnInit(): void {
        setThreePartTitle(Constants.MY_LIBRARY, Constants.FAVORITE_BLOGS);
    }
}
