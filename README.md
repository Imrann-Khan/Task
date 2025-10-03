# Simple Notes App

A modern, full-stack note-taking application that allows users to create, edit, and manage notes securely through JWT authentication.

## Features

- **User Authentication:**
  - Sign up and log in using a secure JWT-based authentication system.
  
- **Notes Management:**
  - Create, edit, and view personal notes with a responsive UI.
  
- **Clean Architecture:**
  - A modular backend using Node.js, Express, and Mongoose, and a fast, modern frontend built with React and Vite.

## Technologies Used

- **Backend:**
  - Node.js
  - Express
  - Mongoose
  - JSON Web Tokens (JWT)

- **Frontend:**
  - React
  - Vite
  - React Modal
  - React Icons

- **Database:**
  - MongoDB

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Imrann-Khan/Task.git
   cd Task
   ```

2. **Setup the Backend:**

   - Navigate to the backend folder:
   
     ```bash
     cd backend
     ```
   
   - Install dependencies:
   
     ```bash
     npm install
     ```
   
   - Create a `.env` file in the backend folder with your environment variables:
   
     ```env
     ACCESS_TOKEN_SECRET=your_jwt_secret
     MONGODB_URI=your_mongodb_connection_string
     ```
   
   - Start the backend server:
   
     ```bash
     npm start
     ```

3. **Setup the Frontend:**

   - Navigate to the frontend app folder:
   
     ```bash
     cd ../frontend/notes-app
     ```
   
   - Install dependencies:
   
     ```bash
     npm install
     ```
   
   - Start the frontend development server:
   
     ```bash
     npm run dev
     ```

## Usage

- **User Authentication:**
  Users can sign up or log in to receive a JWT token required for accessing and managing their notes.
  
- **Managing Notes:**
  Once authenticated, users are able to create, edit, and view notes. The frontend consumes the backend APIs to provide a seamless experience.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to enhance the functionality or fix any bugs.

## License

This project is open source and available under the [MIT License](LICENSE).
