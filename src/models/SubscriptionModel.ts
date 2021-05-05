import { Document, Model, Schema, model } from 'mongoose';

interface ISubscription {
  userId: string;
  endpoint: string;
  expirationTime?: number;
  keys: {
    auth: string;
    p256dh: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionDocument extends ISubscription, Document { }

export type SubscriptionModel = Model<ISubscriptionDocument>;

const SubscriptionSchema = new Schema<ISubscriptionDocument, SubscriptionModel>({
  userId: { type: String, required: true },
  endpoint: { type: String, required: true },
  expirationTime: { type: Number, required: false },
  keys: {
    auth: { type: String, required: true },
    p256dh: { type: String, required: true },
  }
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
});

export default model<ISubscriptionDocument, SubscriptionModel>('Subscription', SubscriptionSchema, 'subscriptions');
