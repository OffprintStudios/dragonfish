import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from 'src/app/models/users';
import * as workModels from 'src/app/models/works';
import { AuthService } from 'src/app/services/auth';
import { WorksService } from 'src/app/services/content';
import { SlugifyPipe } from 'src/app/pipes';

@Component({
  selector: 'app-section-page',
  templateUrl: './section-page.component.html',
  styleUrls: ['./section-page.component.less']
})
export class SectionPageComponent implements OnInit {
  currentUser: User;

  sectionsList: workModels.SectionInfo[];
  sectionData: workModels.Section;
  loading = false; // controls the spinner above section selection boxes
  sectionSwitching: boolean = false; // controls the spinner between the section selection boxes
  hideContents: boolean = false;
  indexNext = 0;
  indexPrev = 0;
  currSection: workModels.SectionInfo = null;
  
  workId: string;
  workTitle: string;
  sectionNum: number;

  constructor(private authService: AuthService, private worksService: WorksService,
    private router: Router, private route: ActivatedRoute, private slugify: SlugifyPipe) {
      this.authService.currUser.subscribe(x => { this.currentUser = x; });
      this.sectionsList = this.worksService.thisWorksPublishedSections;
      this.fetchData();
  }

  ngOnInit(): void {
  }

  /**
   * Fetches the section from the backend.
   */
  private fetchData() {
    this.loading = true;
    this.route.parent.paramMap.subscribe(params => {
      this.workId = params.get('workId');
      this.workTitle = params.get('title');
      this.route.paramMap.subscribe(routeParams => {    
        this.sectionSwitching = true;
        this.sectionNum = +routeParams.get('sectionNum');
        this.indexNext = this.sectionNum + 1;
        this.indexPrev = this.sectionNum - 1;
        this.currSection = this.sectionsList[this.sectionNum - 1];
        this.worksService.getPublishedSection(this.workId, this.sectionsList[this.sectionNum - 1]._id).subscribe(section => {          
          this.sectionData = section;
          this.loading = false;
          this.sectionSwitching = false;
        });
      });
    });
  }

  /**
   * Compares sections to see which one the currently selected one is.
   * 
   * @param secOne The first to compare
   * @param secTwo The second to compare
   */
  compareSections(secOne: workModels.SectionInfo, secTwo: workModels.SectionInfo) {
    if (secOne._id === secTwo._id) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Navigates to the next page specified by the option box.
   * 
   * @param event The section changed to
   */
  onSelectChange(event: workModels.SectionInfo) {
    const thisSectionIndex = this.sectionsList.indexOf(event);
    this.router.navigate([`/work/${this.workId}/${this.workTitle}/${thisSectionIndex + 1}/${this.slugify.transform(event.title)}`])
  }
}
