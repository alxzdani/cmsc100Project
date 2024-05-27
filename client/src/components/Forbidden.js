import Navbar from "./Navbar";
import FORBIDDEN from "../assets/403.png";

export default function Forbidden() {
  return (
    <div className="" id="top">
      <Navbar />
      <div className="flex flex-col items-center mt-24" id="main">
          <img src={FORBIDDEN} className="" alt="Forbidden Page" />
          <h1 className="text-3xl font-bold mb-10">Access Denied</h1>
          <p className="">You do not have permission to access this page.</p>
      </div>
    </div>
  );
}
