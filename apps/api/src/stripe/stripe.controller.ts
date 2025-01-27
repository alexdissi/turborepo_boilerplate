import { Body, Controller, Get, Post, RawBodyRequest, Req, Request, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/stripe-checkout.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/auth/jwt.strategy';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('create-checkout-session')
  async createSubscriptionCheckoutSession(
    @Req() authRequest: RequestWithUser,
    @Body() createCheckoutSession: CreateCheckoutSessionDto,
  ) {
    const { planId } = createCheckoutSession;
    const userId = authRequest.user.userId;
    return this.stripeService.createCheckoutSession(planId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('billing-portal')
  async openBillingPortal(@Req() authRequest: RequestWithUser) {
    const userId = authRequest.user.userId;
    return this.stripeService.createBillingPortalSession(userId);
  }

  @Post('webhook')
  async handleWebhooks(@Request() request: RawBodyRequest<Request>) {
    return await this.stripeService.handleWebhooks({ request });
  }
}