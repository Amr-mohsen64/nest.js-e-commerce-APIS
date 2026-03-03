import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserQuery } from './models/user-query.model';

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

  async findAll(query: UserQuery) {
    const { name, email, role, limit = 10, page = 1, sort = 'asc' } = query;
    console.log(page, 'page', limit, 'limit', sort, 'sort');

    if (Number.isNaN(Number(+limit))) {
      throw new HttpException('Limit must be a number', 400);
    }
    if (Number.isNaN(Number(+page))) {
      throw new HttpException('Page must be a number', 400);
    }
    if (sort !== 'asc' && sort !== 'desc') {
      throw new HttpException('Sort must be either asc or desc', 400);
    }
    const users = await this.userModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .where(name ? { name: new RegExp(name, 'i') } : {})
      .where(email ? { email: new RegExp(email, 'i') } : {})
      .where(role ? { role } : {})
      .sort({ createdAt: sort === 'asc' ? 1 : -1 })
      .select('-password -__v')
      .exec();

    return {
      length: users.length,
      status: 200,
      data: users,
    };
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
