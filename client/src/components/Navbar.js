import LOGO from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <div className="fixed top-0 z-50 bg-white h-20 w-screen px-6 flex flex-row drop-shadow-2xl place-content-center">
            <div className="m-auto flex flex-row w-screen">
                <button onClick={() => navigate('/')} className="flex items-center text-left bg-transparent border-none p-0">
                    <img src={LOGO} className="size-14 ml-6 mr-3 place-self-center" alt="Logo" />
                    <h1 className="text-notblack tracking-wide text-3xl font-bold mr-5 place-self-center">Farm-to-table</h1>
                </button>
                <div className="m-auto flex flex-auto">
                    {/* empty space */}
                </div>
                <div className="mr-6 flex flex-row place-items-center">
                    <button className="text-white bg-gray-900 rounded-lg font-bold py-2 px-10 mr-5 hover:bg-gray-700 shadow-lg transition-colors duration-300"
                        onClick={() => { navigate("/signup"); }}
                    >Sign Up</button>
                    <button className="text-gray-900 bg-gray-300 rounded-lg font-bold px-10 py-2 hover:bg-gray-400 shadow-lg transition-colors duration-300"
                        onClick={() => { navigate("/login"); }}
                    >Log In</button>
                </div>
            </div>
        </div>
    );
}
