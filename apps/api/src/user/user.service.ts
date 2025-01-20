import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateInfosDto } from './dto/update-user.dto';
import { hash, verify } from 'argon2';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async getUsers(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const users = await this.userRepository.findAll(page, limit);
        return users;
    }

    async getUser(userId: string) {
        return this.userRepository.findUserById(userId);
    }

    async researchUsers(paginationDto: PaginationDto, name: string) {
        const { page, limit } = paginationDto;
        const users = await this.userRepository.findUsersByName(name, page, limit);
        return users;
    }

    async updateUser(userId: string, data: UpdateInfosDto) {
        if (data.password) {
            data.password = await hash(data.password);
        }
        const user = await this.userRepository.updateUser(userId, data);

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return {
            status: HttpStatus.OK,
            message: 'User updated successfully',
        };
    }

    async changePassword(userId: string, data: ChangePasswordDto) {
        const { currentPassword, newPassword, passwordVerification } = data;

        if (newPassword !== passwordVerification) {
            throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const isPasswordValid = await verify(user.password, currentPassword);
        if (!isPasswordValid) {
            throw new HttpException('Invalid current password', HttpStatus.BAD_REQUEST);
        }

        const newPasswordHash = await hash(newPassword);

        await this.userRepository.updateUser(userId, { password: newPasswordHash });

        return {
            status: HttpStatus.OK,
            message: 'Password updated successfully',
        };
    }
}
