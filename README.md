# 🤖 Customer Support AI Chatbot

A modern, responsive customer support chatbot widget designed for website integration. Anchored in the **bottom-left corner** with floating trigger badge, typing indicators, quick reply chips, Web Audio sound effects, and a **Python backend** server.

---

## 🚀 Features

- **Bottom-Left Floating Widget**: Unobtrusive launcher button with pulsing badge, unread counter, and smooth open/close micro-animations.
- **Python Backend (`app.py`)**:
  - Built with **Flask** and **Flask-CORS** (with zero-dependency fallback to Python standard library).
  - Intent recognition for customer queries: greetings, pricing plans, order tracking, returns, live agent queue, and FAQs.
  - Live mock database for order lookups (e.g. `#ORD-88219`, `#ORD-10423`).
  - Session history memory and health check endpoints.
- **Client Fallback**: Automatically falls back to client-side rule matching if the Python server is offline.
- **Rich Modern UI**:
  - Glassmorphic dark theme with Google Font (*Plus Jakarta Sans*).
  - Web Audio API chimes for sending and receiving messages.
  - LocalStorage chat persistence across page refreshes.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Python Backend
```bash
python app.py
```

The server will start at **http://localhost:5000/** and serve both the frontend UI and the REST API.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns backend status and timestamp |
| `POST` | `/api/chat` | Send `{ "message": "...", "session_id": "..." }` to get AI response & quick chips |
| `GET` | `/api/orders/<id>` | Lookup order delivery details by Order ID |

---

## 🌐 Deployment Guide

### Option 1: Deploy on Render (Recommended for Python full-stack)
1. Push your repository to GitHub.
2. Sign in to [render.com](https://render.com) and click **New + > Web Service**.
3. Connect your repository `chat-bot1`.
4. Render will auto-detect settings, or configure:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. Click **Deploy Web Service**!

### Option 2: Deploy on Vercel
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New > Project**.
3. Import `chat-bot1`.
4. Vercel automatically detects `vercel.json` and `api/index.py`.
5. Click **Deploy**!