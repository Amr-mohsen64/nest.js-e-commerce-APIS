import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private validateObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid user id', 400);
    }
  }

  async create(createUserDto: CreateUserDto) {
    const emailExists = await this.userModel.exists({
      email: createUserDto.email,
    });

    if (emailExists) {
      throw new HttpException('Email already exists', 400);
    }

    const passwordHash = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    const userData = {
      ...createUserDto,
      password: passwordHash,
      role: createUserDto.role || 'user',
      active: true,
    };

    return {
      status: 201,
      message: 'User created successfully',
      data: await this.userModel.create(userData),
    };
  }

  findAll() {
    return this.userModel.find().select('-password -__v');
  }

  async findOne(id: string) {
    this.validateObjectId(id);
    const user = await this.userModel.findById(id).select('-password -__v');
    if (!user) throw new HttpException('User not found', 404);
    return {
      status: 200,
      data: user,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ status: number; data: any; message: string }> {
    this.validateObjectId(id);
    const user = await this.userModel.findById(id);
    if (!user) throw new HttpException('User not found', 404);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds,
      );
    }

    return {
      status: 200,
      data: await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .select('-password -__v'),
      message: 'User updated successfully',
    };
  }

  async remove(id: string): Promise<{ status: number; message: string }> {
    this.validateObjectId(id);
    const user = await this.userModel.findById(id);
    if (!user) throw new HttpException('User not found', 404);
    await this.userModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'User deleted successfully',
    };
  }
}
