import os
import json
import re
from datetime import datetime
from typing import Dict, Any, List

# Try importing Flask and Flask-CORS. If not installed, a lightweight fallback server will be used.
try:
    from flask import Flask, request, jsonify, send_from_directory
    from flask_cors import CORS
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False

# ==============================================================================
# MANAM CHOCOLATE - KNOWLEDGE BASE & SIMULATED ORDER DATABASE
# ==============================================================================

MOCK_ORDERS = {
    "MNM-40291": {
        "status": "In Transit with Cold-Pack 🚚❄️",
        "carrier": "BlueDart Apex Cold-Chain",
        "destination": "Bandra West, Mumbai",
        "estimated_delivery": "Tomorrow by 2:00 PM",
        "packaging": "Insulated Thermal Box with Food-Grade Gel Ice Packs",
        "items": [
            "1x Indian Origin Tablet No. 6 (66% Dark - Silver Winner)",
            "1x The Bonbon Collection (12 Assorted Pieces)"
        ]
    },
    "MNM-88219": {
        "status": "Out for Delivery Today 🚚✅",
        "carrier": "Delhivery Express Temperature-Safe",
        "destination": "Indiranagar, Bengaluru",
        "estimated_delivery": "Today by 5:30 PM",
        "packaging": "Insulated Thermal Box with Food-Grade Gel Ice Packs",
        "items": [
            "2x Chocolate Lab Tablet (Pedda Rasalu Mango & Dark Chocolate)",
            "1x Roasted Hazelnut Dragees (150g)"
        ]
    },
    "MNM-10423": {
        "status": "Freshly Handcrafted at Karkhana 🍫✨",
        "carrier": "Awaiting Courier Handover",
        "destination": "Jubilee Hills, Hyderabad (Local Express)",
        "estimated_delivery": "Today by 7:00 PM",
        "packaging": "Signature Manam Handcrafted Box",
        "items": [
            "1x Single Farm Tablet (80% Dark - GVS Prasad Farm)",
            "1x Single-Origin Hot Chocolate Drinking Blend (250g)"
        ]
    }
}

