import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

export interface PageMetadata {
    url: string;
    image: string;
    title: string;
    description: string;
    type: string;
    siteName: string;
}

export interface ContentPageMetadata extends PageMetadata {
    author: string;
}

@Injectable({
    providedIn: 'root',
})
export class MetadataService {
    constructor(private meta: Meta) {}

    public initTags(): void {
        this.meta.addTags([
            { property: 'og:url', content: 'https://offprint.net' },
            { property: 'og:image', content: 'https://images.offprint.net/offprint_icon.png' },
            { property: 'og:title', content: 'Home' },
            { property: 'og:description', content: 'For The Stories Waiting To Be Told' },
            { property: 'og:type', content: 'website' },
            { property: 'og:site_name', content: 'Offprint' },
        ]);
    }
}
