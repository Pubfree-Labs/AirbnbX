import { Suspense } from "react";
import CabinList from "../_components/CabinList";
import Spinner from "../_components/Spinner";
import Counter from "../_components/Counter";
import Filter from "../_components/Filter";
import ReservationReminder from "../_components/ReservationReminder";

export const revalidate = 3600;
// export const revalidate = 15;

export const metadata = {
  title: "客房",
};

export default function Page({ searchParams }) {
  const filter = searchParams?.capacity ?? "all";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        我们的豪华木屋
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        温馨而奢华的木屋坐落于意大利多洛米蒂山脉腹地。清晨在壮丽山景中醒来，
        白天探索幽深森林，夜晚在星空下享受私人热水池。在属于您的山间小屋里
        尽情感受自然之美，度过宁静从容的假期。欢迎来到世外桃源。
      </p>

      <div className="flex justify-end mb-8">
        <Filter />
      </div>

      <Suspense fallback={<Spinner />} key={filter}>
        <CabinList filter={filter} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
