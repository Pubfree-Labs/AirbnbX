import { auth } from "../_lib/auth";

export const metadata = {
  title: "顾客中心",
};

export default async function Page() {
  const session = await auth();

  const firstName = session.user.name.split(" ").at(0);

  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      欢迎您，{firstName}
    </h2>
  );
}
