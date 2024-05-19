import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BG from "../assets/bg.jpg";

export default function LandingPage() {
  return (
    <div className="" id="top">
      <Navbar />
      <div className="flex flex-col items-center mt-22 my-10 pb-10" id="main">
          <img src={BG} className="h-screen overflow-auto object-cover object-top" alt="Background Image" />
      </div>
      <Footer />
    </div>
  );
}
