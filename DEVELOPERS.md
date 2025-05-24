# 🛠️ ParentTeacherPortal – Developer Setup Guide

Welcome aboard! This guide will help you get the project up and running on your local machine.

---

## 🚀 Tech Stack

- **Backend**: ASP.NET Core Web API + EF Core + Identity
- **Frontend**: React + TailwindCSS
- **Database**: SQLite
- **Authentication**: JWT + Role-based authorization

---

## 🧹 Prerequisites

Make sure you have the following installed:

### 🔧 Backend

- [.NET 7 SDK](https://dotnet.microsoft.com/download)
- [Visual Studio 2022+](https://visualstudio.microsoft.com/) with ASP.NET & EF Core workloads
- EF CLI (optional but helpful):

  ```bash
  dotnet tool install --global dotnet-ef
  ```

### 💻 Frontend

- [Node.js (v16+)](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A modern code editor (e.g., VS Code)

---

## 📁 Project Structure

```
ParentTeacherPortal/
├── ParentTeacherAPI/            → .NET Core Web API
├── parentteacherfrontend/       → React frontend
├── ParentTeacherPortal.sln      → Visual Studio solution file
└── parent_teacherportal.db      → SQLite DB (can be auto-created)
```

---

## ⚙️ Step-by-Step Setup

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/learnwith-Sid/ParentTeacherPortal.git
cd ParentTeacherPortal
```

---

### 2️⃣ Backend Setup (.NET API)

```bash
cd ParentTeacherAPI
```

#### ✅ Restore NuGet Packages

```bash
dotnet restore
```

#### 🔧 Update Connection String (optional)

Check `appsettings.json` for:

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=parent_teacherportal.db"
}
```

#### 📂 Run EF Core Migrations (if DB not present)

```bash
dotnet ef database update
```

#### ▶️ Run the API

```bash
dotnet run
```

The backend will typically run on:
👉 `https://localhost:5001` or `http://localhost:5000`

---

### 3️⃣ Frontend Setup (React App)

```bash
cd ../parentteacherfrontend
```

#### 📦 Install Dependencies

```bash
npm install
```

#### 🛠️ Create `.env` file

```env
REACT_APP_API_BASE_URL=https://localhost:5001/api
```

Adjust if your backend runs on a different port.

#### ▶️ Start React App

```bash
npm start
```

Runs on:
👉 `http://localhost:3000`

---

## 🔐 Default Roles

- `SuperAdmin` – Can manage schools and admins.
- `Admin` – School-specific admin.
- `Teacher`, `Parent`, `Student` – User roles (coming soon).

Use Postman or Swagger to create the first SuperAdmin manually, or seed one.

---

## ✅ Development Tips

- Use Swagger (`/swagger`) for testing APIs.
- Enable CORS in `Program.cs` to connect frontend properly.
- Commit meaningful messages (you’re a dev, not a DJ 🎧).
- Structure new API endpoints in `Controllers/` and match frontend routes accordingly.
- Use `SchoolCode` as a key for multi-tenancy logic.

---

## 🩵 Common Troubleshooting

| Problem               | Fix                                           |
| --------------------- | --------------------------------------------- |
| React can't reach API | Check `.env` file, proxy config, or CORS      |
| EF Migrations fail    | Check if DB already exists or migration order |
| SSL Issues            | Try launching API via `http://localhost:5000` |

---

## 📞 Support

Feel stuck? Ping the lead dev (a.k.a. Sid) or drop a message in the dev group chat. Or just bribe ChatGPT with pizza 🍕

---
