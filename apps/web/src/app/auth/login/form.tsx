
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/schemas/loginSchema";
import { login } from "@/actions/auth";

const LoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    startTransition(async () => {
      const response = await login(data);

      if (!response.success) {
        setError("root.serverError", {
          type: "server",
          message: response.message,
        });
        return;
      }

      router.push("/dashboard");
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
          className={`${errors.email ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
      <div>
        <div>
          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <a href="/auth/forgot-password">Forgot Password?</a>
        </div>
        <input
          type="password"
          {...register("password")}
          className={` ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>
      <div>
        {isPending ? (
          <p>Loading...</p>
        ) : (
          <button type="submit" disabled={isPending}>
            Login
          </button>
        )}
      </div>
    </form>
  );
};

export default LoginForm;