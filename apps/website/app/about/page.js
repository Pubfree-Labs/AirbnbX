import Image from "next/image";
import image1 from "@/public/about-1.jpg";
import image2 from "@/public/about-2.jpg";
import { getCabins } from "../_lib/data-service";

export const revalidate = 86400;

export const metadata = {
  title: "关于我们",
};

export default async function Page() {
  const cabins = await getCabins();

  return (
    <div className="grid grid-cols-5 gap-x-24 gap-y-32 text-lg items-center">
      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          欢迎来到 The Wild Oasis
        </h1>

        <div className="space-y-8">
          <p>
            在这里，自然之美与舒适生活浑然一体。The Wild Oasis 隐于意大利
            多洛米蒂山脉腹地，是您远离日常生活的世外桃源。这里不只有豪华木屋，
            更是一段重新亲近自然、与家人共享简单快乐的旅程。
          </p>
          <p>
            我们的 {cabins.length} 间豪华木屋为您提供温馨住所，而真正的自由与宁静
            藏在周围的群山之中。漫步葱郁森林，呼吸清新空气，在篝火旁或私人热水池中
            仰望闪烁星空。
          </p>
          <p>
            在壮丽自然的环抱中，每一刻都值得铭记。放慢脚步、彻底放松，
            感受与挚爱之人在美景中相聚的喜悦。
          </p>
        </div>
      </div>

      <div className="col-span-2">
        <Image
          src={image1}
          alt="一家人围坐在木屋前的火炉旁"
          placeholder="blur"
          quality={80}
        />
      </div>

      <div className="relative aspect-square col-span-2">
        <Image
          src="/about-2.jpg"
          fill
          className="object-cover"
          alt="经营 The Wild Oasis 的家族"
        />
      </div>

      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          自 1962 年起由我们的家族经营
        </h1>

        <div className="space-y-8">
          <p>
            自 1962 年以来，The Wild Oasis 一直是备受珍爱的家族度假胜地。
            这里由祖父母创立，在几代人的爱与用心中传承，见证着我们打造温暖、
            友好环境的坚持。
          </p>
          <p>
            多年来，我们始终守护 The Wild Oasis 的初心，将山川恒久之美与家族经营
            独有的人情温度融为一体。在这里，您不只是客人，更是大家庭的一员。
            期待与您相聚，在传统与宁静交汇之处，感受如归家般的每一次停留。
          </p>

          <div>
            <a
              href="/cabins"
              className="inline-block mt-4 bg-accent-500 px-8 py-5 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
            >
              探索我们的豪华木屋
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
