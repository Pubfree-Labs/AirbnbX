import Link from "next/link";
import Image from "next/image";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import {
  format,
  formatDistance,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay,
} from "date-fns";
import { zhCN } from "date-fns/locale";
import DeleteReservation from "./DeleteReservation";

export const formatDistanceFromNow = (dateStr, referenceDate) =>
  formatDistance(parseISO(dateStr), referenceDate, {
    addSuffix: true,
    locale: zhCN,
  });

function ReservationCard({ booking, onDelete, referenceDate }) {
  const {
    id,
    guestId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    status,
    created_at,
    cabins: { name, image },
  } = booking;
  const reference = new Date(referenceDate);
  const start = new Date(startDate);
  // Booking dates represent whole calendar days. Comparing a start date at
  // 00:00 with the current clock time would incorrectly mark today's booking
  // as past during the rest of the day.
  const hasStarted = isBefore(startOfDay(start), startOfDay(reference));
  const startsToday = isSameDay(start, reference);

  return (
    <div className="flex border border-primary-800">
      <div className="relative h-32 aspect-square">
        <Image
          src={image}
          alt={`${name}号客房`}
          fill
          className="object-cover border-r border-primary-800"
        />
      </div>

      <div className="flex-grow px-6 py-3 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {name}号客房，共住{numNights}晚
          </h3>
          {hasStarted ? (
            <span className="bg-yellow-800 text-yellow-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              已结束
            </span>
          ) : (
            <span className="bg-green-800 text-green-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              即将入住
            </span>
          )}
        </div>

        <p className="text-lg text-primary-300">
          {format(new Date(startDate), "yyyy年M月d日 EEEE", { locale: zhCN })}（
          {startsToday
            ? "今天"
            : formatDistanceFromNow(startDate, reference)}
          ）&mdash; {format(new Date(endDate), "yyyy年M月d日 EEEE", { locale: zhCN })}
        </p>

        <div className="flex gap-5 mt-auto items-baseline">
          <p className="text-xl font-semibold text-accent-400">${totalPrice}</p>
          <p className="text-primary-300">&bull;</p>
          <p className="text-lg text-primary-300">
            {numGuests}位客人
          </p>
          <p className="ml-auto text-sm text-primary-400">
            预订于 {format(new Date(created_at), "yyyy年M月d日 HH:mm", { locale: zhCN })}
          </p>
        </div>
      </div>

      <div className="flex flex-col border-l border-primary-800 w-[100px]">
        {!hasStarted ? (
          <>
            <Link
              href={`/account/reservations/edit/${id}`}
              className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 border-b border-primary-800 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
            >
              <PencilSquareIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
              <span className="mt-1">编辑</span>
            </Link>
            <DeleteReservation bookingId={id} onDelete={onDelete} />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ReservationCard;
