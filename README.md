# CollabSync Backend

CollabSync is a collaborative video content management platform that allows YouTubers and content creators to manage their video production workflow. This backend repository contains the server-side code for CollabSync.

## Features

- User authentication and role management for creators and editors.
- Video uploading and approval workflows.
- Integration with YouTube for video uploads.
- AI-powered suggestions for video content.

## Technologies Used

- **Node.js**: Backend server runtime.
- **Express.js**: Web application framework for Node.js.
- **Firebase Firestore**: NoSQL database for storing user, workspace, and video data.
- **Next-Auth with Google Provider**: For user authentication and authorization.
- **OpenAI GPT-3.5 Turbo**: For generating video metadata suggestions.

### Nerd-facts
- **Swagger UI**: API documentation and testing tool.
- **Morgan**: HTTP request logger middleware.
- **Helmet**: Middleware for securing HTTP headers.
- **Cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **YAML**: Used for defining the OpenAPI specification.
- **Swagger-UI-Express**: For rendering the Swagger documentation.

## Getting Started

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/rudrodip/CollabSync-Backend.git
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on the provided `.env.example`. You'll need to configure Firebase and other environment variables.

4. Start the server:

   ```bash
   npm start
   ```

5. Access the API documentation and test the endpoints by visiting `http://localhost:5000` in your browser.

## Firebase Configuration

CollabSync uses Firebase to manage user accounts and data. To set up Firebase in your own project, follow these steps:

1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Click on "Add Project" to create a new Firebase project.
   - Follow the setup instructions, including choosing a project name and enabling Firebase services (such as Firestore, Authentication, etc.) as needed for your project.

2. **Generate `serviceAccountKey.json`**:
   - In the Firebase Console, go to Project Settings.
   - Navigate to the "Service accounts" tab.
   - Under the "Firebase Admin SDK" section, click on "Generate new private key." This will download the `serviceAccountKey.json` file to your computer.

3. **Store `serviceAccountKey.json` Securely**:
   - Place the downloaded `serviceAccountKey.json` file in a secure location within your project `src` directory. Keep this file confidential and do not expose it publicly.

4. **Configure Firebase in Your Project**:
   - In your Node.js backend code, configure Firebase Admin SDK to use the `serviceAccountKey.json` file for authentication. You can refer to the existing code in CollabSync's backend for guidance.

**Note:** Do not share your `serviceAccountKey.json` file or credentials with others, as it grants access to your Firebase project.

With Firebase set up in your project, you can now run CollabSync's backend server and use its API endpoints.

If you encounter any issues or have questions about Firebase configuration, please refer to the [Firebase documentation](https://firebase.google.com/docs) for detailed information and support.


## API Documentation

The API endpoints are documented using Swagger UI. You can access the API documentation at `http://localhost:5000`.

## Contributing

We welcome contributions to improve CollabSync! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m "Description of your changes"`.
4. Push your changes to your fork: `git push origin feature-name`.
5. Create a pull request against the `main` branch of this repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the open-source community for providing the tools and libraries used in this project.
- Special thanks to OpenAI for providing the GPT model