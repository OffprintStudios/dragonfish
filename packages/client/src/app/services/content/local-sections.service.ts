import { Injectable } from '@angular/core';
import { SectionInfo } from '@pulp-fiction/models/works';

export enum SectionKind {
  Published,
  Unpublished
}

@Injectable({
  providedIn: 'root'
})
export class LocalSectionsService {
  
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

  /**
   * Set the publicly accessible info exposed by the LocalSectionsService.
   * @param publishedSections The array of sections to be exposed as "published".
   * @param authorId The author's ID
   * @param allSections (Optional) The array of sections to be exposed as "all".
   */
  public setInfo(publishedSections: SectionInfo[], authorId: string, allSections?: SectionInfo[]) {
    this._publishedSections = publishedSections;
    this._authorId = authorId;
    if (allSections) {
      this._allSections = allSections
    } else {
      this._allSections = publishedSections;
    }
  }

  /**
   * Adds a single section to the allSections array and, if a published section,
   * the publishedSections array.
   * @param newSection The section to add to the service.
   * @param kind Whether or not this section is published.
   */
  public addSection(newSection: SectionInfo, kind: SectionKind): void {
    if (kind === SectionKind.Published) {
      if (this.publishedSections.find(x => x._id === newSection._id) === undefined) {
        this.publishedSections.push(newSection);
      }
    }

    // Add to the "unpublished" collection for both published and all sections
    if (this.allSections.find(x => x._id === newSection._id) === undefined) {
      this.allSections.push(newSection);
    }
  }

}
