import ReservationList from "@/app/_components/ReservationList";
import { auth } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";

export const metadata = {
  title: "我的预订",
};

export default async function Page() {
  const session = await auth();
  const bookings = await getBookings(session.user.guestId);
  // Use one fixed reference time for both SSR and hydration. If the server and
  // browser each call new Date(), a booking around its start time can render
  // different action buttons and cause a hydration mismatch.
  const referenceDate = new Date().toISOString();

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        我的预订
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          您还没有预订，去看看我们的{" "}
          <a className="underline text-accent-500" href="/cabins">
            豪华木屋 &rarr;
          </a>
        </p>
      ) : (
        <ReservationList bookings={bookings} referenceDate={referenceDate} />
      )}
    </div>
  );
}
