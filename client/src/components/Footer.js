import LOGO from "../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();
    
    return(
        <div className="bg-white h-fit px-6 flex flex-row place-content-center">
            <div className="m-auto flex flex-col w-screen">

                <div className="bg-notblack w-11/12 flex flex-row place-items-center place-self-center rounded-md p-6">
                    <div className="flex flex-col ml-5 place-items-start">
                        <h1 className="text-green text-3xl mb-3">Want farm fresh produce straight to your door?</h1>
                        <p className="text-white">Sign up now to gain access to the freshest picks! Registered members get exclusive perks.</p>
                    </div>
                    <div className="m-auto flex flex-auto"></div>
                    <button className="text-green bg-white font-bold rounded-sm h-fit py-2 px-10 mr-5"
                        onClick={() => {navigate("/signup");}}
                        >Sign Up</button>
                </div>

            <div className="flex flex-row w-11/12 place-self-center mt-20">
                <div className="flex flex-col place-self-center text-left text-lightgrey">
                    <img src={LOGO} className="size-12 mb-5" alt="Logo" />
                    <h1 className="text-notblack font-bold mb-5">Farm-to-table</h1>
                    <p className="">Project under the Department of Agriculture</p>
                </div>
                
                <div className="m-auto flex flex-auto">
                {/* empty space */}
                </div>

                <div className="flex flex-row justify-end my-10 space-x-40 mr-10 text-left">
                    <div className="flex flex-col items-start">
                        <h3 className="text-green text-lg mb-2 flex flex-row">Policies</h3>
                        <Link to="/link">
                        <p className="text-lightgrey text-sm mb-1">Terms of Service</p>
                        </Link>
                        <Link to="/link">
                        <p className="text-lightgrey text-sm mb-1">Merchant Guidelines</p>
                        </Link>
                        <Link to="/link">
                        <p className="text-lightgrey text-sm mb-1">Privacy Policy</p>
                        </Link>
                    </div>

                    <div className="flex flex-col items-start">
                        <h3 className="text-green text-lg mb-2 flex flex-row">Quick Links</h3>
                        <Link to="/link">
                        <p className="text-lightgrey text-sm mb-1">Customer Support</p>
                        </Link>
                        <Link to="/link">
                        <p className="text-lightgrey text-sm mb-1">Shipping and Returns</p>
                        </Link>
                        <Link to="/link">
                        <p className="text-lightgrey text-sm mb-1">FAQ</p>
                        </Link>
                    </div>

                    <div className="flex flex-col items-start">
                        <h3 className="text-green text-lg mb-2 flex flex-row">Connect with Us</h3>
                        <div className="flex flex-row text-lightgrey space-x-3">
                            <svg class="lucide lucide-facebook" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            <svg class="lucide lucide-instagram" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                            <svg class="lucide lucide-twitter" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                    </div>
                
                </div>
            </div>

            
            </div>
        </div>
    );
}