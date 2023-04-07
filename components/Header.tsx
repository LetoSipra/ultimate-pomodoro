import { useSession, signIn, signOut } from "next-auth/react";
import { HiOutlineUserCircle } from "react-icons/hi2";

function Header() {
  const { data: session } = useSession();
  return (
    <>
      <div className="flex h-full w-full justify-between">
        <p className="my-auto ml-5 font-thin">Ultimate Pomodoro</p>
        {session ? (
          <button className="my-auto mr-5 flex" onClick={() => signOut()}>
            <HiOutlineUserCircle className="my-auto mr-1 h-6 w-6" />
            Logout
          </button>
        ) : (
          <button className="my-auto mr-5" onClick={() => signIn()}>
            Login
          </button>
        )}
      </div>
    </>
  );
}

export default Header;
