import AuthForm from "../_components/AuthForm";
import { signUpAction } from "../_lib/actions";

export const metadata = { title: "注册" };

export default function Page({ searchParams }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-10">
      <h2 className="text-3xl font-semibold">创建顾客账户</h2>
      <AuthForm action={signUpAction} mode="register" nextPath={searchParams?.next} />
    </div>
  );
}