FAQ_RULES = [
    {
        "intent": "greeting",
        "keywords": ["hi", "hello", "hey", "namaste", "greetings", "good morning", "good evening", "welcome"],
        "reply": (
            "Namaste & Welcome to **Manam Chocolate**! 🍫✨\n\n"
            "I am your **Craft Chocolate Concierge**. We are farmers, fermenters, chocolate makers, and chocolatiers "
            "crafting a new Indian Craft Chocolate™ experience from the terroir of West Godavari, Andhra Pradesh.\n\n"
            "How may I delight your chocolate palate today?"
        ),
        "chips": ["🍫 Tablet Library", "🏛️ Visit Karkhana", "📦 Track Order", "🎁 Gifting & Hampers", "☕ Café & Menu"]
    },
    {
        "intent": "tablets_products",
        "keywords": ["tablet", "tablets", "bars", "dark chocolate", "milk chocolate", "flavor", "flavors", "variety", "types", "single origin"],
        "reply": (
            "Our award-winning **Craft Chocolate Tablet Collection** celebrates the nuances of Indian cacao:\n\n"
            "• **Single-Origin Tablets**: 60% Dark Milk, 66% Dark (Silver Medalist), 69% Dark, 80% Dark, and 100% Pure Dark (₹375–₹495, 80g).\n"
            "• **Single Farm Series**: Pure expressions from individual partner farms like the pioneer *GVS Prasad Farm* in West Godavari.\n"
            "• **Chocolate Lab Editions**: Limited-batch pairings with regional fruits & spices, including *Pedda Rasalu Mango* and *Chakkarakeli Banana* (₹495–₹675).\n\n"
            "All our pure dark chocolates are 100% vegan, dairy-free, and bean-to-bar!"
        ),
        "chips": ["66% Dark (Silver Winner)", "Mango & Banana Lab", "100% Pure Dark", "Bonbon Collection"]
    },
    {
        "intent": "karkhana_cafe",
        "keywords": ["karkhana", "cafe", "store", "hyderabad", "visit", "address", "location", "timings", "banjara hills", "experience"],
        "reply": (
            "**Manam Chocolate Karkhana** is our 10,000 sq. ft. flagship chocolate sanctuary in Hyderabad! 🏛️✨\n\n"
            "📍 **Address**: Road No. 12, Banjara Hills, Hyderabad, Telangana 500034.\n"
            "🕒 **Hours**: Open every day, 10:00 AM – 11:00 PM IST.\n\n"
            "**What to experience**:\n"
            "• **Live Factory Floor**: Watch cacao beans being roasted, winnowed, and conched.\n"
            "• **The Chocolate Lab**: Custom-make your very own signature chocolate tablet with your choice of inclusions.\n"
            "• **All-Day Café**: Specialty single-origin hot chocolate, cacao mocktails, entremets, and savory sourdoughs.\n\n"
            "We also have the **Manam Beverage Bar** at Sattva Knowledge City, Hitec City!"
        ),
        "chips": ["Get Directions", "Chocolate Lab Workshops", "Café Highlights", "Beverage Bar"]
    },
    {
        "intent": "cacao_farmers_origin",
        "keywords": ["cacao", "farmer", "farmers", "founder", "origin", "west godavari", "fermentery", "chaitanya", "story", "about"],
        "reply": (
            "**The Manam Story & Indian Cacao Heritage** 🇮🇳🌱\n\n"
            "• **Founder**: Founded by entrepreneur **Chaitanya Muppala** to bring world recognition to Indian craft cacao.\n"
            "• **Our Farmers**: We partner directly with 100+ progressive farmer-members in **West Godavari**, Andhra Pradesh, where cacao thrives alongside coconut, banana, and black pepper.\n"
            "• **Distinct Origins Fermentery**: We established a specialized 5-step box fermentation and shade-drying facility in Tadikalapudi to unlock fine-flavour notes rarely seen in mass chocolate.\n"
            "• **Global Acclaim**: Honored with multiple medals at the **Academy of Chocolate Awards (London)** and the **International Chocolate Awards**!"
        ),
        "chips": ["West Godavari Terroir", "Fermentation Art", "Awards & Honors"]
    },
    {
        "intent": "gifting_bonbons",
        "keywords": ["gift", "gifting", "hamper", "hampers", "bonbon", "bonbons", "box", "truffles", "wedding", "corporate", "barks"],
        "reply": (
            "Discover our luxury **Gifting & Indulgence Collections** 🎁:\n\n"
            "• **The Bonbon Collection**: Hand-painted edible jewels layered with single-origin ganaches, fruit compotes, and nut pralines (Boxes of 6, 12, and 24 pcs: ₹1,000 – ₹2,500+).\n"
            "• **Snacking Barks & Dragees**: Chocolate barks, caramel clusters, enrobed hazelnuts, and cacao nibs (₹350 – ₹950).\n"
            "• **Custom Hampers & Corporate Gifting**: Bespoke wooden keepsake boxes with personalized sleeve messaging for weddings, festivals, and milestones."
        ),
        "chips": ["Assorted Bonbon Box", "Corporate Inquiry", "Snacking Barks", "Custom Hampers"]
    },
    {
        "intent": "shipping_melt_guarantee",
        "keywords": ["shipping", "delivery", "melt", "melting", "cold pack", "packaging", "temperature", "courier", "pincode", "india"],
        "reply": (
            "**Pan-India Melt-Free Shipping Guarantee** 🚚❄️\n\n"
            "• **Temperature-Controlled Packaging**: Every order is packed in custom insulated thermal foam boxes with food-grade frozen gel ice packs to ensure your chocolate stays crisp and cool.\n"
            "• **Coverage**: We ship to all serviceable pincodes across India.\n"
            "• **Dispatch Timeline**: Orders are dispatched within 24–48 hours; delivery takes 2–4 business days.\n"
            "• **Hyderabad Local**: Available for same-day pickup at Banjara Hills Karkhana or via Swiggy/Zomato."
        ),
        "chips": ["Track My Order", "Check Pincode", "Damaged Item Policy"]
    },
    {
        "intent": "storage_guide",
        "keywords": ["store", "storage", "refrigerator", "fridge", "temperature", "expire", "expiry", "shelf life"],
        "reply": (
            "**How to Store Craft Chocolate** 🌡️🍫\n\n"
            "• **Ideal Range**: Keep in a cool, dry place between **16°C and 20°C** (humidity under 60%), away from strong odors and direct sunlight.\n"
            "• **Summer Tip**: If your room temperature exceeds 24°C, store it in an airtight container in the vegetable crisper. Allow it to rest at room temperature for **10 minutes** before tasting so the cacao butter melts smoothly on your palate!\n"
            "• **Shelf Life**: Pure dark tablets stay fresh for 12 months; fresh cream bonbons are best enjoyed within 2–3 weeks."
        ),
        "chips": ["Tasting Guide", "Tablet Library", "Bonbon Care"]
    },
    {
        "intent": "vegan_dietary",
        "keywords": ["vegan", "dairy free", "gluten free", "sugar free", "diet", "pure dark", "healthy", "calories"],
        "reply": (
            "**Dietary & Allergen Information** 🌿\n\n"
            "• **100% Vegan & Dairy-Free**: All our Dark Chocolate Tablets (60%, 66%, 69%, 80%, and 100% Pure Dark) contain only cacao and raw unrefined cane sugar—zero dairy or animal products!\n"
            "• **Gluten-Free**: Most plain tablets, snacking cacao nibs, and dragees are gluten-free (except inclusion items with toasted sourdough or biscuit pieces).\n"
            "• **Zero Added Sugar**: Our **Tablet No. 8 (100% Pure Cacao)** contains 0g added sugar—pure roasted West Godavari cacao."
        ),
        "chips": ["100% Pure Dark (Sugar-Free)", "Vegan Tablets", "View Ingredients"]
    },
    {
        "intent": "contact_support",
        "keywords": ["contact", "email", "phone", "call", "customer care", "help", "support", "reach"],
        "reply": (
            "Our **Manam Chocolate Concierge** is here for you:\n\n"
            "📞 **Customer Care Phone**: +91 73311 00776\n"
            "🕒 **Care Hours**: Monday to Saturday, 10:00 AM – 7:00 PM IST\n"
            "📧 **Email**: care@manamchocolate.com\n"
            "🏛️ **Flagship**: Manam Chocolate Karkhana, Road No. 12, Banjara Hills, Hyderabad 500034."
        ),
        "chips": ["Call Support", "Send Email", "Visit Karkhana", "Track Order"]
    },
    {
        "intent": "order_tracking",
        "keywords": ["order", "track", "tracking", "shipment", "package", "status", "where is my order"],
        "reply": (
            "I can track your Manam Chocolate shipment! 📦🍫\n\n"
            "Please provide your **Order ID** (for example: `#MNM-40291`, `#MNM-88219`, or `#MNM-10423`)."
        ),
        "chips": ["#MNM-40291", "#MNM-88219", "#MNM-10423"]
    }
]

