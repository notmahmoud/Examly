# Quizix 🚀

![Quizix Banner](https://via.placeholder.com/1200x400.png?text=Quizix+-+Real-time+Quiz+%26+Assessment+Platform)

**Quizix** is a modern, real-time quiz and assessment platform designed with a clean, Typeform-inspired aesthetic. Built for educators and organizations, it allows seamless creation, hosting, and participation in live interactive exams.

## ✨ Key Features

- **Real-Time Synchronization**: Instantaneous updates between host and participants using Firebase Realtime Database.
- **Dynamic Exam Rooms**: Dedicated, frictionless participant environments with robust timer tracking and anti-cheat measures.
- **Live Host Lobby**: Real-time participant tracking, session management, and live control over the exam flow.
- **Analytics & Reporting**: Comprehensive host reports and individual student result views after exam completion.
- **Typeform-Inspired UI**: A professional, minimalist design system featuring a warm off-white (`#FAF9F7`) background, clean white surfaces, and teal (`#0D9488`) primary accents.
- **Secure Authentication**: Built-in authentication and role-based routing to ensure exam integrity.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 + Vanilla CSS Modules
- **Backend/Database**: Firebase (Realtime Database & Authentication)
- **HTTP Client**: Axios

## 🏗️ Architecture

Quizix leverages a custom hook architecture to manage complex real-time state and database operations:
- `useQuizSession`: Manages the student's active exam state, timer, and answers.
- `useHostLobby`: Controls the host's view, managing waiting rooms and launching exams.
- `useCreateQuiz`: Handles the formulation, validation, and database insertion of new exams.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Firebase project with Realtime Database and Authentication enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/quizix.git
   cd quizix
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_DATABASE_URL=your_database_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```


## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/quizix/issues).

## 📄 License

This project is open-sourced under the [MIT License](LICENSE).

---
*This project was developed as a comprehensive graduation capstone project, demonstrating full-stack real-time application development.*
