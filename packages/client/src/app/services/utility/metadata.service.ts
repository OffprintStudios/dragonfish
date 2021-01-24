import { Injectable } from '@angular/core';

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
    providedIn: 'root'
})
export class MetadataService {
    
}