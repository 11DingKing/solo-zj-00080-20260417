import { IsEmail, MinLength, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UserDTO {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}

export type UserSO = {
  id: string;
  createdOn: Date;
  email: string;
  token?: string;
};

export class GetUsersDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  search?: string;
}

export type UsersListSO = {
  users: UserSO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
