import BG from "../assets/bg.jpg";

export default function ProductCard() {

    return(
        <div className="w-80 h-90 border-2 rounded-xl p-10 place-items-start text-left">
             <img src={BG} className="mx-auto mb-5 w-50 h-fit object-cover object-center self-center" alt="Product Image" />
            <div className="flex flex-row">
                <div className="flex flex-col">
                    <h1 className="font-bold text-lg">Product Name</h1>
                    <p className="text-grey text-sm">Product Type</p>
                </div>
                <span className="m-auto"></span>
                <button type="button" className="px-2 text-lightgrey rounded-md hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></button>
                <div class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <div class="py-1" role="none">
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">Account settings</a>
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Support</a>
                <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-2">License</a>
                </div>
            </div>
            </div>
            
            <div className="flex flex-row mx-auto mb-5">
                 <div className="m-auto"></div>
                <p className="text-right font-bold text-green">Php 1000</p>
            </div>
            <button className="bg-green text-white rounded-lg px-16 py-2 text-lg self-center">Add to Cart</button>
            
            <div className="flex flex-row space-x-5 my-5 items-center justify-center">
                <button className="bg-red-500 text-white rounded-full px-2 text-lg">-</button>
                <p className="">1 in cart</p>
                <button className="bg-green text-white rounded-full px-2 text-lg">+</button>
            </div>
            <div className="hidden" id="product-info">
                <p className="">Product Description here</p>
                <p className="">5 Stocks Left</p>
            </div>
            
        </div>
    )
}
