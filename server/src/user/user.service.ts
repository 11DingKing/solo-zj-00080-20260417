import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDTO, UserSO, GetUsersDTO, UsersListSO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  login = async (data: UserDTO): Promise<UserSO> => {
    const { email, password } = data;
    const user = await this.userRepository.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user.sanitizeObject({ withToken: true });
  };

  register = async (data: UserDTO): Promise<UserSO> => {
    const { email } = data;
    let user = await this.userRepository.findOne({ email });
    if (user) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    } else {
      user = await this.userRepository.create(data);
      await this.userRepository.save(user);
      return user.sanitizeObject({ withToken: true });
    }
  };

  getProfile = async (email: string): Promise<any> => {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new HttpException('Email does not exists', HttpStatus.NOT_FOUND);
    return user.sanitizeObject({ withToken: true });
  };

  getUsers = async (query: GetUsersDTO): Promise<UsersListSO> => {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const whereCondition = search
      ? { email: Like(`%${search}%`) }
      : {};

    const [users, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      order: { createdOn: 'DESC' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map(user => user.sanitizeObject()),
      total,
      page,
      limit,
      totalPages,
    };
  };
}
