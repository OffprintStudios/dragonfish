export interface ProfileForm {
    readonly username: string;
    readonly bio?: string;
    readonly tagline?: string;
    readonly links: string[];
}