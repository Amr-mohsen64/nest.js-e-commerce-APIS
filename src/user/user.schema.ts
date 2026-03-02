import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    type: String,
    max: [50, 'Name must be less than 50 characters'],
    min: [2, 'Name must be at least 2 characters'],
  })
  name: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  })
  email: string;

  @Prop({
    required: true,
    type: String,
    min: [6, 'Password must be at least 6 characters'],
    max: [20, 'Password must be less than 20 characters'],
  })
  password: string;

  @Prop({
    required: true,
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: string;

  @Prop({
    type: String,
  })
  avatar: string;

  @Prop({
    type: Number,
    min: [0, 'Age must be at least 0'],
    max: [120, 'Age must be less than 120'],
  })
  age: number;

  @Prop({
    type: String,
  })
  phoneNumber: string;

  @Prop({
    type: String,
  })
  address: string;

  @Prop({
    type: Boolean,
    enum: [true, false],
  })
  active: boolean;

  @Prop({
    type: String,
  })
  validationCode: string;

  @Prop({
    type: Date,
    enum: ['male', 'female'],
  })
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
