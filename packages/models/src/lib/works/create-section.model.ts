export interface CreateSection {
    readonly title: string;
    readonly body: string;
    readonly authorsNote?: string;
    
     // Remove this once we've migrated all sections from Quill
    readonly usesFroala: boolean;
}
