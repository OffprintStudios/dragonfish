import { Pipe, PipeTransform } from '@angular/core';
import { Section } from '@dragonfish/shared/models/sections';

/**
 * When author views their own published story, provides published chapters with correct indices
 */
@Pipe({ name: 'sectionIndex' })
export class SectionIndexPipe implements PipeTransform {
    transform(sections: Section[]) {
        let publishedIndex = 0;
        const indexedSections = [];
        for (const section of sections) {
            indexedSections.push(
                {
                    index: publishedIndex,
                    section: section,
                }
            );
            if (section.published) {
                publishedIndex++;
            }
        }
        return indexedSections;
    }
}
