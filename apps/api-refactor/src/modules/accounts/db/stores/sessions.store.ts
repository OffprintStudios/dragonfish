import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionDocument } from '$modules/accounts/db/schemas';
import { DeviceInfo } from '$shared/models/accounts';
import { AccessPayload } from '$shared/auth';

@Injectable()
export class SessionsStore {
  constructor(
    @InjectModel('Session') private readonly sessions: Model<SessionDocument>,
  ) {}

  public async createSession(
    accountId: string,
    deviceInfo: DeviceInfo,
    expires: Date,
  ) {
    const newSession = new this.sessions({
      accountId,
      deviceBrowser: deviceInfo.browser,
      deviceOS: deviceInfo.os,
      ipAddr: deviceInfo.ipAddr,
      expires,
    });

    return await newSession.save().then((doc) => {
      return doc._id;
    });
  }

  public async findSession(payload: AccessPayload) {
    return this.sessions.find({
      _id: payload.sessionId,
      accountId: payload.accountId,
    });
  }

  public async deleteSession(payload: AccessPayload) {
    return this.sessions.deleteOne({
      _id: payload.sessionId,
      accountId: payload.accountId,
    });
  }
}
