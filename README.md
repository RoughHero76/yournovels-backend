# YourNovels Backend

This repository contains the backend code for YourNovels, a platform for authors to publish and share their novels with readers.

## Introduction

YourNovels Backend is the server-side application responsible for handling user authentication, novel management, and chapter creation for the YourNovels platform. It provides a RESTful API for frontend clients to interact with the database and perform CRUD operations on users, novels, and chapters.

## Features

- User authentication (register, login)
- Novel management (create, read, update, delete)
- Chapter creation for novels
- JWT-based token authentication
- Error handling and validation
- MongoDB database integration

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

## Getting Started

To set up the YourNovels Backend locally, follow these steps:

1. Clone the repository: `git clone https://github.com/YourUsername/yournovels-backend.git`
2. Install dependencies: `npm install`
3. Set up environment variables: Create a `.env` file in the root directory and define the required variables (e.g., `MONGODB_URI`, `JWT_SECRET_TOKEN`)
4. Start the server: `npm start`

## API Endpoints

- **POST /register**: Register a new user
- **POST /login**: Authenticate user and generate JWT token
- **POST /novels**: Create a new novel (requires authentication)
- **GET /mynovels**: Get novels authored by the authenticated user
- **POST /novels/:novelId/chapters**: Add a new chapter to a novel (requires authentication)

**This respo is under work**

For a detailed description of each endpoint and their usage, check the code

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
