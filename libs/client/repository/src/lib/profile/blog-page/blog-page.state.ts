import { BlogsContentModel } from '@dragonfish/shared/models/content';

export interface BlogPageState {
    blog: BlogsContentModel;
}

export function createInitialState(): BlogPageState {
    return {
        blog: null,
    };
}
