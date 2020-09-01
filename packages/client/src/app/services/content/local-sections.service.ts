import { Injectable } from '@angular/core';
import { SectionInfo } from '@pulp-fiction/models/works';
import { remove } from 'lodash';
import { SectionInfoViewModel } from '../../pages/work-page/viewmodels/section-info.viewmodel';

export enum SectionKind {
  Published,
  Unpublished
}

@Injectable({
  providedIn: 'root'
})
/**
 * A service that manages the local display of sections. Does not communicate
 * with the backend, or accurately reflect the state of sections as they are
 * stored in the database. Should only be used to update state of sections when
 * confirmation has been received from the backend.
 */
export class LocalSectionsService {
  
  private _publishedSections: SectionInfoViewModel[];
  /**
   * The list of sections for the current work.
   */
  get publishedSections(): ReadonlyArray<SectionInfoViewModel> {
    return this._publishedSections;
  }

  private _allSections: SectionInfoViewModel[];
  get allSections(): ReadonlyArray<SectionInfoViewModel> {
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
    this._publishedSections = publishedSections.map(x => new SectionInfoViewModel(x));
    this._authorId = authorId;
    if (allSections) {
      this._allSections = allSections.map(x => new SectionInfoViewModel(x));
    } else {
      this._allSections = publishedSections.map(x => new SectionInfoViewModel(x));
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
        this._publishedSections.push(new SectionInfoViewModel(newSection));
      }
    }

    // Add to the "unpublished" collection for both published and all sections
    if (this.allSections.find(x => x._id === newSection._id) === undefined) {
      this._allSections.push(new SectionInfoViewModel(newSection));
    }
  }

  /**
   * Removes the section with the given ID. If removing from publishedSections, will
   * not remove from the array of allSections.
   * @param sectionId The ID of the section to remove.
   * @param kind If Published, will only remove the section from the publishedSections array.
   * If Unpublished, will _also_ remove the section from the allSections array.
   */
  public removeSection(sectionId: string, kind: SectionKind): void {
    if (kind === SectionKind.Unpublished) {
      remove(this._allSections, x => x._id === sectionId);
    }

    remove(this._publishedSections, x => x._id === sectionId);
  }
}
