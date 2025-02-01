import { auth } from "@/actions/auth";
import { LogoutButton, PremiumButton } from "../../../components/ui/buttons";
import { User } from "@/interfaces/user";

export default async function Home() {
  const session: User = await auth();

  return (
    <div>
      <h1>Hello</h1>
      <p className="text-red-600">Welcome {session?.name}</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <img src={session.profilePictureUrl} alt="profile picture" className="w-20 h-20 rounded-full" />
      <LogoutButton />
      <PremiumButton />
    </div>
  );
}