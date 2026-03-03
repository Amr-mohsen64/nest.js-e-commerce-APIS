import { Reflector } from '@nestjs/core';

type Role = 'user' | 'admin';
export const Roles = Reflector.createDecorator<Role[]>();
