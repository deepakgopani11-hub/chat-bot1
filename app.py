import os
import sys
import json
import re
import uuid
from datetime import datetime
from typing import Dict, Any, List

# Ensure safe UTF-8 terminal encoding on Windows
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
if hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Try importing Flask and Flask-CORS. If not installed, a lightweight fallback server will be used.
try:
    from flask import Flask, request, jsonify, send_from_directory
    from flask_cors import CORS
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False

# ==============================================================================
# KGK GROUP REAL ESTATE (KGK REALTY) - DOMAIN KNOWLEDGE & DATA STORE
# ==============================================================================

# Projects Portfolio
PROJECTS_CATALOG = [
    {
        "id": "aarohan",
        "name": "KGK Aarohan",
        "city": "Jaipur",
        "location": "C-Scheme, Central Jaipur",
        "type": "Ultra-Luxury Residential",
        "configurations": "4 & 5 BHK Sky Residences & Penthouses",
        "price_range": "₹3.5 Cr – ₹7.5 Cr",
        "status": "Ready to Move / Select Towers Under Finishing",
        "rera": "RAJ/P/2017/385",
        "highlights": [
            "Prime C-Scheme address overlooking Central Park & heritage greens",
            "Exclusive private elevators & double-height designer lobby",
            "Infinity rooftop swimming pool & skyline observation deck",
            "Smart home automation with 3-tier biometrics"
        ]
    },
    {
        "id": "sarvam",
        "name": "KGK Sarvam",
        "city": "Jaipur",
        "location": "Tonk Road (Near Jawahar Circle)",
        "type": "Luxury Residential Apartments",
        "configurations": "3, 4 & 5 BHK High-Rise Apartments",
        "price_range": "₹1.15 Cr – ₹2.85 Cr",
        "status": "Ready to Move & Possession Ongoing",
        "rera": "RAJ/P/2018/742",
        "highlights": [
            "Distinctive stepped-terrace architectural design",
            "Grand independent multi-level clubhouse with indoor badminton courts",
            "Minutes from Jaipur International Airport and World Trade Park",
            "80% landscaped open green spaces with reflexology pathways"
        ]
    },
    {
        "id": "aahvan",
        "name": "KGK Aahvan",
        "city": "Jaipur",
        "location": "Vaishali Nagar, West Jaipur",
        "type": "Premium Residential Apartments",
        "configurations": "3, 4 & 5 BHK Luxury Living",
        "price_range": "₹95 Lakh – ₹2.25 Cr",
        "status": "Under Construction (Advanced Stage)",
        "rera": "RAJ/P/2021/1594",
        "highlights": [
            "Nestled in the upscale Vaishali Nagar cosmopolitan neighborhood",
            "Resort-style temperature-controlled swimming pool & spa",
            "EV charging infrastructure for every parking bay",
            "Surrounded by premier international schools and dining hubs"
        ]
    },
    {
        "id": "akshar",
        "name": "KGK Akshar",
        "city": "Jaipur",
        "location": "Mansarovar Extension",
        "type": "Contemporary Residential Living",
        "configurations": "3 & 4 BHK Family Apartments",
        "price_range": "₹68 Lakh – ₹1.35 Cr",
        "status": "Ready to Move",
        "rera": "RAJ/P/2019/1102",
        "highlights": [
            "Direct connectivity to Ring Road and metro corridor",
            "Modern clubhouse, gym, banquet hall, and kids' play zones",
            "Vaastu-compliant floor layouts with ample cross-ventilation"
        ]
    },
    {
        "id": "amulya",
        "name": "KGK Amulya",
        "city": "Jaipur",
        "location": "Jagatpura (Near Mahal Road)",
        "type": "Modern Urban Residential",
        "configurations": "2 & 3 BHK Apartments",
        "price_range": "₹45 Lakh – ₹85 Lakh",
        "status": "Ready to Move",
        "rera": "RAJ/P/2020/1287",
        "highlights": [
            "Proximity to Bombay Hospital, leading universities & IT hubs",
            "Gated community with landscaped central courtyard",
            "Ideal for modern professionals and first-time home buyers"
        ]
    },
    {
        "id": "lehariya",
        "name": "KGK Lehariya",
        "city": "Jaipur",
        "location": "Airport Road, Jawahar Circle",
        "type": "Grade-A Commercial Landmark",
        "configurations": "Retail Showrooms, High-Street Stores & Corporate Office Suites",
        "price_range": "₹55 Lakh – ₹6.5 Cr",
        "status": "Under Construction (Possession Soon)",
        "rera": "RAJ/P/2022/1943",
        "highlights": [
            "High-street frontage on the busiest airport corridor",
            "Architectural facade inspired by Rajasthan's heritage Lehariya weave",
            "High-speed escalators, multi-level basement parking & food court arena",
            "Unrivaled brand visibility for retail & enterprise headquarters"
        ]
    },
    {
        "id": "aakar",
        "name": "KGK Aakar",
        "city": "Jaipur",
        "location": "Jagatpura, Jaipur",
        "type": "Mixed-Use Retail & Commercial",
        "configurations": "Commercial High-Street Shops & Offices",
        "price_range": "₹35 Lakh – ₹1.9 Cr",
        "status": "Ready to Fit-Out",
        "rera": "RAJ/P/2021/1672",
        "highlights": [
            "Vibrant retail spaces beneath high-density residential towers",
            "Ample surface parking and broad pedestrian promenades",
            "High daily footfalls guaranteed by surrounding residential population"
        ]
    },
    {
        "id": "athena",
        "name": "RSM Athena (KGK Realty)",
        "city": "Mumbai (MMR)",
        "location": "Ulwe, Navi Mumbai",
        "type": "Residential-cum-Commercial High-Rise",
        "configurations": "1, 2 & 3 BHK Apartments + Retail",
        "price_range": "₹52 Lakh – ₹1.45 Cr",
        "status": "Ready / Finishing",
        "rera": "P52000021980",
        "highlights": [
            "10 minutes from upcoming Navi Mumbai International Airport (NMIA)",
            "Adjacent to Bamandongri / Kharkopar railway stations and Atal Setu (MTHL)",
            "Modern clubhouse with rooftop recreation and sea breeze orientation"
        ]
    },
    {
        "id": "sare_gurugram",
        "name": "Sare Gurugram Project",
        "city": "Delhi NCR",
        "location": "Sector 92, Gurugram",
        "type": "Integrated Residential Township",
        "configurations": "2, 3 & 4 BHK High-Rise Residences",
        "price_range": "₹80 Lakh – ₹1.8 Cr",
        "status": "Revival & Possession Handover Phase",
        "rera": "HRERA-PKL-GGM-124-2018",
        "highlights": [
            "KGK Realty & Dhoot Infrastructure consortium project revival",
            "Direct access to Dwarka Expressway and NH-48",
            "Sprawling multi-acre master community with functional clubhouse"
        ]
    }
]

