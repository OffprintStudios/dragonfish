import { Pipe, PipeTransform } from '@angular/core';
import { Genres, TagsModel } from '@dragonfish/shared/models/content';

@Pipe({ name: 'displayTags' })
export class DisplayTagsPipe implements PipeTransform {
    transform(tags: TagsModel | TagsModel[]) {
        if (!Array.isArray(tags)) {
            return this.formatTagName(tags);
        }
        if (tags.length === 1) {
            return this.formatTagName(tags[0]);
        } else {
            const theseTags: string[] = [];
            tags.forEach((tag) => {
                theseTags.push(this.formatTagName(tag));
            });
            return theseTags.join(', ');
        }
    }

    private formatTagName(tag: TagsModel): string {
        if (tag.parent) {
            return (tag.parent as TagsModel).name + " — " + tag.name;
        }
        else {
            return tag.name;
        }
    }
}
