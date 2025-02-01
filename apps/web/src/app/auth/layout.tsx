
import Loading from "@/components/ui/loading";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={Loading()}>
      <section>
        <div className="flex flex-col md:flex-row h-screen">
          <div className="flex items-center justify-center w-full md:w-2/4 p-8 md:p-0">
            <div className="space-y-2 text-center">{children}</div>
          </div>
          <div className="hidden md:block w-2/4">
            <img
              src="https://images.unsplash.com/photo-1647816733947-fa58811c75e9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFwZXIlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww"
              alt="Login Image"
              className="w-full h-screen object-cover"
            />
          </div>
        </div>
      </section>
    </Suspense>
  );
}