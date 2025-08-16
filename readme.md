# DevTinder Backend

DevTinder is a backend project built with **Node.js, Express, and MongoDB**.  
It provides APIs for user authentication, profile management, and connection requests — similar to how Tinder works, but for developers.  
The goal is to help developers connect, collaborate, and build together.

---

## 🚀 Features
- User Signup, Login, Logout
- Profile View, Edit, and Password Update
- Send and Review Connection Requests
- View Connections and Requests
- Developer Feed (discover other developers)

---

## 🔑 Available APIs
- **Auth**: `/signup`, `/login`, `/logout`  
- **Profile**: `/profile/view`, `/profile/edit`, `/profile/password`  
- **Requests**: `/request/send/:status/:userId`, `/request/review/:status/:requestId`  
- **Users**: `/user/connections`, `/user/requests`, `/feed`

---

## ⚙️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/safi-is-coding/DevTinder-Backend.git
   cd DevTinder-Backend
   ```

2. Install dependencies:

    ```bash
    npm install
    ```
    
3. Create a .env file in the root folder and add:

    ```
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    ```

4. Start the server:

    ```
    npm start
    ```
    Server will run at: http://localhost:3000

## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

## 🎯 Learning Outcomes

Through this project, I gained hands-on experience in:

- Structuring backend applications for scalability
- Implementing authentication & authorization securely
- Writing clean, reusable code with Express.js
- Managing database models with MongoDB & Mongoose