# In-Memory Appointments Storage (Pre-seeded with real-world examples)
APPOINTMENTS_STORE: Dict[str, Dict[str, Any]] = {
    "KGK-APT-2024": {
        "id": "KGK-APT-2024",
        "name": "Rajesh Sharma",
        "phone": "+91 98290 11223",
        "email": "rajesh.sharma@example.com",
        "project": "KGK Sarvam (Tonk Road, Jaipur)",
        "type": "Site Visit & Model Flat Tour",
        "date": "2026-11-05",
        "slot": "11:30 AM – 1:00 PM (Morning Slot)",
        "status": "Confirmed & Relationship Manager Assigned",
        "rm_name": "Vikram Rathore",
        "rm_phone": "+91 98296 25004",
        "meeting_point": "KGK Sarvam Experience Gallery, Tonk Road, Jaipur",
        "notes": "Looking for 4 BHK pool-facing corner unit."
    },
    "KGK-APT-5102": {
        "id": "KGK-APT-5102",
        "name": "Anita Singhania",
        "phone": "+91 98211 44556",
        "email": "anita.s@example.com",
        "project": "KGK Aarohan (C-Scheme, Jaipur)",
        "type": "Private Sky-Residence Consultation",
        "date": "2026-11-08",
        "slot": "3:00 PM – 4:30 PM (Afternoon Slot)",
        "status": "Confirmed & Relationship Manager Assigned",
        "rm_name": "Priyanka Mehta",
        "rm_phone": "+91 88241 00200",
        "meeting_point": "KGK Aarohan Lounge, C-Scheme, Jaipur",
        "notes": "Interested in duplex penthouse with private terrace."
    },
    "KGK-APT-7819": {
        "id": "KGK-APT-7819",
        "name": "Amit Deshmukh",
        "phone": "+91 98200 99887",
        "email": "amit.deshmukh@example.com",
        "project": "RSM Athena (Ulwe, Navi Mumbai)",
        "type": "Virtual Video Walkthrough",
        "date": "2026-11-02",
        "slot": "5:00 PM – 5:45 PM (Evening Slot)",
        "status": "Confirmed — Video Link Sent",
        "rm_name": "Rohan Deshmukh",
        "rm_phone": "+91 22 4028 8888",
        "meeting_point": "Google Meet / Zoom (Link sent via WhatsApp & Email)",
        "notes": "NRI investment evaluation."
    }
}

# ==============================================================================
# FAQS & INTENT RULES DATABASE (TRAINED ON KGK GROUP REAL ESTATE)
# ==============================================================================

