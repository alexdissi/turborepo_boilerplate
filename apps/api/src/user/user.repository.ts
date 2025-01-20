import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UpdateInfosDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findAll(page: number, limit: number) {
    return this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      select: ['id', 'firstName', "lastName", 'email', 'role', 'createdAt'],
    });
  }

  async findUserById(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'firstName',
        'lastName',
        "password",
        'email',
        'profilePictureUrl',
        'role',
        'status',
        'twoFactorSecret',
        'is2faEnabled',
      ],
    });
  }

  async updateUser(userId: string, data: any) {
    await this.userRepository.update(userId, data);
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async findUsersByName(name: string, page: number, limit: number) {
    return this.userRepository.find({
      where: { firstName: ILike(`%${name}%`) },
      skip: (page - 1) * limit,
      take: limit,
      select: ['id', 'firstName', "lastName", 'email'],
    });
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findUserByResetToken(token: string) {
    return this.userRepository.findOne({ where: { resetPasswordToken: token } });
  }

  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
  }) {
    const user = this.userRepository.create({
      ...data,
      createdAt: new Date(),
    });
    return this.userRepository.save(user);
  }

  async updateUserResetStatus(
    userId: string,
    isResettingPassword: boolean,
    resetPasswordToken?: string,
  ) {
    await this.userRepository.update(userId, {
      isResettingPassword,
      resetPasswordToken,
      dateResetPassword: new Date(),
    });
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updateUserPassword(userId: string, hashedPassword: string) {
    await this.userRepository.update(userId, {
      password: hashedPassword,
      isResettingPassword: false,
      dateResetPassword: new Date(),
    });
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async save2FASecret(userId: string, twoFactorSecret: string) {
    await this.userRepository.update(userId, {
      twoFactorSecret,
      is2faEnabled: true,
    });
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async disable2FA(userId: string) {
    await this.userRepository.update(userId, {
      twoFactorSecret: null,
      is2faEnabled: false,
      twoFactorBackupCodes: [],
    });
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updateUserLastLogin(userId: string) {
    await this.userRepository.update(userId, { lastLogin: new Date() });
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updateUserInfos(userId: string, data: UpdateInfosDto): Promise<User> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    user.email = data.email;
    user.password = data.password;
    user.bio = data.bio;
    user.country = data.country;
    user.is2faEnabled = data.is2faEnabled;

    return this.userRepository.save(user);
  }
}