# ==============================================================================
# OPTIONAL .ENV LOADER & GEMINI API INTEGRATION
# ==============================================================================

def load_env_file():
    """Lightweight built-in loader for .env file (zero extra dependencies)."""
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
    Uses standard library urllib (zero extra packages needed).
    Trained specifically on Manam Chocolate craft knowledge!
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key.strip() == "" or "your_gemini_api_key_here" in api_key:
        return None

    import urllib.request
    import urllib.error

    system_instruction = (
        "You are the Manam Chocolate Concierge, representing Manam Chocolate - Indian Craft Chocolate™ (manamchocolate.com). "
        "You embody artisanal luxury, warmth, and culinary passion. "
        "Key knowledge:\n"
        "- Founder: Chaitanya Muppala.\n"
        "- Cacao Sourcing: 100+ partner farmers in West Godavari, Andhra Pradesh, grown with coconut, banana, pepper.\n"
        "- Fermentery: Distinct Origins in Tadikalapudi running 5-step box fermentation.\n"
        "- Experience Center: Manam Chocolate Karkhana on Road No. 12, Banjara Hills, Hyderabad (10,000 sq.ft live factory, chocolate lab, café).\n"
        "- Products: Single-Origin Tablets (60% to 100% dark), Single Farm, Chocolate Lab (Mango, Banana), Bonbons, Snacking Barks, Dragees, Hampers.\n"
        "- Awards: Academy of Chocolate Awards (London), International Chocolate Awards.\n"
        "- Shipping: Pan-India with temperature-controlled insulated packaging & gel ice packs.\n"
        "- Storage: 16°C–20°C in cool dry place.\n"
        "- Contact: care@manamchocolate.com | +91 73311 00776.\n"
        "Keep answers concise, delightful, and helpful (maximum 3-4 sentences). Use markdown formatting."
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
            "temperature": 0.7,
            "maxOutputTokens": 350
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
# INTENT PROCESSING ENGINE
# ==============================================================================

def process_message(user_message: str, session_id: str = "default") -> Dict[str, Any]:
    """Analyze incoming text, match intent, and generate rich response."""
    text = user_message.strip()
    normalized = text.lower()

    # Track in session
    if session_id not in SESSIONS:
        SESSIONS[session_id] = []
    SESSIONS[session_id].append({"sender": "user", "text": text, "time": datetime.utcnow().isoformat()})

    # Check for specific Order ID pattern (e.g., MNM-40291 or #MNM-40291, or legacy ORD)
    order_match = re.search(r"(?:MNM|ORD)-?\d{5}", normalized, re.IGNORECASE)
    if order_match:
        raw_match = order_match.group(0).upper().replace("-", "")
        # Format as MNM-XXXXX or ORD-XXXXX
        prefix = "MNM-" if "MNM" in raw_match else "ORD-"
        matched_id = prefix + re.sub(r"[^\d]", "", raw_match)
        
        # Check in MOCK_ORDERS (check both MNM and ORD keys)
        info = MOCK_ORDERS.get(matched_id) or MOCK_ORDERS.get("MNM-" + re.sub(r"[^\d]", "", raw_match))
        if info:
            items_str = "\n  • " + "\n  • ".join(info.get("items", []))
            reply = (
                f"🍫📦 **Manam Order Tracking — #{matched_id}**\n\n"
                f"• **Status**: {info['status']}\n"
                f"• **Carrier**: {info['carrier']}\n"
                f"• **Packaging**: {info.get('packaging', 'Insulated Cold-Pack')}\n"
                f"• **Destination**: {info['destination']}\n"
                f"• **Delivery ETA**: {info.get('estimated_delivery')}\n\n"
                f"**Items in this box**:{items_str}"
            )
            chips = ["Track Another Order", "Melt-Free Guarantee", "Visit Karkhana"]
            result = {
                "reply": reply,
                "chips": chips,
                "intent": "order_lookup",
                "order_data": info
            }
            SESSIONS[session_id].append({"sender": "bot", "text": reply, "time": datetime.utcnow().isoformat()})
            return result

    # Match predefined Manam Chocolate FAQ rules
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

    # If Gemini API is available, generate dynamic AI response with Manam knowledge
    gemini_reply = call_gemini_api(text)
    if gemini_reply:
        result = {
            "reply": gemini_reply,
            "chips": ["🍫 Tablet Library", "🏛️ Visit Karkhana", "📦 Track Order", "🎁 Gifting & Hampers"],
            "intent": "gemini_ai"
        }
        SESSIONS[session_id].append({"sender": "bot", "text": gemini_reply, "time": datetime.utcnow().isoformat()})
        return result

    # Fallback response for unhandled questions
    fallback_reply = (
        f"Thank you for reaching out to **Manam Chocolate**! 🍫✨\n\n"
        f"Regarding: *\"{text}\"*, I would love to guide you. "
        "Explore our craft cacao tablets, plan a visit to our Hyderabad Karkhana, or check your shipment below:"
    )
    fallback_chips = ["🍫 Tablet Library", "🏛️ Visit Karkhana", "📦 Track Order", "🎁 Gifting & Hampers", "📞 Contact Care"]
    
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
        """Serve static assets (style.css, script.js, etc.)"""
        return send_from_directory('.', path)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            "status": "online",
            "brand": "Manam Chocolate",
            "backend": "python-flask",
            "timestamp": datetime.utcnow().isoformat()
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

    @app.route('/api/orders/<order_id>', methods=['GET'])
    def order_endpoint(order_id):
        """Get order status directly by ID"""
        clean_id = order_id.upper().strip()
        if not clean_id.startswith("MNM-") and not clean_id.startswith("ORD-"):
            clean_id = "MNM-" + clean_id
        
        if clean_id in MOCK_ORDERS:
            return jsonify({"status": "found", "order": MOCK_ORDERS[clean_id]})
        return jsonify({"status": "not_found", "message": f"Order {order_id} not found."}), 404

# ==============================================================================
# STANDALONE BUILT-IN HTTP SERVER (ZERO DEPENDENCY FALLBACK)
# ==============================================================================

def run_builtin_server(port=5000):
    """Zero-dependency HTTP server using Python's standard library."""
    from http.server import SimpleHTTPRequestHandler, HTTPServer
    import urllib.parse

    class BotHTTPHandler(SimpleHTTPRequestHandler):
        def end_headers(self):
            # Add CORS headers
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
                    "brand": "Manam Chocolate",
                    "backend": "python-builtin-http",
                    "timestamp": datetime.utcnow().isoformat()
                }
                self.wfile.write(json.dumps(response).encode('utf-8'))
                return
            
            # Default to serving static files from current directory
            return super().do_GET()

        def do_POST(self):
            parsed = urllib.parse.urlparse(self.path)
            if parsed.path == '/api/chat':
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length)
                try:
                    data = json.loads(body.decode('utf-8'))
                except Exception:
                    data = {}

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

            self.send_response(404)
            self.end_headers()

    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, BotHTTPHandler)
    print(f"🍫 Manam Chocolate Concierge Python Server running at http://localhost:{port}/")
    print(f"📡 API endpoint: http://localhost:{port}/api/chat")
    httpd.serve_forever()

# ==============================================================================
# MAIN ENTRYPOINT
# ==============================================================================

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    if FLASK_AVAILABLE:
        print(f"🍫 Manam Chocolate Concierge Flask Server running at http://localhost:{port}/")
        print(f"📡 API endpoint: http://localhost:{port}/api/chat")
        app.run(host='0.0.0.0', port=port, debug=True)
    else:
        print("ℹ️ Flask not found in environment, running with Python standard library HTTP server.")
        run_builtin_server(port=port)