FAQ_RULES = [
    {
        "intent": "greeting",
        "keywords": [
            "hi", "hello", "hey", "namaste", "greetings", "good morning", "good evening", 
            "start", "help", "who are you", "what can you do"
        ],
        "reply": (
            "Namaste & Welcome to **KGK Group Real Estate** (KGK Realty)! 🏛️✨\n\n"
            "Carrying a **115+ year global legacy of trust, craftsmanship, and precision**, "
            "we develop premier residential landmarks, grade-A commercial complexes, and industrial hubs "
            "across **Jaipur, Mumbai, and Delhi NCR**.\n\n"
            "How may I assist you today? You can explore our landmark projects, book a private site visit, "
            "inquire about pricing & RERA details, or check an existing appointment."
        ),
        "chips": [
            "📅 Book Site Visit",
            "🏢 Landmark Projects",
            "📍 Jaipur Projects",
            "🌊 Mumbai Projects",
            "💎 About KGK Group",
            "📋 RERA & Trust",
            "🔍 Check Appointment"
        ]
    },
    {
        "intent": "projects_all",
        "keywords": [
            "project", "projects", "properties", "portfolio", "developments", 
            "catalogue", "catalog", "apartments", "flats", "villas", "towers"
        ],
        "reply": (
            "Here is the distinguished property portfolio of **KGK Realty**:\n\n"
            "🏛️ **Ultra-Luxury & Luxury Residential (Jaipur)**:\n"
            "• **KGK Aarohan (C-Scheme)**: 4 & 5 BHK Sky Residences in Jaipur's most prestigious central district.\n"
            "• **KGK Sarvam (Tonk Road)**: 3, 4 & 5 BHK stepped-terrace apartments with independent clubhouse near Jawahar Circle.\n"
            "• **KGK Aahvan (Vaishali Nagar)**: 3, 4 & 5 BHK luxury residences in the prime West Jaipur corridor.\n"
            "• **KGK Akshar (Mansarovar Ext.)**: 3 & 4 BHK contemporary family residences with metro connectivity.\n"
            "• **KGK Amulya (Jagatpura)**: 2 & 3 BHK modern apartments near Airport & Mahal Road.\n\n"
            "🏢 **Commercial Landmarks (Jaipur)**:\n"
            "• **KGK Lehariya (Airport Road)**: Iconic high-street retail & Grade-A corporate office suites.\n"
            "• **KGK Aakar (Jagatpura)**: High-footfall commercial shopping & business hub.\n\n"
            "🌊 **Mumbai Metropolitan Region (MMR)**:\n"
            "• **RSM Athena & RSM Crystal (Ulwe, Navi Mumbai)**: Strategic high-rises near NMIA airport & Atal Setu.\n\n"
            "Would you like to schedule an in-person site visit or explore pricing for any project?"
        ),
        "chips": [
            "KGK Aarohan (C-Scheme)",
            "KGK Sarvam (Tonk Road)",
            "KGK Lehariya Commercial",
            "📅 Book Site Visit",
            "💰 Pricing & Payment Plans"
        ]
    },
    {
        "intent": "jaipur_projects",
        "keywords": [
            "jaipur", "rajasthan", "pink city", "c-scheme", "tonk road", 
            "vaishali", "jagatpura", "mansarovar", "jawahar circle"
        ],
        "reply": (
            "Jaipur is the home ground and flagship center of **KGK Realty**! 🏰✨\n\n"
            "Our landmark Jaipur developments include:\n\n"
            "1. **KGK Aarohan** (C-Scheme) — *The Pinnacle of Luxury*: 4 & 5 BHK sprawling apartments with panoramic city skyline views.\n"
            "2. **KGK Sarvam** (Tonk Road) — *Modern Grandeur*: 3, 4 & 5 BHK step-architectural homes, 80% open greens, adjacent to Jawahar Circle.\n"
            "3. **KGK Aahvan** (Vaishali Nagar) — *Elite Living*: 3, 4 & 5 BHK flats with world-class clubhouse & infinity pool.\n"
            "4. **KGK Lehariya** (Airport Road) — *Commercial Icon*: Jaipur's finest retail and corporate office destination.\n"
            "5. **KGK Akshar & Amulya** — Modern 2, 3 & 4 BHK homes in Mansarovar Extension and Jagatpura.\n\n"
            "Would you like to reserve a guided site visit with a private vehicle pickup or review RERA details?"
        ),
        "chips": ["📅 Book Jaipur Site Visit", "KGK Aarohan Details", "KGK Sarvam Details", "KGK Lehariya Details"]
    },
    {
        "intent": "mumbai_delhi_projects",
        "keywords": [
            "mumbai", "navi mumbai", "ulwe", "karjat", "khopoli", "delhi", "gurugram", "gurgaon", "ncr", "dmic"
        ],
        "reply": (
            "**KGK Realty Footprint in Mumbai MMR & Delhi NCR** 🏙️\n\n"
            "🌊 **Mumbai Metropolitan Region (MMR)**:\n"
            "• **RSM Athena (Ulwe, Navi Mumbai)**: 14-storey high-rise 1, 2 & 3 BHK residences and commercial shops, situated just 10 mins from the upcoming Navi Mumbai International Airport (NMIA) and Atal Setu (MTHL).\n"
            "• **RSM Crystal (Ulwe)**: Smart compact 1 BHK configurations tailored for investors.\n"
            "• **Unimont Aurum (Karjat) & Unimont Empire (Khopoli)**: Scenic hill-view township residences connecting Mumbai and Pune.\n\n"
            "🏛️ **Delhi NCR & Industrial Corridor**:\n"
            "• **Sare Gurugram (Sector 92)**: Reviving a prime group housing project for 1,200+ families with Dhoot Infrastructure.\n"
            "• **Industrial Parks along DMIC**: Sprawling logistics & manufacturing facilities along the Delhi-Mumbai Industrial Corridor.\n\n"
            "Would you like to book a consultation or virtual walkthrough for Mumbai or Delhi NCR?"
        ),
        "chips": ["RSM Athena (Ulwe)", "📅 Book Mumbai Visit", "Delhi NCR Sare Project", "📞 Contact Mumbai Desk"]
    },
    {
        "intent": "commercial_spaces",
        "keywords": [
            "commercial", "office", "retail", "shop", "shops", "showroom", "business", 
            "store", "investment", "lehariya", "aakar", "commercial space"
        ],
        "reply": (
            "Looking to grow your business or earn high commercial rental yields? 🏢💼\n\n"
            "**KGK Realty's Flagship Commercial Developments**:\n\n"
            "1. **KGK Lehariya (Airport Road, Jawahar Circle, Jaipur)**:\n"
            "• *Concept*: Architectural masterpiece inspired by Rajasthan's Lehariya wave pattern.\n"
            "• *Offerings*: Double-height ground floor retail showrooms, high-street brand spaces, and Grade-A corporate office suites.\n"
            "• *Advantage*: High-traffic Airport corridor with premier exposure and multi-level parking.\n\n"
            "2. **KGK Aakar (Jagatpura, Jaipur)**:\n"
            "• *Concept*: Modern high-street retail arcade integrated with urban residential catchment.\n"
            "• *Offerings*: Flexible commercial shops suited for retail, healthcare, boutique gyms, and cafes.\n\n"
            "Would you like to view commercial floor plans or schedule a site inspection?"
        ),
        "chips": ["KGK Lehariya Floor Plans", "KGK Aakar Details", "📅 Book Commercial Site Visit", "💰 Commercial Pricing"]
    },
    {
        "intent": "appointment_booking_intent",
        "keywords": [
            "appointment", "book appointment", "site visit", "schedule visit", "visit", 
            "tour", "see the flat", "sample flat", "inspect", "book a visit", "consultation"
        ],
        "reply": (
            "We would be honored to host you for a **Private Site Visit & Property Consultation**! 🏛️🚗\n\n"
            "During your visit:\n"
            "• A Dedicated Relationship Manager will guide you through the completed towers, sample apartments, and clubhouse.\n"
            "• Review authentic floor plans, exact carpet areas, and construction quality.\n"
            "• Receive customized payment plan simulations and bank loan quotes.\n\n"
            "👉 **How would you like to schedule?**\n"
            "Click **'📅 Open Booking Form'** below to select your project, date, and preferred time slot, or simply tell me your name, phone number, and preferred project right here!"
        ),
        "chips": ["📅 Open Booking Form", "Jaipur Site Visit", "Mumbai Site Visit", "Virtual Video Tour"]
    },
    {
        "intent": "appointment_status_intent",
        "keywords": [
            "check appointment", "my appointment", "appointment status", "track appointment", 
            "booking status", "lookup appointment", "reschedule"
        ],
        "reply": (
            "I can check the live status of your scheduled visit or consultation! 🔍📅\n\n"
            "Please provide your **Appointment ID** (for example: `#KGK-APT-2024`, `#KGK-APT-5102`, or `#KGK-APT-7819`)."
        ),
        "chips": ["#KGK-APT-2024", "#KGK-APT-5102", "#KGK-APT-7819", "📅 Book New Site Visit"]
    },
    {
        "intent": "rera_legal_trust",
        "keywords": [
            "rera", "legal", "trust", "approval", "raj rera", "maharera", 
            "registration", "possession", "safe", "government approval", "title"
        ],
        "reply": (
            "**100% Transparency, RERA Compliance & Legal Integrity** ⚖️🛡️\n\n"
            "At KGK Realty, we honor the same values that have anchored the **KGK Group for 115+ years**:\n\n"
            "• **RERA Registered**: Every active residential and commercial development is fully registered with Rajasthan RERA or MahaRERA.\n"
            "• **Clear Land Titles**: All projects are built on 100% clear, freehold, fully vetted land parcels free of any encumbrance.\n"
            "• **Financial Security**: Backed by the robust financial foundation of the multinational KGK Group—ensuring timely project execution without reliance on risky debt.\n"
            "• **Escrow Account Mechanism**: All customer funds are handled strictly according to RERA escrow guidelines.\n\n"
            "Official RERA Numbers: Aarohan (`RAJ/P/2017/385`), Sarvam (`RAJ/P/2018/742`), Lehariya (`RAJ/P/2022/1943`), Athena (`P52000021980`)."
        ),
        "chips": ["View Project RERA Numbers", "📅 Book Site Visit", "💎 KGK Legacy Story"]
    },
    {
        "intent": "pricing_payment_plans",
        "keywords": [
            "price", "pricing", "cost", "budget", "rate", "sq ft", "payment plan", 
            "installments", "down payment", "loan", "clp", "discount", "offers"
        ],
        "reply": (
            "**KGK Realty Pricing & Tailored Payment Plans** 💳🏡\n\n"
            "• **Price Indicative Ranges**:\n"
            "  - *KGK Amulya (Jagatpura)*: 2 & 3 BHK starting from **₹45 Lakhs**\n"
            "  - *KGK Akshar (Mansarovar Ext.)*: 3 & 4 BHK from **₹68 Lakhs**\n"
            "  - *KGK Aahvan (Vaishali Nagar)*: 3, 4 & 5 BHK from **₹95 Lakhs**\n"
            "  - *KGK Sarvam (Tonk Road)*: Luxury 3 & 4 BHK from **₹1.15 Cr**\n"
            "  - *KGK Aarohan (C-Scheme)*: Ultra-Luxury 4 & 5 BHK from **₹3.5 Cr**\n"
            "  - *KGK Lehariya (Commercial)*: Retail & Suites from **₹55 Lakhs**\n\n"
            "• **Flexible Payment Plans**:\n"
            "  - **Construction Linked Plan (CLP)**: Pay progressively as construction milestones are completed.\n"
            "  - **Special Down-Payment Schemes**: Lucrative discounts on upfront commitments.\n"
            "  - **Pre-Approved Bank Loans**: Pre-approved by SBI, HDFC Bank, ICICI Bank, Axis Bank, and Bank of Baroda with swift paperwork support."
        ),
        "chips": ["Bank Loan Assistance", "📅 Book Site Visit", "Detailed Cost Sheet", "Commercial Pricing"]
    },
    {
        "intent": "amenities_infrastructure",
        "keywords": [
            "amenities", "clubhouse", "gym", "pool", "swimming pool", "security", 
            "parking", "garden", "sports", "ev charging", "solar", "features"
        ],
        "reply": (
            "**World-Class Amenities Built for Generations** 🏊‍♂️🌿\n\n"
            "KGK Realty projects feature comprehensive lifestyle infrastructure:\n\n"
            "• **Wellness & Leisure**: Olympic-inspired / temperature-controlled swimming pools, infinity rooftop pools, steam & sauna spa rooms.\n"
            "• **Fitness & Sports**: High-tech fitness gymnasiums, air-conditioned indoor badminton courts, squash courts, yoga & meditation lawns.\n"
            "• **Family & Community**: Grand double-height banquet halls, private mini-theatres, children's interactive play zones, and senior citizen reflexology gardens.\n"
            "• **Smart & Green Tech**: Dedicated EV charging points, rainwater harvesting, solar power for common lighting, and high-efficiency double-glazed glass facades.\n"
            "• **Multi-Tier Security**: 24/7 CCTV surveillance, boom barriers with RFID access, and video door phone integrations."
        ),
        "chips": ["KGK Sarvam Amenities", "KGK Aarohan Features", "📅 Schedule a Tour"]
    },
    {
        "intent": "kgk_group_background",
        "keywords": [
            "about", "kgk group", "heritage", "legacy", "history", "founder", 
            "who owns", "kothari", "gems", "jewelry", "jewellery", "company profile"
        ],
        "reply": (
            "**The Legacy of KGK Group — Over a Century of Excellence** 💎✨\n\n"
            "• **Heritage Since 1905**: Founded over 115 years ago by the visionary Kothari family in Jaipur, KGK has evolved into a multi-billion dollar global conglomerate.\n"
            "• **Global Footprint**: Operations spanning across **15+ countries** in Asia, Europe, Africa, North America, and Australia.\n"
            "• **Diverse Leadership**: World leaders in gemstone mining, diamond cutting, fine jewelry manufacturing, and high-end retail.\n"
            "• **Real Estate Entry (2010)**: Guided by the belief that real estate—like diamonds—is a timeless investment of prosperity, KGK Realty was established in 2010 to bring precision, transparency, and architectural elegance to modern skylines.\n"
            "• **Philanthropy**: The KGK Foundation actively leads major healthcare initiatives (Bhagwan Mahaveer Cancer Hospital), education (The Shriram Universal School), and heritage conservation in Rajasthan."
        ),
        "chips": ["Real Estate Journey", "Corporate Social Responsibility", "📅 Book Site Visit"]
    },
    {
        "intent": "contact_offices",
        "keywords": [
            "contact", "phone", "email", "address", "office", "call", "whatsapp", 
            "customer care", "sales office", "headquarters", "reach"
        ],
        "reply": (
            "**KGK Realty Corporate & Sales Contact Points** 📞📍\n\n"
            "🏛️ **Jaipur Global Headquarters**:\n"
            "• KGK Realty (India) Limited, E.P. Campus, Near Jawahar Circle, JLN Marg, Jaipur, Rajasthan 302017\n"
            "• Phone: **+91 98296 25004** / **08071822869**\n"
            "• WhatsApp Concierge: **+91 88241 00200**\n\n"
            "🌊 **Mumbai Corporate Office**:\n"
            "• 3rd Floor, KGK Tower II, Dattapada Road, Rajendra Nagar, Borivali (East), Mumbai 400066\n"
            "• Phone: **+91 22 4028 8888**\n\n"
            "📧 **Official Email**: `sales@kgkrealty.com` | `contact@kgkrealty.com`\n"
            "🌐 **Website**: `https://kgkrealty.com/`\n\n"
            "Our Relationship Managers are available 7 days a week from 9:30 AM to 7:00 PM IST."
        ),
        "chips": ["📅 Book Site Visit", "Chat on WhatsApp", "Request Call Back"]
    }
]

