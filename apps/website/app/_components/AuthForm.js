"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState = { error: "", redirectTo: "" };

function AuthSubmitButton({ mode }) {
  const { pending } = useFormStatus();
  const isRegister = mode === "register";

  return (
    <button
      disabled={pending}
      className="bg-accent-500 px-8 py-4 font-semibold text-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending
        ? isRegister
          ? "正在创建账户..."
          : "正在登录..."
        : isRegister
          ? "创建账户"
          : "登录"}
    </button>
  );
}

export default function AuthForm({ action, mode, nextPath = "/account" }) {
  const [state, formAction] = useFormState(action, initialState);
  const isRegister = mode === "register";

  useEffect(() => {
    if (state?.redirectTo) window.location.replace(state.redirectTo);
  }, [state?.redirectTo]);

  return (
    <form action={formAction} className="w-full max-w-lg space-y-6">
      <input type="hidden" name="next" value={nextPath || "/account"} />

      {isRegister && (
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-lg">姓名</label>
          <input id="fullName" name="fullName" type="text" autoComplete="name" required minLength={2} className="w-full bg-primary-200 px-5 py-3 text-primary-800" />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-lg">邮箱</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="w-full bg-primary-200 px-5 py-3 text-primary-800" />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-lg">密码</label>
        <input id="password" name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} required minLength={8} className="w-full bg-primary-200 px-5 py-3 text-primary-800" />
      </div>

      {state?.error && (
        <p className="border border-red-700 bg-red-950/30 px-4 py-3 text-red-300">{state.error}</p>
      )}

      <div className="flex items-center justify-between gap-6">
        <AuthSubmitButton mode={mode} />
        <Link href={isRegister ? "/login" : "/register"} className="text-accent-400 underline">
          {isRegister ? "已有账户？去登录" : "还没有账户？立即注册"}
        </Link>
      </div>
    </form>
  );
}
