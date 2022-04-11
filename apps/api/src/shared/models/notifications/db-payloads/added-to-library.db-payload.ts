import { AddedToLibraryJob } from '$shared/models/notifications/jobs';

export interface AddedToLibraryDbPayload extends AddedToLibraryJob {
    value?: any; // temporary; added to ignore ESlint warnings
}
