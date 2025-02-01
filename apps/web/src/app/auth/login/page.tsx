import LoginForm from "./form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div>
        <h1>Connexion</h1>
        <p>Enter your id</p>
      </div>
      <LoginForm />
      <div>
        <span>
          Dont have a account ?{" "}
          <Link className="underline" href={"/auth/register"}>
            Register
          </Link>
        </span>
      </div>
    </>
  );
}