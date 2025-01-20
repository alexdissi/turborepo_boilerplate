import { IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
    @IsNotEmpty({ message: 'Password is required.' })
    @IsString()
    @MinLength(8, {
        message: 'Password must be at least 8 characters long.',
    })
    @MaxLength(32, {
        message: 'Password cannot exceed 32 characters.',
    })
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: 'Password must include uppercase, lowercase, numbers, and special characters.',
    })
    currentPassword: string;

    @IsNotEmpty({ message: 'Password is required.' })
    @IsString()
    @MinLength(8, {
        message: 'Password must be at least 8 characters long.',
    })
    @MaxLength(32, {
        message: 'Password cannot exceed 32 characters.',
    })
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: 'Password must include uppercase, lowercase, numbers, and special characters.',
    })
    newPassword: string;

    @IsNotEmpty({ message: 'Password is required.' })
    @IsString()
    @MinLength(8, {
        message: 'Password must be at least 8 characters long.',
    })
    @MaxLength(32, {
        message: 'Password cannot exceed 32 characters.',
    })
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
        message: 'Password must include uppercase, lowercase, numbers, and special characters.',
    })
    passwordVerification: string;
}