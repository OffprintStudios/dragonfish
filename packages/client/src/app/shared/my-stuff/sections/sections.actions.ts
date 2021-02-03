import { PublishSection, Section, SectionForm } from '@dragonfish/models/sections';

export namespace Sections {
    export class SetAll {
        static readonly type = '[MyStuff.Sections] Set All';
        constructor (public contentId: string) {}
    }

    export class SetCurrent {
        static readonly type = '[MyStuff.Sections] Set Current';
        constructor (public section: Section) {}
    }

    export class Create {
        static readonly type = '[MyStuff.Sections] Create';
        constructor (public contentId: string, public sectionInfo: SectionForm) {}
    }

    export class Save {
        static readonly type = '[MyStuff.Sections] Save';
        constructor (public contentId: string, public sectionId: string, public sectionInfo: SectionForm) {}
    }

    export class Publish {
        static readonly type = '[MyStuff.Sections] Publish';
        constructor (public contentId: string, public sectionId: string, public pubStatus: PublishSection) {}
    }

    export class Delete {
        static readonly type = '[MyStuff.Sections] Delete';
        constructor (public contentId: string, public sectionId: string) {}
    }
}