import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RequestWithUser } from 'src/auth/jwt.strategy';
import { SearchUsersDto } from './dto/search-user.dto';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { UpdateInfosDto } from './dto/update-user.dto';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @UseGuards(AdminGuard)
  async getUsers(@Query() paginationDto: PaginationDto) {
    return this.userService.getUsers(paginationDto);
  }

  @Get('/me')
  async getUser(@Req() req: RequestWithUser) {
    if (!req.user || !req.user.userId) {
      throw new Error("The user is not authenticated");
    }

    const userId = req.user.userId;
    return this.userService.getUser(userId);
  }

  @Get('/search-users')
  async getResearch(
    @Query() paginationDto: PaginationDto,
    @Query() searchDto: SearchUsersDto
  ) {
    const { name } = searchDto;
    return this.userService.researchUsers(paginationDto, name);
  }

  @Patch(':id')
  async updateUser(@Req() req: RequestWithUser, @Param("id") id: string, @Body() data: UpdateInfosDto) {
    if (!req.user || !req.user.userId) {
      throw new Error("The user is not authenticated");
    }

    const userId = req.user.userId;
    if (userId !== id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.userService.updateUser(userId, data);
  }

  @Put(':id/change-password')
  async changePassword(@Req() req: RequestWithUser, @Param("id") id: string, @Body() data: ChangePasswordDto) {
    if (!req.user || !req.user.userId) {
      throw new Error("The user is not authenticated");
    }

    const userId = req.user.userId;
    if (userId !== id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.changePassword(userId, data);
  }

}
