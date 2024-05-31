# CMSC 100 Final Project

### Developers
- Group 5 U-3L
    - Aguinaldo, Alexis Danielle
    - Samson, Hannah Patricia
    - Olano, Kenneth
    - Rondain, Andrea Louise

### Project Title
Farm Ni Ville

### Project Description
Farm Ni Ville is an E-commerce website run by the Department of Agriculture (DA) to facilitate transaction between farmers and customers directly. The developers built this website using MERN stack to create a robust web application mainly using JavaScript.

### Project Features
- As a customer
    - can log in and sign up
    - can browse product
    - can add to cart and remove item to their cart
    - can checkout
    - can manage their order
        - they track the status of their order
        - unless marked as completed by admin, they can still cancel their order
    - can view their profile
- As a admin
    - can oversees the list of registered user
    - report total number of registered user
    - can check product inventory (product listing)
    - order fulfillment
        - admin (merchant) is responsible for handling orders
            - they can mark the order as completed
            - they can cancel order
            - they can see pending orders
    - sales report that present summary of transaction

### Usage Guidelines
- How do I create an account?
    - Select the black "Sign Up" button located on the top right of the home page.
    - Enter your personal information such as name, email, and password.
    - Once done, click the green "Sign Up" button below to create your account.

- How to place an order online?
    - Sign up for an account or log in
    - Browse the products
    - Select the desired product and click "Add to Cart"
    - Once you’ve added all desired items to your cart, click on the cart icon on the navigational bar and then "Checkout"
    - Don't forget to enter your shipping information
    - Review your order and click "Place Order" to complete your purchase

- FAQs
    - Do I need to create an account to order online?
        - Yes, you need to create an account to place an order. Creating an account allows you to track your orders and receive exclusive offers.
    - What payment methods do you accept?
        - Farm-to-table is currently accepting Cash-on-delivery (COD) as its only mode of payment.

### How to Run
To run this project, clone the repository in your device (computer or PC). Open MongoDB Compass and create a new connection, put this link in the URI
```
mongodb+srv://alexisdaniellieee:aEzAshDCA2pQsudY@cluster30.0h4lpvz.mongodb.net/
```
and click Connect. After that, open your terminal make sure that you are in the right directory, navigate to the client folder, and type in the following commands:
```
npm i 
npm start
```
This will you redirect you to the landing page of this project.

### Figma link
https://www.figma.com/file/wDRXBCrVjhY36iK9XUa8i8/CMSC100-Project---Farm-to-table?type=design&node-id=0-1&mode=design&t=FIItockSDVoyuQi7-0

### Screenshot of Screens
![Landing Page](client/src/assets/100ss/ss-landingpage.png)
![Login Page](client/src/assets/100ss/ss-login.png)
![Signup Page](client/src/assets/100ss/ss-signup.png)
![Shop Page](client/src/assets/100ss/ss-shop.png)
![Profile Page](client/src/assets/100ss/ss-profile.png)
![FAQs](client/src/assets/100ss/ss-faqs.png)
![Cart Page](client/src/assets/100ss/ss-cart.png)
![Manage Order](client/src/assets/100ss/ss-manageorder.png)
![Dashboard](client/src/assets/100ss/ss-dashboard.png)
![Navbar](client/src/assets/100ss/ss-navbar.png)
![User Management](client/src/assets/100ss/ss-usermanagement.png)
![Product Listing](client/src/assets/100ss/ss-productlisting.png)
![Weekly Sales](client/src/assets/100ss/ss-weekly.png)
![Annual Sales](client/src/assets/100ss/ss-annually.png)
![Monthly Sales](client/src/assets/100ss/ss-monthly.png)
![Pending Orders](client/src/assets/100ss/ss-pending.png)
![Completed Orders](client/src/assets/100ss/ss-completed.png)
![Cancelled Orders](client/src/assets/100ss/ss-cancel.png)

