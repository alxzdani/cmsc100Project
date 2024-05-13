import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BG from "../assets/bg.jpg";

export default function LandingPage() {
  return (
    <div className="bg-backgroundColor h-full w-screen" id="top">
      <Navbar />
      <div className="flex flex-col items-center my-10 pb-10" id="main">
          <img src={BG} className="w-screen h-screen overflow-auto object-cover object-center" alt="Background Image" />
      </div>
      <Footer />
    </div>
  );
}
