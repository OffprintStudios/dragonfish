import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { PseudonymDocument } from '../schemas';
import { Presence, PseudonymForm } from '$shared/models/accounts';
import { chain } from 'voca';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PseudonymsStore {
  constructor(
    @InjectModel('Pseudonym')
    private readonly pseudModel: PaginateModel<PseudonymDocument>,
  ) {}

  //#region ---FETCH PSEUDONYMS---

  /**
   * Fetches a pseudonym via its ID.
   * @param id
   */
  public async fetchPseud(id: string): Promise<PseudonymDocument> {
    return this.retrievePseud(id);
  }

  public async fetchAllPseuds(accountId: string): Promise<PseudonymDocument[]> {
    return this.pseudModel.find({ accountId });
  }

  /**
   * Finds any related users given the provided search parameters.
   * Looks at both screen name and user tag.
   * If the query starts with @, then it only searches user tag.
   *
   * @param query The relevant search parameters
   * @param pageNum The page of results to retrieve
   * @param maxPerPage The maximum number of results per page
   */
  async findRelatedUsers(
    query: string,
    pageNum: number,
    maxPerPage: number,
  ): Promise<PaginateResult<PseudonymDocument>> {
    if (!query) {
      return await this.pseudModel.paginate(
        {},
        {
          sort: { screenName: 1 },
          page: pageNum,
          limit: maxPerPage,
        },
      );
    }
    if (query.charAt(0) === '@') {
      return await this.pseudModel.paginate(
        { userTag: query.substr(1) },
        {
          page: pageNum,
          limit: maxPerPage,
        },
      );
    }
    return await this.pseudModel.paginate(
      { $or: [{ $text: { $search: '"' + query + '"' } }, { userTag: query }] },
      {
        sort: { screenName: 1 },
        page: pageNum,
        limit: maxPerPage,
      },
    );
  }

  //#endregion

  //#region ---CRUD OPERATIONS---

  public async createPseud(accountId: string, formInfo: PseudonymForm): Promise<PseudonymDocument> {
    const newPseud = new this.pseudModel({
      accountId: accountId,
      userTag: chain(formInfo.userTag).latinise().replace(' ', '').value(),
      screenName: formInfo.screenName,
      'profile.pronouns': formInfo.pronouns,
    });

    return await newPseud.save();
  }

  public async updatePseud(pseudId: string, formInfo: PseudonymForm): Promise<PseudonymDocument> {
    const pseud = await this.retrievePseud(pseudId);
    pseud.userTag = chain(formInfo.userTag).latinise().replace(' ', '').value();
    pseud.screenName = formInfo.screenName;
    pseud.profile.bio = formInfo.bio ?? null;
    pseud.profile.tagline = formInfo.tagline ?? null;
    pseud.profile.pronouns = formInfo.pronouns;
    pseud.presence = formInfo.presence ?? Presence.Offline;
    return await pseud.save();
  }

  public async updateAvatar(pseudId: string, avatarUrl: string): Promise<PseudonymDocument> {
    const pseud = await this.retrievePseud(pseudId);
    pseud.profile.avatar = avatarUrl;
    return await pseud.save();
  }

  public async updateCover(pseudId: string, coverUrl: string): Promise<PseudonymDocument> {
    const pseud = await this.retrievePseud(pseudId);
    pseud.profile.coverPic = coverUrl;
    return await pseud.save();
  }

  public async updateWorkCount(pseudId: string, numWorks: number) {
    const pseud = await this.retrievePseud(pseudId);
    pseud.stats.works = numWorks;
    return await pseud.save();
  }

  public async updateBlogCount(pseudId: string, numBlogs: number) {
    const pseud = await this.retrievePseud(pseudId);
    pseud.stats.blogs = numBlogs;
    return await pseud.save();
  }

  //#endregion

  //#region ---PRIVATE---

  @OnEvent('pseudonyms.update-follower-count', { async: true })
  private async updateFollowerCount(payload: { pseudId: string; numFollowers: number }) {
    const pseud = await this.retrievePseud(payload.pseudId);
    pseud.stats.followers = payload.numFollowers;
    await pseud.save();
  }

  @OnEvent('pseudonyms.update-following-count', { async: true })
  private async updateFollowingCount(payload: { pseudId: string; numFollowing: number }) {
    const pseud = await this.retrievePseud(payload.pseudId);
    pseud.stats.following = payload.numFollowing;
    await pseud.save();
  }

  private async retrievePseud(id: string): Promise<PseudonymDocument> {
    const pseud = await this.pseudModel.findById(id);

    if (pseud === null || pseud === undefined) {
      throw new NotFoundException(`This user doesn't seem to exist.`);
    }

    return pseud;
  }

  //#endregion
}
