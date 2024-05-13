import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BG_IMG from "../assets/farm-to-table-bg.jpg";

export default function LandingPage() {
  return (
    <div className="bg-backgroundColor h-full w-screen" id="top">
      <Navbar />
      <div className="flex flex-row items-center px-2 my-10 py-10" id="main">
              <div className="flex flex-col ml-10 mr-10">
              <div style={{
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
            </div>            
          </div>
          <Footer />
      </div>

    </div>
  );
}
