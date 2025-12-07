**Cardio Monitoring App**

This web application is a full-stack Single Page Application (SPA) built to explore recent innovations in healthcare, with a focus on AI-Driven Real-Time Monitoring of Cardiovascular Conditions Using Wearable Devices. The platform allows users to log in securely using JWT authentication and then access three main sections: Dashboard, Summary, and Reports.

The Dashboard presents an overview of the selected research article, summarizing key findings about how AI-powered wearable devices such as smartwatches and sensor-based monitors are being used to detect and analyze cardiovascular signals in real time. The Summary page features an interactive bar chart showing the geographic distribution of studies included in the review, while the Reports page displays a donut chart highlighting the primary cardiovascular conditions analyzed, with Atrial Fibrillation (AF) being the most studied condition. Both charts retrieve data dynamically from the backend using authenticated API requests.

The frontend is developed using Angular, while the backend is built with Node.js and Express, connected to a MongoDB database. The application is hosted on a single server with NGINX serving the Angular frontend and the Node backend running on port 3000. Accessibility considerations (ARIA labels, keyboard navigation, and semantic HTML) are incorporated throughout the UI. Overall, the app provides a functional, modern, and accessible interface to explore real-world healthcare innovation data.

----------------------------------------------------------------------------------------------
🚀**Features**

User authentication (Signup + Login)

Dashboard with cardiovascular metric visualizations

Modern, responsive UI

Fully connected MongoDB backend

REST API for live and simulated health data

Role-based, scalable architecture

----------------------------------------------------------------------------------------------
🔐**Login Credentials**

**You can either:**

Create a new account using the Signup page, OR

**Use the default test user:**
Username: Eshita
Password: Eshita

----------------------------------------------------------------------------------------------
🛠️ **Prerequisites**

**Make sure the following are installed:**

Node.js (v14 or higher)

MongoDB

----------------------------------------------------------------------------------------------
▶️**How to Run the Project**
1. Start the Backend

The backend runs on port 3000.

cd backend

npm install

npm start

**Expected output:**
Server running on port 3000

MongoDB connected

2. Start the Frontend

The Angular frontend runs on port 4200, mapped to port 80 for convenience.

cd frontend

npm install

npm start


**Once running, open your browser:**
http://localhost:80
