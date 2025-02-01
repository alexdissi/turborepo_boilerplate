import ForgotPasswordForm from "./form";

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Forgot Password ?
        </h1>
        <p className="text-md text-muted-foreground">
          Enter your email to reset your password
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}