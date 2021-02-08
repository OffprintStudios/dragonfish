import { AdminServices } from './admin';
import { AuthServices } from './auth';
import { ContentServices } from './content';
import { ImagesServices } from './images';
import { SearchServices } from './search';

export const InterfaceProviders = [
    {
        provide: 'IApprovalQueue',
        useClass: AdminServices.find((x) => {
            return x.name === 'ApprovalQueueService';
        }),
    },
    {
        provide: 'IMeta',
        useClass: AdminServices.find((x) => {
            return x.name === 'MetaService';
        }),
    },
    {
        provide: 'IAuth',
        useClass: AuthServices.find((x) => {
            return x.name === 'AuthService';
        }),
    },
    {
        provide: 'IUser',
        useClass: AuthServices.find((x) => {
            return x.name === 'UserService';
        }),
    },
    {
        provide: 'IImages',
        useClass: ImagesServices.find((x) => {
            return x.name === 'ImagesService';
        }),
    },
    {
        provide: 'IContent',
        useClass: ContentServices.find((x) => {
            return x.name === 'ContentService';
        }),
    },
    {
        provide: 'ISections',
        useClass: ContentServices.find((x) => {
            return x.name === 'SectionsService';
        }),
    },
    {
        provide: 'ICollections',
        useClass: ContentServices.find((x) => {
            return x.name === 'CollectionsService';
        }),
    },
    {
        provide: 'IComments',
        useClass: ContentServices.find((x) => {
            return x.name === 'CommentsService';
        }),
    },
    {
        provide: 'ISearch',
        useClass: SearchServices.find((x) => {
            return x.name === 'SearchService';
        }),
    },
    {
        provide: 'IHistory',
        useClass: ContentServices.find((x) => {
            return x.name === 'HistoryService';
        }),
    },
];