# ==============================================================================
# OPTIONAL .ENV LOADER & GEMINI API INTEGRATION
# ==============================================================================

def load_env_file():
    """Lightweight built-in loader for .env file."""
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        try:
            with open(env_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k and k not in os.environ:
                            os.environ[k] = v
        except Exception:
            pass

load_env_file()

def call_gemini_api(prompt: str) -> str:
    """
    Call Google Gemini 1.5 Flash if GEMINI_API_KEY is configured.
    Specialized on KGK Group Real Estate domain knowledge.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key.strip() == "" or "your_gemini_api_key_here" in api_key:
        return None

    import urllib.request
    import urllib.error

    system_instruction = (
        "You are the KGK Group Real Estate AI Concierge (representing KGK Realty and KGK Group at kgkgroup.com and kgkrealty.com). "
        "Tone: Sophisticated, welcoming, authoritative, and helpful luxury real estate consultant. "
        "Company Background:\n"
        "- KGK Group was founded in 1905 (115+ year heritage) with global leadership in gems, diamonds, and jewelry. "
        "- KGK entered real estate in 2010 bringing uncompromised craftsmanship, precision, and trust to modern developments. "
        "- Presence: Jaipur (HQ), Mumbai (Navi Mumbai, Ulwe, Karjat), Delhi NCR (Gurugram). "
        "- Residential Projects: KGK Aarohan (C-Scheme Jaipur, ultra-luxury 4/5 BHK), KGK Sarvam (Tonk Road Jaipur, luxury 3/4/5 BHK), "
        "KGK Aahvan (Vaishali Nagar, 3/4/5 BHK), KGK Akshar (Mansarovar Ext, 3/4 BHK), KGK Amulya (Jagatpura, 2/3 BHK), "
        "RSM Athena & RSM Crystal (Ulwe, Navi Mumbai), Sare Gurugram (Delhi NCR). "
        "- Commercial Projects: KGK Lehariya (Airport Road / Jawahar Circle Jaipur, high-street retail & corporate offices), KGK Aakar (Jagatpura). "
        "- Appointments & Site Visits: Offer site visits with dedicated relationship manager, model flat tours, and virtual video consultations. "
        "- Contact: sales@kgkrealty.com | +91 98296 25004 | WhatsApp +91 88241 00200 | HQ at E.P. Campus, JLN Marg, Jaipur. "
        "Format responses cleanly with markdown bullet points. Keep answers concise (max 3-4 paragraphs) and always offer to book a site visit."
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {
        "system_instruction": {
            "parts": [{"text": system_instruction}]
        },
        "contents": [
            {"role": "user", "parts": [{"text": prompt}]}
        ],
        "generationConfig": {
            "temperature": 0.65,
            "maxOutputTokens": 400
        }
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req, timeout=6) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            candidates = res_data.get('candidates', [])
            if candidates and 'content' in candidates[0]:
                parts = candidates[0]['content'].get('parts', [])
                if parts and 'text' in parts[0]:
                    return parts[0]['text'].strip()
    except Exception as e:
        print(f"ℹ️ Gemini API call skipped or errored: {e}")
        return None

# Simple in-memory session store
SESSIONS: Dict[str, List[Dict[str, Any]]] = {}

# ==============================================================================
# INTENT PROCESSING & APPOINTMENT ENGINE
# ==============================================================================

def create_appointment(data: Dict[str, Any]) -> Dict[str, Any]:
    """Helper to register a new appointment and return confirmation."""
    apt_num = str(uuid.uuid4().int)[:4]
    apt_id = f"KGK-APT-{apt_num}"
    
    name = data.get("name", "Valued Client").strip()
    phone = data.get("phone", "+91 98000 00000").strip()
    email = data.get("email", "").strip()
    project = data.get("project", "KGK Sarvam (Tonk Road, Jaipur)").strip()
    date_str = data.get("date", datetime.now().strftime("%Y-%m-%d"))
    slot = data.get("slot", "11:00 AM – 1:00 PM (Morning Slot)")
    visit_type = data.get("type", "In-Person Site Visit & Model Tour")
    notes = data.get("notes", "Requested via AI Concierge")

    # Pick designated Relationship Manager
    rm_list = [
        {"name": "Vikram Rathore", "phone": "+91 98296 25004"},
        {"name": "Priyanka Mehta", "phone": "+91 88241 00200"},
        {"name": "Siddharth Khandelwal", "phone": "+91 98296 25004"}
    ]
    chosen_rm = rm_list[hash(apt_id) % len(rm_list)]

    record = {
        "id": apt_id,
        "name": name,
        "phone": phone,
        "email": email,
        "project": project,
        "type": visit_type,
        "date": date_str,
        "slot": slot,
        "status": "Confirmed & Relationship Manager Assigned",
        "rm_name": chosen_rm["name"],
        "rm_phone": chosen_rm["phone"],
        "meeting_point": f"{project} Experience Gallery / Site Office",
        "notes": notes,
        "created_at": datetime.utcnow().isoformat()
    }

    APPOINTMENTS_STORE[apt_id] = record
    return record

def process_message(user_message: str, session_id: str = "default") -> Dict[str, Any]:
    """Analyze incoming text, match real estate intent, and generate response."""
    text = user_message.strip()
    normalized = text.lower()

    if session_id not in SESSIONS:
        SESSIONS[session_id] = []
    SESSIONS[session_id].append({"sender": "user", "text": text, "time": datetime.utcnow().isoformat()})

    # 1. Check for Appointment ID Lookup (e.g. KGK-APT-2024 or #KGK-APT-2024)
    apt_match = re.search(r"(?:KGK[-_]?)?APT[-_]?\d{4}", normalized, re.IGNORECASE)
    if apt_match or (normalized.startswith("kgk-") and len(normalized) >= 10):
        # Clean ID
        digits_match = re.search(r"\d{4}", normalized)
        if digits_match:
            searched_id = f"KGK-APT-{digits_match.group(0)}"
            if searched_id in APPOINTMENTS_STORE:
                info = APPOINTMENTS_STORE[searched_id]
                reply = (
                    f"🏛️📋 **Appointment Record Found — #{searched_id}**\n\n"
                    f"• **Guest Name**: {info['name']}\n"
                    f"• **Project**: {info['project']}\n"
                    f"• **Scheduled Date**: {info['date']}\n"
                    f"• **Time Slot**: {info['slot']}\n"
                    f"• **Visit Type**: {info.get('type', 'In-Person Site Visit')}\n"
                    f"• **Status**: ✅ **{info['status']}**\n"
                    f"• **Relationship Manager**: {info.get('rm_name', 'Senior Property Advisor')} ({info.get('rm_phone', '+91 98296 25004')})\n"
                    f"• **Meeting Point**: {info.get('meeting_point', 'KGK Experience Gallery')}\n\n"
                    f"Need to reschedule or add guests? Our concierge is at your service!"
                )
                chips = ["📅 Book Another Visit", "Directions to Site", "📞 Contact Manager"]
                result = {
                    "reply": reply,
                    "chips": chips,
                    "intent": "appointment_lookup",
                    "appointment_data": info
                }
                SESSIONS[session_id].append({"sender": "bot", "text": reply, "time": datetime.utcnow().isoformat()})
                return result

    # 2. Check for Specific Project Queries by Name
    for proj in PROJECTS_CATALOG:
        proj_keywords = [
            proj["name"].lower(), 
            proj["id"].lower(),
            proj["name"].lower().replace("kgk ", "")
        ]
        if any(kw in normalized for kw in proj_keywords):
            hl_str = "\n  • " + "\n  • ".join(proj["highlights"])
            reply = (
                f"🏛️ **{proj['name']}** — {proj['type']}\n\n"
                f"• **Location**: {proj['location']}, {proj['city']}\n"
                f"• **Configurations**: {proj['configurations']}\n"
                f"• **Price Range**: {proj['price_range']}\n"
                f"• **Status**: {proj['status']}\n"
                f"• **RERA Reg.**: `{proj['rera']}`\n\n"
                f"**Key Project Highlights**:{hl_str}\n\n"
                f"Would you like to schedule an in-person site visit to walk through the sample residences?"
            )
            chips = [
                f"📅 Visit {proj['name']}",
                "💰 Price Sheet & Payment",
                "📐 Floor Plans",
                "🏢 Other Projects"
            ]
            result = {
                "reply": reply,
                "chips": chips,
                "intent": "project_detail",
                "project_data": proj
            }
            SESSIONS[session_id].append({"sender": "bot", "text": reply, "time": datetime.utcnow().isoformat()})
            return result

    # 3. Match predefined KGK Real Estate FAQ rules
    for rule in FAQ_RULES:
        for kw in rule["keywords"]:
            if re.search(r"\b" + re.escape(kw) + r"\b", normalized) or kw in normalized:
                reply = rule["reply"]
                chips = rule["chips"]
                result = {
                    "reply": reply,
                    "chips": chips,
                    "intent": rule["intent"]
                }
                SESSIONS[session_id].append({"sender": "bot", "text": reply, "time": datetime.utcnow().isoformat()})
                return result

    # 4. If Gemini API is available, generate dynamic response with KGK Real Estate knowledge
    gemini_reply = call_gemini_api(text)
    if gemini_reply:
        result = {
            "reply": gemini_reply,
            "chips": ["📅 Book Site Visit", "🏢 Landmark Projects", "📍 Jaipur Projects", "📋 RERA & Trust"],
            "intent": "gemini_ai"
        }
        SESSIONS[session_id].append({"sender": "bot", "text": gemini_reply, "time": datetime.utcnow().isoformat()})
        return result

    # 5. Fallback response for unhandled inquiries
    fallback_reply = (
        f"Thank you for contacting **KGK Group Real Estate**! 🏛️✨\n\n"
        f"Regarding *\"{text}\"*, I would be glad to assist you. "
        "Explore our landmark residences in Jaipur & Mumbai, review RERA credentials, "
        "or book a private site visit below:"
    )
    fallback_chips = [
        "📅 Book Site Visit",
        "🏢 Landmark Projects",
        "📍 Jaipur Locations",
        "💰 Pricing & Payment Plans",
        "📞 Contact Sales Team"
    ]
    
    result = {
        "reply": fallback_reply,
        "chips": fallback_chips,
        "intent": "fallback"
    }
    SESSIONS[session_id].append({"sender": "bot", "text": fallback_reply, "time": datetime.utcnow().isoformat()})
    return result

# ==============================================================================
# FLASK SERVER IMPLEMENTATION
# ==============================================================================

if FLASK_AVAILABLE:
    app = Flask(__name__, static_folder='.', static_url_path='')
    CORS(app)

    @app.route('/')
    def serve_index():
        """Serve the frontend index.html"""
        return send_from_directory('.', 'index.html')

    @app.route('/<path:path>')
    def serve_static(path):
        """Serve static assets (style.css, script.js, images, etc.)"""
        return send_from_directory('.', path)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            "status": "online",
            "brand": "KGK Group Real Estate",
            "division": "KGK Realty",
            "backend": "python-flask",
            "legacy": "Since 1905 (Real Estate since 2010)",
            "timestamp": datetime.utcnow().isoformat()
        })

    @app.route('/api/projects', methods=['GET'])
    def get_projects():
        """Return the catalog of KGK Realty projects"""
        return jsonify({
            "status": "success",
            "total": len(PROJECTS_CATALOG),
            "projects": PROJECTS_CATALOG
        })

    @app.route('/api/chat', methods=['POST'])
    def chat_endpoint():
        """Main chat API endpoint"""
        data = request.get_json(force=True, silent=True) or {}
        message = data.get("message", "")
        session_id = data.get("session_id", "default")

        if not message.strip():
            return jsonify({
                "error": "Message cannot be empty",
                "status": "error"
            }), 400

        result = process_message(message, session_id)
        result["status"] = "success"
        result["timestamp"] = datetime.utcnow().isoformat()
        return jsonify(result)

    @app.route('/api/appointment/book', methods=['POST'])
    def book_appointment_endpoint():
        """Dedicated API to book an appointment / site visit"""
        data = request.get_json(force=True, silent=True) or {}
        if not data.get("name") or not data.get("phone"):
            return jsonify({
                "error": "Name and phone number are required to schedule an appointment.",
                "status": "error"
            }), 400

        appointment = create_appointment(data)
        return jsonify({
            "status": "success",
            "message": "Appointment scheduled successfully!",
            "appointment": appointment
        }), 201

    @app.route('/api/appointment/<apt_id>', methods=['GET'])
    def get_appointment_endpoint(apt_id):
        """Look up appointment details by ID"""
        clean_id = apt_id.upper().strip()
        if not clean_id.startswith("KGK-APT-"):
            clean_id = "KGK-APT-" + clean_id.replace("KGK-", "").replace("APT-", "")

        if clean_id in APPOINTMENTS_STORE:
            return jsonify({
                "status": "success",
                "appointment": APPOINTMENTS_STORE[clean_id]
            })
        return jsonify({
            "status": "not_found",
            "message": f"Appointment record '{apt_id}' was not found. Please check your ID."
        }), 404

# ==============================================================================
# STANDALONE BUILT-IN HTTP SERVER (ZERO DEPENDENCY FALLBACK)
# ==============================================================================

def run_builtin_server(port=5000):
    """Zero-dependency HTTP server using Python's standard library."""
    from http.server import SimpleHTTPRequestHandler, HTTPServer
    import urllib.parse

    class BotHTTPHandler(SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            super().end_headers()

        def do_OPTIONS(self):
            self.send_response(200)
            self.end_headers()

        def do_GET(self):
            parsed = urllib.parse.urlparse(self.path)
            if parsed.path == '/api/health':
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                response = {
                    "status": "online",
                    "brand": "KGK Group Real Estate",
                    "division": "KGK Realty",
                    "backend": "python-builtin-http",
                    "timestamp": datetime.utcnow().isoformat()
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return

            if parsed.path == '/api/projects':
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "success",
                    "projects": PROJECTS_CATALOG
                }).encode('utf-8'))
                return

            if parsed.path.startswith('/api/appointment/'):
                apt_id = parsed.path.replace('/api/appointment/', '').upper().strip()
                if not apt_id.startswith("KGK-APT-"):
                    apt_id = "KGK-APT-" + apt_id.replace("KGK-", "").replace("APT-", "")
                
                if apt_id in APPOINTMENTS_STORE:
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "status": "success",
                        "appointment": APPOINTMENTS_STORE[apt_id]
                    }).encode('utf-8'))
                else:
                    self.send_response(404)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "status": "not_found",
                        "message": f"Appointment {apt_id} not found."
                    }).encode('utf-8'))
                return
            
            return super().do_GET()

        def do_POST(self):
            parsed = urllib.parse.urlparse(self.path)
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            try:
                data = json.loads(body.decode('utf-8'))
            except Exception:
                data = {}

            if parsed.path == '/api/chat':
                message = data.get("message", "")
                session_id = data.get("session_id", "default")
                if not message.strip():
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Empty message", "status": "error"}).encode('utf-8'))
                    return

                result = process_message(message, session_id)
                result["status"] = "success"
                result["timestamp"] = datetime.utcnow().isoformat()

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode('utf-8'))
                return

            if parsed.path == '/api/appointment/book':
                if not data.get("name") or not data.get("phone"):
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Missing name or phone", "status": "error"}).encode('utf-8'))
                    return

                apt = create_appointment(data)
                self.send_response(201)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "appointment": apt}).encode('utf-8'))
                return

            self.send_response(404)
            self.end_headers()

    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, BotHTTPHandler)
    print(f"[KGK Real Estate] Concierge Server running at http://localhost:{port}/")
    print(f"[KGK Real Estate] API endpoints: http://localhost:{port}/api/chat, /api/appointment/book")
    httpd.serve_forever()

# ==============================================================================
# MAIN ENTRYPOINT
# ==============================================================================

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    if FLASK_AVAILABLE:
        print(f"[KGK Real Estate] Concierge Flask Server running at http://localhost:{port}/")
        print(f"[KGK Real Estate] API endpoints: http://localhost:{port}/api/chat, /api/appointment/book")
        app.run(host='0.0.0.0', port=port, debug=True)
    else:
        print("[KGK Real Estate] Running with Python standard library HTTP server fallback.")
        run_builtin_server(port=port)
