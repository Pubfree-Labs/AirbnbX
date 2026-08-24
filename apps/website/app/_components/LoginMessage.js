import Link from "next/link";

function LoginMessage() {
  return (
    <div className="grid bg-primary-800 ">
      <p className="text-center text-xl py-12 self-center">
        请先{" "}
        <Link href="/login" className="underline text-accent-500">
          登录
        </Link>{" "}
        后再预订
        <br /> 这间客房
      </p>
    </div>
  );
}

export default LoginMessage;
