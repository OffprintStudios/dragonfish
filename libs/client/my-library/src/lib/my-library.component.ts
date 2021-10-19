import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DragonfishNetworkService } from '@dragonfish/client/services';
import { ContentLibrary } from '@dragonfish/shared/models/users/content-library';
import { PseudonymsQuery } from '@dragonfish/client/repository/pseudonyms';

@Component({
    selector: 'dragonfish-my-library',
    templateUrl: './my-library.component.html',
    styleUrls: ['./my-library.component.scss'],
})
export class MyLibraryComponent implements OnInit {
    libraryItems: ContentLibrary[] = [];
    loading = false;

    constructor(
        public route: ActivatedRoute,
        private pseudQuery: PseudonymsQuery,
        private network: DragonfishNetworkService,
    ) {}

    ngOnInit() {
        this.fetchData();
    }

    private fetchData() {
        this.loading = true;
        this.network.fetchLibrary(this.pseudQuery.currentId).subscribe((x) => {
            this.libraryItems = x;
            this.loading = false;
        });
    }
}
