import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Request,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './decorators/user.decorator';
import * as userQueryModel from './models/user-query.model';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user
   * @doc Create a new user with the provided data. Only users with the 'admin' role can create new users.
   * @Route POST /v1/user
   * @access Admin only
   */
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    createUserDto: CreateUserDto,
  ) {
    return this.userService.create(createUserDto);
  }

  /**
   * Get all users
   * @doc Retrieve a list of all users. Only users with the 'admin' role can access this endpoint.
   * @Route GET /v1/user
   * @access Admin only
   */
  @Get()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findAll(
    @Query()
    query: userQueryModel.UserQuery,
  ) {
    return this.userService.findAll(query);
  }

  /**  * Get a user by ID
   * @doc Retrieve a user by their ID. Only users with the 'admin' role can access this endpoint.
   * @Route GET /v1/user/:id
   * @access Admin only
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /** * Update a user
   * @doc Update a user's information by their ID. Only users with the 'admin' role can access this endpoint.
   * @Route PATCH /v1/user/:id
   * @access Admin only
   */
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
