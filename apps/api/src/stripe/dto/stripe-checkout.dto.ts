import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCheckoutSessionDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^(pro|business)$/, {
        message: 'Plan must be either "pro" or "business"',
    })
    plan: string;
}
