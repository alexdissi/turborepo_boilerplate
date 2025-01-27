import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class CreateCheckoutSessionDto {
    @IsString()
    @IsNotEmpty()
    @Length(10, 50)
    @Matches(/^price_[a-zA-Z0-9]+$/, { message: 'Invalid planId format' })
    planId: string;
}
