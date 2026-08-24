import AuthForm from "../_components/AuthForm";
import { loginAction } from "../_lib/actions";

export const metadata = {
  title: "登录",
};

export default function Page({ searchParams }) {
  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <h2 className="text-3xl font-semibold">
        登录后进入顾客中心
      </h2>

      {searchParams?.message && (
        <p className="border border-accent-500 px-4 py-3 text-accent-300">{searchParams.message}</p>
      )}
      {searchParams?.error && (
        <p className="border border-red-700 px-4 py-3 text-red-300">{searchParams.error}</p>
      )}
      <AuthForm action={loginAction} mode="login" nextPath={searchParams?.next} />
    </div>
  );
}
