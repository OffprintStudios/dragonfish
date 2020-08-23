import { Injectable } from '@angular/core';
import { SectionInfo } from '@pulp-fiction/models/works';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {
  
  private _publishedSections: SectionInfo[];
  /**
   * The list of sections for the current work.
   */
  get publishedSections(): SectionInfo[] {
    return this._publishedSections;
  }

  private _allSections: SectionInfo[];
  get allSections(): SectionInfo[] {
    return this._allSections;
  }
  
  private _authorId: string;
  /**
   * The ID of the author of the current work.
   */
  get authorId(): string {
    return this._authorId;
  }  

  constructor() { }

  public setInfo(publishedSections: SectionInfo[], authorId: string, allSections?: SectionInfo[]) {
    this._publishedSections = publishedSections;
    this._authorId = authorId;
    if (allSections) {
      this._allSections = allSections
    } else {
      this._allSections = publishedSections;
    }
  }
}
