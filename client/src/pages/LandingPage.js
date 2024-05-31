import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Accordion from "../components/Accordion";
import BG from "../assets/landingpage.png";

export default function LandingPage() {
  return (
    <div className="" id="top">
      <Navbar />
      <div className="flex flex-col items-center mt-22 my-10 pb-10" id="main">
          <img src={BG} className="h-screen overflow-auto object-cover object-top" alt="Background Image" />
          
          <h1 className="text-4xl mt-20 my-10 font-bold">Frequently Asked Questions</h1>
            <div className="max-w-[100%] w-full flex-col justify-center items-center px-20">
                <Accordion 
                    title={"What is Farm ni Ville?"}
                    answer={"Farm ni Ville is a social program emphasizing the need for a direct link between consumers and farmers."}
                    isFirst={true}/>
                <Accordion 
                    title={"How do I create an account?"}
                    answer={<>
                    <h1>Creating your account is easy, just follow the steps below:</h1>
                    <ul className="list-decimal ml-10">
                      <li>Select the black "Sign Up" button located on the top right of the home page or press this <a href="/signup" className="text-notgreen underline underline-offset-2">link</a></li>
                      <li>Enter your personal information such as name, email, and password</li>
                      <li>Once done, click the green "Sign Up" button below to create your account</li>
                    </ul>
                    </>}
                    isFirst={false}/>
                <Accordion 
                    title={"How do I place an order online?"}
                    answer={<>
                    <h1>To place an order online, follow these steps:</h1>
                    <ul className="list-decimal ml-10">
                      <li>Sign up for an account or log in</li>
                      <li>Browse the products <a href="/shop" className="text-notgreen underline underline-offset-2">here</a></li>
                      <li>Select the desired product and click "Add to Cart"</li>
                      <li>Once you’ve added all desired items to your cart, click on the cart icon on the navigational bar and then "Checkout"</li>
                      <li>Enter your shipping information</li>
                      <li>Review your order and click "Place Order" to complete your purchase</li>
                    </ul>
                    </>}
                    isFirst={false}/>
                <Accordion 
                    title={"Do I need to create an account to order online?"}
                    answer={"Yes, you need to create an account to place an order. Creating an account allows you to track your orders and receive exclusive offers. "}
                    isFirst={false}/>
                <Accordion 
                    title={"What payment methods do you accept?"}
                    answer={"Farm ni Ville accepts Cash-on-delivery (COD) as its only mode of payment."}
                    isFirst={false}/>
                <Accordion 
                    title={"Who are the developers of this project?"}
                    answer={
                      <>
                      <h1 className="">This project was made possible by the following students from CMSC100 U-3L:</h1>
                      <ul class="list-disc ml-10">
                        <li className="leading-loose">Aguinaldo, Alexis Danielle</li>
                        <li className="leading-loose">Samson, Hannah Patricia</li>
                        <li className="leading-loose">Olano, Kenneth</li>
                        <li className="leading-loose">Rondain, Andrea Louise</li>
                      </ul>
                      </>
                    }
                    isFirst={false}/>   
          </div>

      </div>
      <Footer />
    </div>
  );
}
