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
# KNOWLEDGE BASE & SIMULATED DATABASE
# ==============================================================================

MOCK_ORDERS = {
    "ORD-88219": {
        "status": "In Transit 🚚",
        "carrier": "FedEx Priority",
        "destination": "New York, NY",
        "estimated_delivery": "Tomorrow by 4:00 PM",
        "items": ["1x ApexCloud AI Enterprise Hub", "1x Dev Kit"]
    },
    "ORD-10423": {
        "status": "Delivered ✅",
        "carrier": "UPS Ground",
        "destination": "San Francisco, CA",
        "delivered_date": "Yesterday, 2:15 PM",
        "items": ["1x ApexCloud Starter Bundle"]
    },
    "ORD-99301": {
        "status": "Processing in Warehouse 📦",
        "carrier": "DHL Express",
        "destination": "Austin, TX",
        "estimated_delivery": "Thursday, Oct 29",
        "items": ["2x AI Accelerator Units"]
    }
}

FAQ_RULES = [
    {
        "intent": "greeting",
        "keywords": ["hi", "hello", "hey", "greetings", "good morning", "good evening", "howdy"],
        "reply": (
            "Hello there! 👋 Welcome to ApexCloud Customer Support. "
            "I'm Nova, your AI assistant powered by our Python backend.\n\n"
            "How can I help you today?"
        ),
        "chips": ["📦 Track Order", "💳 Pricing & Plans", "🛠️ Technical Help", "👤 Talk to Live Agent"]
    },
    {
        "intent": "pricing",
        "keywords": ["price", "pricing", "plan", "plans", "cost", "subscription", "tier", "upgrade", "discount"],
        "reply": (
            "Here are our flexible plans:\n\n"
            "• **Starter ($19/mo)**: Ideal for small projects & teams (up to 5 users).\n"
            "• **Pro ($49/mo)**: Full API access, priority speed & advanced analytics.\n"
            "• **Enterprise (Custom)**: Dedicated 24/7 account manager & SLA guarantee.\n\n"
            "✨ All plans include a **14-day free trial** with zero credit card commitment."
        ),
        "chips": ["Start Free Trial", "Compare Features", "Talk to Sales"]
    },
    {
        "intent": "order_tracking",
        "keywords": ["order", "track", "tracking", "shipment", "shipping", "package", "delivery"],
        "reply": (
            "I can track your order in real-time! 📦\n\n"
            "Please provide your **Order ID** (for example: `#ORD-88219`, `#ORD-10423`, or `#ORD-99301`)."
        ),
        "chips": ["#ORD-88219", "#ORD-10423", "#ORD-99301"]
    },
    {
        "intent": "live_agent",
        "keywords": ["human", "agent", "representative", "person", "support person", "specialist", "call"],
        "reply": (
            "Connecting you to our live support queue... 🔄\n\n"
            "🟢 **Sarah (Tier 2 Technical Specialist)** is next in queue.\n"
            "Estimated wait time: **under 2 minutes**.\n\n"
            "Please leave a brief summary of what you need help with so she can assist you immediately."
        ),
        "chips": ["Billing Inquiry", "Technical Bug", "Cancel Subscription"]
    },
    {
        "intent": "refund",
        "keywords": ["refund", "return", "money back", "cancel plan", "guarantee"],
        "reply": (
            "We offer a **30-day, no-questions-asked 100% money-back guarantee**.\n\n"
            "To request a refund:\n"
            "1. Visit your account dashboard under **Billing & Subscriptions**.\n"
            "2. Click **'Request Refund'** on the active invoice.\n"
            "3. Refunds are credited back to your original payment method in 3–5 business days."
        ),
        "chips": ["Request Refund Ticket", "Return Policy", "Cancel Plan"]
    },
    {
        "intent": "contact",
        "keywords": ["contact", "email", "phone", "hours", "office", "reach", "hotline"],
        "reply": (
            "You can reach our team anytime:\n\n"
            "📧 **Email**: support@apexcloud.io\n"
            "📞 **Toll-Free Phone**: +1 (800) 555-0199\n"
            "🕒 **Operating Hours**: 24/7/365 global coverage."
        ),
        "chips": ["Send Email", "Schedule Call", "System Status"]
    },
    {
        "intent": "technical",
        "keywords": ["bug", "error", "broken", "login", "password", "crash", "api", "token", "issue"],
        "reply": (
            "For technical troubleshooting:\n\n"
            "1. **Password reset**: Click 'Forgot Password' on the login screen to receive a secure reset link.\n"
            "2. **API Keys**: Ensure your `Authorization: Bearer <TOKEN>` header is configured.\n"
            "3. **Status**: Check our real-time system health monitor at [status.apexcloud.io](#)."
        ),
        "chips": ["Reset Password", "View API Docs", "System Health"]
    }
]

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

    # Check for specific Order ID pattern (e.g., ORD-88219 or #ORD-88219)
    order_match = re.search(r"ORD-?\d{5}", normalized, re.IGNORECASE)
    if order_match:
        matched_id = order_match.group(0).upper()
        if not matched_id.startswith("ORD-"):
            matched_id = "ORD-" + matched_id.replace("ORD", "")
        
        if matched_id in MOCK_ORDERS:
            info = MOCK_ORDERS[matched_id]
            items_str = ", ".join(info.get("items", []))
            reply = (
                f"📦 **Order Details for #{matched_id}**\n\n"
                f"• **Status**: {info['status']}\n"
                f"• **Carrier**: {info['carrier']}\n"
                f"• **Destination**: {info['destination']}\n"
                f"• **Expected Delivery**: {info.get('estimated_delivery') or info.get('delivered_date')}\n"
                f"• **Items**: {items_str}"
            )
            chips = ["Track Another Order", "Change Delivery Address", "Need Help with Items"]
            result = {
                "reply": reply,
                "chips": chips,
                "intent": "order_lookup",
                "order_data": info
            }
            SESSIONS[session_id].append({"sender": "bot", "text": reply, "time": datetime.utcnow().isoformat()})
            return result

    # Match predefined FAQ rules
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

    # Fallback response for unhandled questions
    fallback_reply = (
        f"Thank you for reaching out! I've logged your query regarding: *\"{text}\"*.\n\n"
        "I'm continuously learning. You can select one of the popular topics below, "
        "or ask to connect with a live agent for specialized help."
    )
    fallback_chips = ["📦 Track Order", "💳 Pricing & Plans", "🛠️ Technical Help", "👤 Talk to Live Agent"]
    
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
        order_key = order_id.upper().strip()
        if not order_key.startswith("ORD-"):
            order_key = "ORD-" + order_key.replace("ORD", "")
        
        if order_key in MOCK_ORDERS:
            return jsonify({"status": "found", "order": MOCK_ORDERS[order_key]})
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
    print(f"🚀 Customer Support Bot Python Server running at http://localhost:{port}/")
    print(f"📡 API endpoint: http://localhost:{port}/api/chat")
    httpd.serve_forever()

# ==============================================================================
# MAIN ENTRYPOINT
# ==============================================================================

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    if FLASK_AVAILABLE:
        print(f"🚀 Customer Support Bot Flask Server running at http://localhost:{port}/")
        print(f"📡 API endpoint: http://localhost:{port}/api/chat")
        app.run(host='0.0.0.0', port=port, debug=True)
    else:
        print("ℹ️ Flask not found in environment, running with Python standard library HTTP server.")
        run_builtin_server(port=port)
