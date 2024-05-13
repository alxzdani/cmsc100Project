import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BG_IMG from "../assets/farm-to-table-bg.jpg";

export default function LandingPage() {
  return (
    <div
      style={{
        backgroundImage: `url(${BG_IMG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      id="top"
    >
      <Navbar />
    </div>
  );
}
