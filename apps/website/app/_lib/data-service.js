import { notFound } from "next/navigation";
import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";
import { createClient as createServerClient } from "./supabase/server";

/////////////
// GET

export async function getCabin(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getCabinPrice(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("无法加载客房列表");
  }

  return data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  const serverSupabase = createServerClient();
  const { data, error } = await serverSupabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id) {
  const serverSupabase = createServerClient();
  const { data, error, count } = await serverSupabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("无法加载预订");
  }

  return data;
}

export async function getBookings(guestId) {
  const serverSupabase = createServerClient();
  const { data, error, count } = await serverSupabase
    .from("bookings")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)"
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("无法加载预订列表");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId) {
  // The RPC exposes occupied dates without exposing complete booking rows.
  const { data, error } = await supabase.rpc("get_booked_dates", {
    p_cabin_id: Number(cabinId),
  });

  if (error) {
    console.error(error);
    throw new Error("无法加载预订列表");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("无法加载设置");
  }

  return data;
}

export async function getCountries() {
  const fallbackCountries = [
    { name: "China", displayName: "中国", flag: "https://flagcdn.com/cn.svg" },
    { name: "Hong Kong", displayName: "中国香港", flag: "https://flagcdn.com/hk.svg" },
    { name: "Macao", displayName: "中国澳门", flag: "https://flagcdn.com/mo.svg" },
    { name: "Taiwan", displayName: "中国台湾", flag: "https://flagcdn.com/tw.svg" },
    { name: "Japan", displayName: "日本", flag: "https://flagcdn.com/jp.svg" },
    { name: "South Korea", displayName: "韩国", flag: "https://flagcdn.com/kr.svg" },
    { name: "Singapore", displayName: "新加坡", flag: "https://flagcdn.com/sg.svg" },
    { name: "Malaysia", displayName: "马来西亚", flag: "https://flagcdn.com/my.svg" },
    { name: "Thailand", displayName: "泰国", flag: "https://flagcdn.com/th.svg" },
    { name: "Australia", displayName: "澳大利亚", flag: "https://flagcdn.com/au.svg" },
    { name: "New Zealand", displayName: "新西兰", flag: "https://flagcdn.com/nz.svg" },
    { name: "United States", displayName: "美国", flag: "https://flagcdn.com/us.svg" },
    { name: "Canada", displayName: "加拿大", flag: "https://flagcdn.com/ca.svg" },
    { name: "United Kingdom", displayName: "英国", flag: "https://flagcdn.com/gb.svg" },
    { name: "France", displayName: "法国", flag: "https://flagcdn.com/fr.svg" },
    { name: "Germany", displayName: "德国", flag: "https://flagcdn.com/de.svg" },
    { name: "Italy", displayName: "意大利", flag: "https://flagcdn.com/it.svg" },
    { name: "Spain", displayName: "西班牙", flag: "https://flagcdn.com/es.svg" },
  ];

  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag",
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return fallbackCountries;

    const countries = await res.json();
    if (!Array.isArray(countries)) return fallbackCountries;

    return countries.map((country) => ({
      ...country,
      displayName: country.name,
    }));
  } catch {
    return fallbackCountries;
  }
}
