"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTransition } from "react";
import { ForgotPasswordFormData, forgotPasswordSchema } from "@/schemas/loginSchema";
import { forgotPassword } from "@/actions/auth";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    startTransition(async () => {
      const response = await forgotPassword(data);

      if (!response.success) {
        setError("root.serverError", {
          type: "server",
          message: response.message,
        });
        return;
      }

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root?.serverError && (
        <div className="text-red-500">{errors.root.serverError.message}</div>
      )}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          {...register("email")}
          className={`${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && (
          <p className="text-red-500">{errors.email?.message}</p>
        )}
      </div>
      {isPending ? (
        <p>Loading</p>
      ) : (
        <button type="submit" disabled={isPending}>
          Reset Password
        </button>
      )}
    </form>
  );
};

export default ForgotPasswordForm;