import type { CreateProse } from './create-prose';
import type { CreatePoetry } from './create-poetry';
import type { BlogForm } from './blog-form';

export type { CreateProse } from './create-prose';
export type { CreatePoetry } from './create-poetry';
export type { BlogForm } from './blog-form';
export type { TagsForm } from './tags-form.model';

export type FormType = CreateProse | CreatePoetry | BlogForm;
