import { Injectable } from '@nestjs/common';
import {Work} from '../../db/works/models';
import {Blog} from '../../db/blogs/models';
import {WorksService} from '../../db/works/works.service';
import {BlogsService} from '../../db/blogs/blogs.service';

@Injectable()
export class SearchService {

    constructor(private readonly worksService: WorksService, private readonly blogsService: BlogsService) {
    }

}
