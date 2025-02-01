import ResetPasswordForm from "./form";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const token = (await params).token;

  const response = await fetch(
    `${BACKEND_URL}/auth/verify-reset-password-token?token=${token}`
  );

  const data = await response.json();

  if (!response.ok) {
    return <div>{data.error}</div>;
  }

  return (
    <>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-md text-muted-foreground">
          Enter your new password and validate your password
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </>
  );
}