# 🎥 video-meet-ai-module

A smart video interview platform built with Node.js, TypeScript, and React. HR managers can create, schedule, and manage AI-assisted video interviews, while candidates can join, accept, or reject interviews.

---

## 🚀 Features

- 🧑‍💼 HR & Candidate roles
- 📅 Schedule & manage interviews (CRUD)
- 🎥 Video interview rooms (Daily.co & Jitsi integration)
- 🔐 JWT-based authentication
- ✅ Candidates can apply, accept/reject interviews
- 🧠 AI module integration placeholder

---

## 📦 Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Frontend:** React (TypeScript)
- **Video:** Daily.co, Jitsi

---

## 🛠️ Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/AhmedBnHmida/ai-video-meet.git
cd ai-video-meet
```

### 2. Setup the Backend

```sh
cd server
npm install
```

- Create a `.env` file in the `server/` directory:
  ```
  DAILY_API_KEY=your_daily_co_api_key
  JWT_SECRET=your_jwt_secret
  ```

- Start MongoDB locally (default: `mongodb://localhost:27017/videoMeetAI`).

- Build and start the backend:
  ```sh
  npm run build
  npm start
  ```
  Or for development with hot-reload:
  ```sh
  npm run dev
  ```

### 3. Setup the Frontend

```sh
cd ../client
npm install
npm start
```

- The React app will run on [http://localhost:3000](http://localhost:3000).

---

## 🔗 API Endpoints

- **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- **Users:** `/user/GetAll`, `/user/GetById/:id`, etc.
- **Applications:** `/application/Add`, `/application/GetByUser/:userId`, etc.
- **Interviews:** `/interview/Add`, `/interview/GetAll`, `/interview/GetByUser/:userId`, etc.

---

## 👩‍💻 Development Notes

- **Frontend:** Edit files in `client/src/`. Main entry: [`App.tsx`](client/src/App.tsx)
- **Backend:** Edit files in `server/src/`. Main entry: [`app.ts`](server/src/app.ts)
- **Video Rooms:** Uses Daily.co for video interviews (`/room/:roomId`) and Jitsi as fallback (`/meeting/:roomId`).

---

## 📝 Usage

1. Register as a user (HR or Candidate).
2. HR can create job postings and schedule interviews.
3. Candidates can apply for jobs and join interviews via video rooms.
4. All actions are protected by JWT authentication.

---

## 🧪 Testing

- Backend: Use tools like Postman to test API endpoints.
- Frontend: Use the UI to register, login, and perform actions.

---

## ❓ FAQ

- **MongoDB required?** Yes, make sure MongoDB is running locally.
- **Video API keys?** You need a [Daily.co](https://www.daily.co/) API key for video rooms.

---

## 📬 Contact

For issues or contributions, open an issue or PR on [GitHub](https://github.com/AhmedBnHmida/ai-video-meet.git).

---

Enjoy building with video-meet-ai-module! 🚀