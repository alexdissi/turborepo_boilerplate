"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { ResetPasswordFormData, resetPasswordSchema } from "@/schemas/loginSchema";
import { resetPassword } from "@/actions/auth";


export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    startTransition(async () => {
      const response = await resetPassword(data, token);

      if (!response.success) {
        setError("root.serverError", {
          type: "server",
          message: response.message,
        });
        return;
      };

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root?.serverError && (
        <div className="text-red-500 text-sm">
          {errors.root.serverError.message}
        </div>
      )}

      <div>
        <label htmlFor="password">Password</label>
        <div>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className={`border ${errors.password ? "border-red-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="passwordConfirm">Confirm Password</label>
        <div>
          <input
            type={showPassword ? "text" : "password"}
            {...register("passwordConfirm")}
            className={`border ${errors.passwordConfirm ? "border-red-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.passwordConfirm && (
          <p className="text-red-500 text-sm">
            {errors.passwordConfirm?.message}
          </p>
        )}
      </div>

      {isPending ? (
        <p>Loading...</p>
      ) : (
        <button type="submit">Reset Password</button>
      )}
    </form>
  );
}