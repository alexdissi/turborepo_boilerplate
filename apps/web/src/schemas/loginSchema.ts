import { z } from "zod";

const emailValidation = /^(?!.*\+\d+)[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordValidation = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const loginSchema = z.object({
    email: z.string().email({ message: "Adresse e-mail invalide" }),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});

export const registerSchema = z.object({
    firstName: z.string({ required_error: "Le prénom est requis" })
        .min(1, "Le prénom est requis")
        .max(32, "Le prénom ne doit pas dépasser 32 caractères"),

    lastName: z.string({ required_error: "Le nom est requis" })
        .min(1, "Le nom est requis")
        .max(32, "Le nom ne doit pas dépasser 32 caractères"),

    email: z.string({ required_error: "L'email est requis" })
        .min(1, "L'email est requis")
        .email("Veuillez fournir une adresse email valide")
        .regex(emailValidation, "L'email ne doit pas contenir de '+' suivi de chiffres"),

    password: z.string({ required_error: "Le mot de passe est requis" })
        .min(1, "Le mot de passe est requis")
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(32, "Le mot de passe ne doit pas dépasser 32 caractères")
        .regex(passwordValidation, "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial"),

    passwordConfirm: z.string({ required_error: "La confirmation du mot de passe est requise" })
        .min(1, "La confirmation du mot de passe est requise"),
}).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Les mots de passe ne correspondent pas",
});

export const forgotPasswordSchema = z.object({
    email: z.string({ required_error: "L'email est requis" })
        .min(1, "L'email est requis")
        .email("Veuillez fournir une adresse email valide"),
});

export const resetPasswordSchema = z.object({
    password: z.string({ required_error: "Le mot de passe est requis" })
        .min(1, "Le mot de passe est requis")
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(32, "Le mot de passe ne doit pas dépasser 32 caractères")
        .regex(passwordValidation, "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial"),

    passwordConfirm: z.string({ required_error: "La confirmation du mot de passe est requise" })
        .min(1, "La confirmation du mot de passe est requise"),
}).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Les mots de passe ne correspondent pas",
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;