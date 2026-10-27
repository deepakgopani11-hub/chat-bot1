# 🏛️ KGK Group Real Estate — AI Property Concierge & Appointment System

A specialized, luxury AI Concierge and Appointment Booking System trained on authentic domain knowledge from **[KGK Group Real Estate (KGK Realty)](https://www.kgkgroup.com/our-business/real-estate)** (`kgkrealty.com`).

Anchored with interactive VIP site visit scheduling, RERA compliance validation, project portfolio exploration across **Jaipur, Mumbai (MMR), and Delhi NCR**, audio chimes, and a **Python backend server**.

---

## 💎 Trained Domain Knowledge (KGK Group Real Estate)

The chatbot has been trained with comprehensive real estate intelligence collected directly from `kgkgroup.com/our-business/real-estate` and `kgkrealty.com`:

### 1. Heritage & Philosophy
- **Founded**: 1905 (over **115+ years** of global excellence).
- **Global Presence**: Multinational conglomerate operating across 15+ countries in gems, diamonds, fine jewelry, manufacturing, mining, retail, education, and healthcare.
- **Real Estate Inception**: Expanded into real estate development in **2010** under the philosophy *"A Passion for Excellence, Built to Last"* and *"Transforming Spaces into Landmarks"*, bringing diamond-grade precision, zero debt reliance, and transparent governance to property development.

### 2. Landmark Projects Portfolio
- **KGK Aarohan (C-Scheme, Jaipur)**: Ultra-luxury 4 & 5 BHK Sky Residences & Penthouses (`RAJ/P/2017/385`). Private elevators, infinity rooftop pool, panoramic Central Park views (₹3.5 Cr – ₹7.5 Cr).
- **KGK Sarvam (Tonk Road, Jaipur)**: 3, 4 & 5 BHK luxury residences (`RAJ/P/2018/742`). Stepped-terrace architecture, 80% open greens, multi-level clubhouse near Jawahar Circle and Airport (₹1.15 Cr – ₹2.85 Cr).
- **KGK Lehariya (Airport Road, Jaipur)**: Grade-A commercial landmark (`RAJ/P/2022/1943`). Double-height high-street retail showrooms & corporate office suites inspired by Rajasthan's Lehariya weave (₹55 Lakh – ₹6.5 Cr).
- **KGK Aahvan (Vaishali Nagar, Jaipur)**: 3, 4 & 5 BHK luxury family apartments (`RAJ/P/2021/1594`) with temperature-controlled pool, spa, and individual EV charging.
- **KGK Akshar & Amulya (Mansarovar Ext & Jagatpura, Jaipur)**: Contemporary 2, 3 & 4 BHK family apartments with Vaastu compliance and direct metro/airport connectivity (₹45 Lakh – ₹1.35 Cr).
- **RSM Athena & RSM Crystal (Ulwe, Navi Mumbai)**: 1, 2 & 3 BHK high-rises (`P52000021980`) situated 10 mins from the upcoming Navi Mumbai International Airport (NMIA) and Atal Setu (MTHL).
- **Sare Gurugram (Delhi NCR)**: Revival and handover of 1,200+ unit integrated township near Dwarka Expressway.

### 3. VIP Appointment & Site Visit Booking System
- **Interactive In-Chat Booking Wizard**: Prospective buyers can book an in-person site visit, virtual video tour, or private office consultation directly inside the chat dialog.
- **Instant Booking Confirmation**: Generates a verified Appointment Ticket with Booking Reference ID (`KGK-APT-XXXX`), chosen date, morning/afternoon/evening time slot, and meeting point.
- **Assigned Relationship Manager**: Assigns a senior property advisor with direct phone contact for a personalized walkthrough.
- **Live Status Lookup**: Prospective buyers can check or verify their existing appointment status anytime by providing their ID (e.g. `#KGK-APT-2024`, `#KGK-APT-5102`, `#KGK-APT-7819`).

### 4. General Customer Questions (FAQs) Covered
- **RERA Compliance & Clear Titles**: Explains registration numbers, 100% freehold non-encumbered land parcels, and escrow safety.
- **Pricing & Payment Plans**: Explains Construction-Linked Plans (CLP), down-payment schemes, and bank tie-ups.
- **Banking Partners**: Pre-approved home loan support with **SBI, HDFC Bank, ICICI Bank, Axis Bank, and Bank of Baroda**.
- **Amenities**: Clubhouses, infinity pools, badminton/squash courts, EV charging stations, solar lighting, rainwater harvesting, and 24/7 multi-tier security.
- **Locations & Proximities**: Distance to Jaipur International Airport, World Trade Park, C-Scheme Central Park, Vaishali Nagar, and Navi Mumbai NMIA/MTHL.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Optional: Add Gemini AI Key for Generative Answers
Create or update your `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```
*(If left empty, the bot automatically utilizes the rich built-in KGK Real Estate rule engine and appointment scheduler).*

### 3. Start the Python Backend Server
```bash
python app.py
```
Open **http://localhost:5000/** in your browser to experience the Concierge!

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns backend status (`brand: KGK Group Real Estate`, `division: KGK Realty`) |
| `GET` | `/api/projects` | Catalog of all 9+ landmark projects across Jaipur, Mumbai, and Delhi |
| `POST` | `/api/chat` | Send `{ "message": "...", "session_id": "..." }` to query the concierge |
| `POST` | `/api/appointment/book` | Schedule a site visit or consultation; returns confirmation ticket with ID |
| `GET` | `/api/appointment/<id>` | Look up appointment status by ID (e.g. `KGK-APT-2024`) |

---

## 🏛️ Office & Contact Details

- **Jaipur Global Headquarters**: KGK Realty (India) Limited, E.P. Campus, Near Jawahar Circle, JLN Marg, Jaipur, Rajasthan 302017
- **Mumbai Office**: 3rd Floor, KGK Tower II, Dattapada Road, Borivali (East), Mumbai 400066
- **Phone / Sales Desk**: `+91 98296 25004` / `08071822869`
- **WhatsApp Concierge**: `+91 88241 00200`
- **Email**: `sales@kgkrealty.com` | `contact@kgkrealty.com`
- **Official Website**: `https://kgkrealty.com/` | `https://www.kgkgroup.com/our-business/real-estate`