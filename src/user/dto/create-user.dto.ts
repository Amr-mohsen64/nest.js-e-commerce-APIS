import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(50, { message: 'Name must be less than 50 characters' })
  name: string;

  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MinLength(0, { message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(20, { message: 'Password must be less than 20 characters' })
  password: string;

  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
  @MinLength(0, { message: 'Role is required' })
  @IsOptional()
  role: string;

  @IsString({ message: 'Avatar must be a string' })
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  @IsOptional()
  avatar?: string;

  @IsNumber({}, { message: 'Age must be a number' })
  @IsOptional()
  age?: number;

  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('EG', { message: 'Phone number must be a valid phone number' })
  @IsOptional()
  phoneNumber?: string;

  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string;

  @IsString({ message: 'Gender must be a string' })
  @IsEnum(['male', 'female'], {
    message: 'Gender must be either male or female',
  })
  @IsOptional()
  gender?: string;

  @IsString({ message: 'Verification code must be a string' })
  @Length(6, 6, { message: 'Verification code must be exactly 6 characters' })
  @IsOptional()
  verificationCode?: string;

  @IsOptional()
  @IsBoolean({ message: 'Active must be a boolean' })
  active?: boolean;
}
