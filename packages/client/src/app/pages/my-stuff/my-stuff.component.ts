import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MyStuffState } from '../../shared/my-stuff';
import { Constants, Title } from '../../shared';

import { ContentModel, ContentKind, PubStatus } from '@pulp-fiction/models/content';

@Component({
    selector: 'my-stuff',
    templateUrl: './my-stuff.component.html',
    styleUrls: ['./my-stuff.component.less']
})
export class MyStuffComponent implements OnInit {
    @Select(MyStuffState.myStuff) myStuff$: Observable<ContentModel[]>;
    @Select(MyStuffState.currContent) currContent$: Observable<ContentModel>;
  
    contentKind = ContentKind;
    pubStatus = PubStatus;
  
    isIconView = true;
  
    searchStuff = new FormGroup({
      query: new FormControl('')
    });

    constructor (public route: ActivatedRoute, private clipboard: Clipboard) {}

    ngOnInit(): void {
        Title.setTwoPartTitle(Constants.MY_STUFF);
    }

    
}