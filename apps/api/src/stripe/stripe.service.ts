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

    async createCheckoutSession(plan: string, userId: string): Promise<{ url: string }> {
        let planId: string

        switch (plan) {
            case 'pro':
                planId = process.env.STRIPE_PRO_PLAN_ID;
                break;
            case 'business':
                planId = process.env.STRIPE_BUSINESS_PLAN_ID;
                break;
            default:
                throw new BadRequestException('Invalid plan ID');
        }

        try {
            const user = await this.userRepository.findUserById(userId);
            const session = await this.stripe.checkout.sessions.create({
                customer: user.stripeCustomerId,
                payment_method_types: ['card', "revolut_pay"],
                mode: 'subscription',
                metadata: { plan: "Business" },
                line_items: [{ price: planId, quantity: 1 }],
                success_url: `${process.env.APP_URL}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.APP_URL}/payment?status=cancel`,
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
            await this.handleStripeEvent(event);

            return { error: HttpStatus.OK, message: 'Webhook handled successfully' };
        } catch (err) {
            return { error: HttpStatus.BAD_REQUEST, message: `Webhook Error: ${err.message}` };
        }
    }

    private async handleStripeEvent(event: Stripe.Event) {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        let planId: string | undefined;

        if (subscriptionId) {
            const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
            planId = subscription.items.data[0]?.plan.id;
        }

        switch (event.type) {
            case 'checkout.session.completed':
                break;
            case 'customer.subscription.deleted':
                await this.handlePlanChange(session, UserPlan.FREE);
                break;
            case 'invoice.paid':
            case 'invoice.payment_succeeded':
                await this.processPlanUpgrade(session, planId);
                break;
            default:
                throw new BadRequestException('Unhandled event type');
        }
    }

    private async processPlanUpgrade(session: Stripe.Checkout.Session, planId?: string) {
        switch (planId) {
            case process.env.STRIPE_PRO_PLAN_ID:
                await this.handlePlanChange(session, UserPlan.PRO);
                break;
            case process.env.STRIPE_BUSINESS_PLAN_ID:
                await this.handlePlanChange(session, UserPlan.BUSINESS);
                break;
            default:
                throw new BadRequestException('Unhandled plan ID');
        }
    }

    private async handlePlanChange(session: Stripe.Checkout.Session, plan: UserPlan) {
        const userId = session.customer as string;
        await this.userRepository.upgradePlan(userId, plan);
    }
}    
