"use server";

import { auth } from "./auth";
import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

function safeNextPath(value) {
  return value?.startsWith("/") && !value.startsWith("//")
    ? value
    : "/account";
}

export async function loginAction(_previousState, formData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password)
    return { error: "请输入邮箱和密码" };

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error)
    return {
      error:
        error.message === "Invalid login credentials"
          ? "邮箱或密码错误"
          : error.message,
    };

  return {
    error: "",
    redirectTo: safeNextPath(formData.get("next")?.toString()),
  };
}

export async function signUpAction(_previousState, formData) {
  const fullName = formData.get("fullName")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const next = safeNextPath(formData.get("next")?.toString());

  if (!fullName || fullName.length < 2)
    return { error: "请输入至少 2 个字符的姓名" };
  if (!email) return { error: "请输入有效的邮箱地址" };
  if (!password || password.length < 8)
    return { error: "密码至少需要 8 个字符" };

  const origin = headers().get("origin") || "http://localhost:3000";
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { fullName, account_type: "guest" },
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });

  if (error)
    return {
      error: error.message.toLowerCase().includes("already registered")
        ? "该邮箱已注册，请直接登录"
        : error.message,
    };
  if (data.session) return { error: "", redirectTo: next };

  return {
    error: "",
    redirectTo: `/login?message=${encodeURIComponent("请查收邮件并确认账户")}`,
  };
}

export async function updateGuest(_previousState, formData) {
  const session = await auth();
  if (!session) return { error: "请先登录", success: "" };
  const supabase = createClient();

  const nationalID = String(formData.get("nationalID") ?? "").trim();
  const nationalityValue = String(formData.get("nationality") ?? "");
  const [nationality, countryFlag = ""] = nationalityValue.split("%");

  if (!nationality)
    return { error: "请选择国家或地区", success: "" };

  // Supports an 18-digit Chinese ID card number (including a trailing X),
  // as well as common passport/document formats.
  if (!/^[a-zA-Z0-9-]{6,20}$/.test(nationalID))
    return {
      error: "请输入6至20位有效证件号码，可包含字母、数字和连字符",
      success: "",
    };

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) return { error: "无法更新个人资料，请稍后重试", success: "" };

  revalidatePath("/account/profile");
  return { error: "", success: "个人资料已更新" };
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("请先登录");
  if (!session.user.guestId) throw new Error("当前账号尚未关联顾客资料");
  const supabase = createClient();

  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations")?.toString() || "";
  const startDate = new Date(bookingData.startDate);
  const endDate = new Date(bookingData.endDate);

  if (
    !Number.isInteger(numGuests) ||
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    throw new Error("预订信息无效");
  }

  const { error } = await supabase.rpc("create_guest_booking", {
    p_cabin_id: Number(bookingData.cabinId),
    p_start_date: startDate.toISOString().slice(0, 10),
    p_end_date: endDate.toISOString().slice(0, 10),
    p_num_guests: numGuests,
    p_observations: observations,
  });

  if (error) throw new Error("无法创建预订");

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error("请先登录");
  const supabase = createClient();

  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId)
    .select("id")
    .maybeSingle();

  if (error || !data) throw new Error("无法删除预订");

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));

  const session = await auth();
  if (!session) throw new Error("请先登录");
  const supabase = createClient();

  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) throw new Error("无法更新预订");

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
