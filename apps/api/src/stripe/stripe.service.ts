import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, RawBodyRequest } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { UserPlan } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class StripeService {
    private readonly stripe: Stripe;

    constructor(private readonly configService: ConfigService, private readonly userRepository: UserRepository) {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) throw new Error('Stripe secret key is not defined in configuration');
        this.stripe = new Stripe(secretKey, { apiVersion: '2024-12-18.acacia' });
    }

    async createStripeCustomer(email: string, firstName: string, lastName: string): Promise<Stripe.Customer> {
        try {
            return await this.stripe.customers.create({
                email,
                name: `${firstName} ${lastName}`,
                metadata: { userId: '' },
            });
        } catch (error) {
            throw new HttpException('Error creating Stripe customer', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateStripeCustomer(stripeCustomerId: string, userId: string): Promise<void> {
        try {
            await this.stripe.customers.update(stripeCustomerId, {
                metadata: { userId },
            });
        } catch (error) {
            throw new HttpException('Error updating Stripe customer', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private getSuccessUrl(): string {
        return `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    }

    private getCancelUrl(): string {
        return `${process.env.APP_URL}/cancel`;
    }

    async createCheckoutSession(planId: string, userId: string): Promise<{ url: string }> {
        try {
            const user = await this.userRepository.findUserById(userId);
            const session = await this.stripe.checkout.sessions.create({
                customer: user.stripeCustomerId,
                payment_method_types: ['card'],
                mode: 'subscription',
                metadata: { plan: "Business" },
                line_items: [{ price: planId, quantity: 1 }],
                success_url: this.getSuccessUrl(),
                cancel_url: this.getCancelUrl(),
            });
            return { url: session.url };
        } catch (error) {
            throw new InternalServerErrorException('Could not create Stripe Checkout session');
        }
    }

    async createBillingPortalSession(userId: string): Promise<{ url: string }> {
        try {
            const user = await this.userRepository.findUserById(userId);
            const session = await this.stripe.billingPortal.sessions.create({
                customer: user.stripeCustomerId,
                return_url: `${process.env.APP_URL}/fr`,
            });
            return { url: session.url };
        } catch (error) {
            throw new InternalServerErrorException('Could not create Stripe Billing Portal session');
        }
    }

    async handleWebhooks({ request }: { request: RawBodyRequest<Request> }) {
        try {
            const sig = request.headers['stripe-signature'];
            const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
            if (!endpointSecret) throw new Error('The endpoint secret is not defined');

            const event = this.stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);

            switch (event.type) {
                case 'checkout.session.completed':
                    break;
                case 'customer.subscription.deleted':
                    await this.downgradeUserToFreePlan(event);
                    break;
                case 'invoice.paid':
                case 'invoice.payment_succeeded':
                    await this.upgradeUserToPaidPlan(event);
                    break;
                default:
                    throw new BadRequestException('Unhandled event type');
            }

            return { error: HttpStatus.OK, message: 'Webhook handled successfully' };
        } catch (err) {
            return { error: HttpStatus.BAD_REQUEST, message: `Webhook Error: ${err.message}` };
        }
    }

    private async upgradeUserToPaidPlan(event: Stripe.Event) {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.customer as string;
        await this.userRepository.upgradePlan(userId, UserPlan.PAID);
    }

    private async downgradeUserToFreePlan(event: Stripe.Event) {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.customer as string;
        await this.userRepository.upgradePlan(userId, UserPlan.FREE);
    }
}
