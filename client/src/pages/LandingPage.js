import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LandingPage() {
    return (
        <div className="bg-backgroundColor h-full w-screen" id="top">
          <Navbar />
          <div className="flex flex-row items-center px-2 my-10 py-10" id="main">
              <div className="flex flex-col ml-10 mr-10">
                <div className="flex flex-row" id="logo-top">
                  <h1 className="text-6xl font-bold mb-6">Landing Page</h1>
                </div>
            </div>            
          </div>
        {/* <Footer /> */}
        </div> 
      );
}

