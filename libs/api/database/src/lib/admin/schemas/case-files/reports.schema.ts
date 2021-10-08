import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Report, ReportReason } from '@dragonfish/shared/models/case-files';
import { nanoid } from 'nanoid';

@Schema({ timestamps: true, autoIndex: true })
export class ReportDocument extends Types.Subdocument implements Report {
    @Prop({ default: () => nanoid() })
    readonly _id: string;

    @Prop({ type: String, ref: 'Account', required: true })
    readonly user: string;

    @Prop({ type: [String], enum: Object.keys(ReportReason), required: true })
    reasons: ReportReason[];

    @Prop({ trim: true, required: true })
    body: string;

    @Prop()
    readonly createdAt: Date;

    @Prop()
    readonly updatedAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(ReportDocument);
