import Link from "next/link";
import RegisterForm from "./form";

export default function RegisterPage() {
  return (
    <>
      <div>
        <h1>Inscription</h1>
        <p>Create your account</p>
      </div>
      <RegisterForm />
      <div>
        <span>
          Already have an account?{" "}
          <Link className="underline" href={"/auth/login"}>
            Login
          </Link>
        </span>
      </div>
    </>
  );
}