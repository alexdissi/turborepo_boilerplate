"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { StartConfetti } from "@/lib/confetti";
import { RegisterFormData, registerSchema } from "@/schemas/loginSchema";
import { registerUser } from "@/actions/auth";

const RegisterForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    startTransition(async () => {
      const response = await registerUser(data);

      if (!response.success) {
        setError("root.serverError", {
          type: "server",
          message: response.message,
        });
        return;
      }

      StartConfetti();

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errors.root?.serverError && (
        <div className="text-red-500">{errors.root.serverError.message}</div>
      )}
      <div>
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          className={`${
            errors.email ? "border-red-500" : "border-gray-300"
          } w-full border p-2`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="firstName" className="font-medium">
          First Name
        </label>
        <input
          type="text"
          {...register("firstName")}
          className={`${
            errors.firstName ? "border-red-500" : "border-gray-300"
          } w-full border p-2`}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="lastName" className="font-medium">
          Last Name
        </label>
        <input
          type="text"
          {...register("lastName")}
          className={`${
            errors.lastName ? "border-red-500" : "border-gray-300"
          } w-full border p-2`}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm">{errors.lastName.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          className={`${
            errors.password ? "border-red-500" : "border-gray-300"
          } w-full border p-2`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="passwordConfirm" className="font-medium">
          Confirm Password
        </label>
        <input
          type="password"
          {...register("passwordConfirm")}
          className={`${
            errors.passwordConfirm ? "border-red-500" : "border-gray-300"
          } w-full border p-2`}
        />
        {errors.passwordConfirm && (
          <p className="text-red-500 text-sm">
            {errors.passwordConfirm.message}
          </p>
        )}
      </div>
      <div>
        {isPending ? (
          <p>Loading...</p>
        ) : (
          <button type="submit" disabled={isPending}>
            Register
          </button>
        )}
      </div>
    </form>
  );
};

export default RegisterForm;