import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsBoolean, IsOptional, Matches } from 'class-validator';

export class UpdateInfosDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsOptional()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message: 'Password must include uppercase, lowercase, numbers, and special characters.',
  })
  password?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsOptional()
  bio?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  country?: string;

  @IsBoolean()
  @IsOptional()
  is2faEnabled?: boolean;
}