import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}

export enum UserPlan {
    FREE = 'FREE',
    PRO = 'PRO',
    BUSINESS = 'BUSINESS',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Index()
    email: string;

    @Column()
    @Index()
    firstName: string;

    @Column()
    @Index()
    lastName: string;

    @Column()
    password: string;

    @Column({ default: false })
    isResettingPassword: boolean;

    @Column({ nullable: true, unique: true })
    resetPasswordToken?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    dateResetPassword?: Date;

    @Column({ nullable: true })
    profilePictureUrl?: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
    status: Status;

    @Column({ nullable: true })
    stripeCustomerId?: string;

    @Column({ type: 'enum', enum: UserPlan, default: UserPlan.FREE })
    userPlan: UserPlan;

    @Column({ nullable: true, type: 'timestamp' })
    accountLockedUntil?: Date;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    country?: string;

    @Column({ default: false })
    is2faEnabled: boolean;

    @Column({ nullable: true, type: 'timestamp' })
    lastLogin?: Date;

    @Column({ type: 'simple-array', default: [] })
    twoFactorBackupCodes: string[];

    @Column({ nullable: true, unique: true })
    twoFactorSecret?: string;
}
