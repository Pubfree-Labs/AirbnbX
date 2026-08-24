"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { updateGuest } from "../_lib/actions";
import SubmitButton from "./SubmitButton";

function UpdateProfileForm({ guest, children }) {
  const { fullName, email, nationality, nationalID, countryFlag } = guest;
  const [flagLoadFailed, setFlagLoadFailed] = useState(false);
  const [state, formAction] = useFormState(updateGuest, {
    error: "",
    success: "",
  });
  const hasValidFlag =
    /^https?:\/\//i.test(countryFlag ?? "") && !flagLoadFailed;

  return (
    <form
      action={formAction}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label>姓名</label>
        <input
          disabled
          defaultValue={fullName}
          name="fullName"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label>邮箱地址</label>
        <input
          disabled
          defaultValue={email}
          name="email"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">来自哪个国家或地区？</label>
          {hasValidFlag ? (
            <img
              src={countryFlag}
              alt="国家或地区旗帜"
              className="h-5 rounded-sm"
              onError={() => setFlagLoadFailed(true)}
            />
          ) : (
            <span
              title="尚未设置有效的国家或地区旗帜"
              className="text-primary-400"
            >
              <GlobeAltIcon className="h-5 w-5" />
            </span>
          )}
        </div>

        {children}
      </div>

      <div className="space-y-2">
        <label htmlFor="nationalID">身份证件号码</label>
        <input
          defaultValue={nationalID}
          name="nationalID"
          minLength={6}
          maxLength={20}
          pattern="[A-Za-z0-9-]{6,20}"
          title="请输入6至20位字母、数字或连字符"
          required
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      {state?.error && (
        <p className="border border-red-700 bg-red-950/30 px-4 py-3 text-red-300">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="border border-green-700 bg-green-950/30 px-4 py-3 text-green-300">
          {state.success}
        </p>
      )}

      <div className="flex justify-end items-center gap-6">
        <SubmitButton pendingLabel="正在更新……">更新个人资料</SubmitButton>
      </div>
    </form>
  );
}

export default UpdateProfileForm;
