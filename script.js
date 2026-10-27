/**
 * Customer Support Left-Corner Chatbot
 * Modern, interactive client-side customer support widget
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const widgetContainer = document.getElementById('botWidgetContainer');
    const launcherBtn = document.getElementById('botLauncherBtn');
    const chatWindow = document.getElementById('botChatWindow');
    const closeBtn = document.getElementById('chatCloseBtn');
    const clearBtn = document.getElementById('chatClearBtn');
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const messagesContainer = document.getElementById('chatMessagesContainer');
    const chatForm = document.getElementById('chatInputForm');
    const chatInput = document.getElementById('chatInputField');
    const sendBtn = document.getElementById('chatSendBtn');
    const tooltipBubble = document.getElementById('botTooltipBubble');
    const unreadBadge = document.getElementById('botUnreadBadge');
    const triggerDemoChat = document.getElementById('triggerDemoChat');

    // State Variables
    let soundEnabled = true;
    let isTyping = false;
    const STORAGE_KEY = 'manam_chocolate_chat_v2';

    // Manam Chocolate Knowledge Base & FAQ Database
    const supportKnowledge = [
        {
            keywords: ['hi', 'hello', 'hey', 'namaste', 'greetings', 'good morning', 'good evening', 'start'],
            reply: "Namaste & Welcome to **Manam Chocolate**! 🍫✨\n\nI am your **Craft Chocolate Concierge**. We are farmers, fermenters, chocolate makers, and chocolatiers crafting a new Indian Craft Chocolate™ experience from West Godavari cacao.\n\nHow may I delight your chocolate palate today?",
            chips: ["🍫 Tablet Library", "🏛️ Visit Karkhana", "📦 Track Order", "🎁 Gifting & Hampers", "☕ Café & Menu"]
        },
        {
            keywords: ['tablet', 'tablets', 'bars', 'dark', 'milk', 'flavor', 'flavors', 'variety', 'single origin', 'price', 'pricing', 'cost'],
            reply: "Our award-winning **Craft Chocolate Tablet Collection** celebrates the nuances of Indian cacao:\n\n• **Single-Origin Tablets**: 60% Dark Milk, 66% Dark (Silver Medalist), 69% Dark, 80% Dark, and 100% Pure Dark (₹375–₹495, 80g).\n• **Single Farm Series**: Pure harvest expressions from partner farms like *GVS Prasad Farm* in West Godavari.\n• **Chocolate Lab Editions**: Experimental pairings with indigenous fruits like *Pedda Rasalu Mango* and *Chakkarakeli Banana* (₹495–₹675).\n\nAll our pure dark chocolates are 100% vegan, dairy-free, and bean-to-bar!",
            chips: ["66% Dark (Silver Winner)", "Mango & Banana Lab", "100% Pure Dark", "Bonbons Collection"]
        },
        {
            keywords: ['karkhana', 'cafe', 'hyderabad', 'visit', 'address', 'location', 'timings', 'banjara hills'],
            reply: "**Manam Chocolate Karkhana** is our 10,000 sq. ft. flagship chocolate sanctuary in Hyderabad! 🏛️✨\n\n📍 **Address**: Road No. 12, Banjara Hills, Hyderabad, Telangana 500034.\n🕒 **Hours**: Open everyday, 10:00 AM – 11:00 PM IST.\n\n**What to experience**:\n• **Live Factory Floor**: Watch cacao beans being roasted, winnowed, and conched.\n• **The Chocolate Lab**: Custom-craft your very own chocolate tablet with your choice of inclusions.\n• **All-Day Café**: Specialty single-origin hot chocolate, entremets, and savory sourdoughs.\n\nWe also have the **Manam Beverage Bar** at Sattva Knowledge City, Hitec City!",
            chips: ["Get Directions", "Chocolate Lab Workshops", "Café Highlights"]
        },
        {
            keywords: ['cacao', 'farmer', 'farmers', 'founder', 'origin', 'west godavari', 'fermentery', 'chaitanya'],
            reply: "**The Manam Story & Indian Cacao Heritage** 🇮🇳🌱\n\n• **Founder**: Founded by entrepreneur **Chaitanya Muppala** to bring world recognition to Indian craft cacao.\n• **Our Farmers**: We partner directly with 100+ farmer-members in **West Godavari**, Andhra Pradesh, intercropped with coconut, banana, and black pepper.\n• **Distinct Origins Fermentery**: Our state-of-the-art facility in Tadikalapudi runs scientific 5-step box fermentation to unlock fine-flavour fruitiness.\n• **Global Honors**: Awarded multiple medals at the **Academy of Chocolate Awards (London)** and International Chocolate Awards!",
            chips: ["West Godavari Terroir", "Fermentation Art", "Awards & Honors"]
        },
        {
            keywords: ['gift', 'gifting', 'hamper', 'hampers', 'bonbon', 'bonbons', 'truffles', 'box', 'wedding', 'corporate', 'barks'],
            reply: "Discover our luxury **Gifting & Indulgence Collections** 🎁:\n\n• **The Bonbon Collection**: Edible jewels layered with single-origin ganaches, fruit compotes, and nut pralines (Boxes of 6, 12, and 24 pcs: ₹1,000 – ₹2,500+).\n• **Snacking Barks & Dragees**: Chocolate barks, caramel clusters, enrobed hazelnuts, and cacao nibs (₹350 – ₹950).\n• **Custom Hampers & Corporate Gifting**: Bespoke wooden keepsake boxes with personalized sleeve messaging for weddings, festivals, and milestones.",
            chips: ["Assorted Bonbon Box", "Corporate Inquiry", "Snacking Barks"]
        },
        {
            keywords: ['shipping', 'delivery', 'melt', 'melting', 'cold pack', 'packaging', 'temperature', 'pincode', 'india'],
            reply: "**Pan-India Melt-Free Shipping Guarantee** 🚚❄️\n\n• **Temperature-Controlled Packaging**: Every order is packed in custom insulated thermal foam boxes with food-grade frozen gel ice packs to ensure your chocolate stays crisp and cool.\n• **Coverage**: We ship to all serviceable pincodes across India.\n• **Dispatch Timeline**: Orders are dispatched within 24–48 hours; delivery takes 2–4 business days.\n• **Hyderabad Local**: Available for same-day pickup at Banjara Hills Karkhana or via Swiggy/Zomato.",
            chips: ["Track My Order", "Check Pincode", "Damaged Item Policy"]
        },
        {
            keywords: ['store', 'storage', 'refrigerator', 'fridge', 'temperature', 'expire', 'expiry', 'shelf life'],
            reply: "**How to Store Craft Chocolate** 🌡️🍫\n\n• **Ideal Range**: Keep in a cool, dry place between **16°C and 20°C** (humidity under 60%), away from strong odors and direct sunlight.\n• **Summer Tip**: If your room exceeds 24°C, store it in an airtight container in the vegetable crisper. Allow it to rest at room temperature for **10 minutes** before tasting so the cacao butter melts smoothly on your palate!\n• **Shelf Life**: Pure dark tablets stay fresh for 12 months; fresh cream bonbons are best enjoyed within 2–3 weeks.",
            chips: ["Tasting Guide", "Tablet Library", "Bonbon Care"]
        },
        {
            keywords: ['vegan', 'dairy free', 'gluten free', 'sugar free', 'pure dark', 'healthy'],
            reply: "**Dietary & Allergen Information** 🌿\n\n• **100% Vegan & Dairy-Free**: All our Dark Chocolate Tablets (60%, 66%, 69%, 80%, and 100% Pure Dark) contain only cacao and raw unrefined cane sugar—zero dairy or animal products!\n• **Gluten-Free**: Most plain tablets, snacking cacao nibs, and dragees are gluten-free (except inclusion items with toasted sourdough or biscuit pieces).\n• **Zero Added Sugar**: Our **Tablet No. 8 (100% Pure Cacao)** contains 0g added sugar—pure roasted West Godavari cacao.",
            chips: ["100% Pure Dark (Sugar-Free)", "Vegan Tablets", "View Ingredients"]
        },
        {
            keywords: ['contact', 'email', 'phone', 'call', 'care', 'customer service', 'help', 'support'],
            reply: "Our **Manam Chocolate Concierge** is here for you:\n\n📞 **Customer Care Phone**: +91 73311 00776\n🕒 **Care Hours**: Monday to Saturday, 10:00 AM – 7:00 PM IST\n📧 **Email**: care@manamchocolate.com\n🏛️ **Flagship**: Manam Chocolate Karkhana, Road No. 12, Banjara Hills, Hyderabad 500034.",
            chips: ["Call Support", "Send Email", "Visit Karkhana", "Track Order"]
        },
        {
            keywords: ['order', 'track', 'tracking', 'package', 'status', 'where is my order'],
            reply: "I can track your Manam Chocolate shipment! 📦🍫\n\nPlease provide your **Order ID** (for example: `#MNM-40291`, `#MNM-88219`, or `#MNM-10423`).",
            chips: ["#MNM-40291", "#MNM-88219", "#MNM-10423"]
        }
    ];

    // Web Audio API Synthesizer for pleasant sound effects
    const playChime = (type = 'receive') => {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            if (type === 'send') {
                // Gentle upward pop
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            } else {
                // Soft bell chime for incoming message
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(587.33, now); // D5
                osc.frequency.setValueAtTime(880, now + 0.08); // A5
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
                osc.start(now);
                osc.stop(now + 0.28);
            }
        } catch (e) {
            // Audio context silently handled if blocked by browser policy
        }
    };

    // Format current time (e.g. "2:45 PM")
    const getCurrentTime = () => {
        const d = new Date();
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Simple markdown formatter for bolding, bullet points, and links
    const formatMessageText = (raw) => {
        let text = raw
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Bold **text**
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Line breaks
        text = text.replace(/\n/g, '<br>');

        return text;
    };

    // Append Message to UI
    const appendMessage = (sender, text, chips = [], save = true) => {
        const row = document.createElement('div');
        row.className = `message-row ${sender}`;

        const isBot = sender === 'bot';
        const avatarIcon = isBot 
            ? '🍫' 
            : '👤';

        let chipsHtml = '';
        if (isBot && chips && chips.length > 0) {
            chipsHtml = `
                <div class="quick-replies-group">
                    ${chips.map(chip => `<button class="quick-chip-btn" data-query="${chip}">${chip}</button>`).join('')}
                </div>
            `;
        }

        row.innerHTML = `
            <div class="msg-mini-avatar" aria-hidden="true">${avatarIcon}</div>
            <div class="msg-content-wrapper">
                <div class="message-bubble">${formatMessageText(text)}</div>
                ${chipsHtml}
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        `;

        messagesContainer.appendChild(row);
        scrollToBottom();

        if (save) {
            saveHistory();
        }

        // Attach event listeners to chips
        if (chips.length > 0) {
            row.querySelectorAll('.quick-chip-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const query = e.target.getAttribute('data-query');
                    handleUserSubmit(query);
                });
            });
        }
    };

    // Scroll chat to bottom
    const scrollToBottom = () => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Show Typing Indicator
    const showTypingIndicator = () => {
        if (document.getElementById('typingIndicator')) return;

        const typingRow = document.createElement('div');
        typingRow.className = 'message-row bot';
        typingRow.id = 'typingIndicator';
        typingRow.innerHTML = `
            <div class="msg-mini-avatar" aria-hidden="true">🍫</div>
            <div class="msg-content-wrapper">
                <div class="message-bubble typing-bubble">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingRow);
        scrollToBottom();
    };

    // Remove Typing Indicator
    const hideTypingIndicator = () => {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    };

    // Python API Base URL
    const API_BASE = (window.location.protocol.startsWith('http') && !['5500', '3000'].includes(window.location.port))
        ? window.location.origin
        : 'http://localhost:5000';

    // Check Python Backend Health
    const checkBackendStatus = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/health`);
            if (res.ok) {
                const data = await res.json();
                const statusSubtext = document.querySelector('.agent-details p');
                if (statusSubtext) {
                    statusSubtext.innerHTML = '● <strong>Python Backend</strong> Online • 24/7';
                    statusSubtext.style.color = 'var(--online-green)';
                }
                console.log('🤖 Python Backend connected:', data);
            }
        } catch (e) {
            console.log('ℹ️ Running in client-side fallback mode (Python server offline)');
        }
    };
    checkBackendStatus();

    // Determine Bot Response (Client Fallback)
    const generateBotResponse = (userText) => {
        const normalized = userText.toLowerCase().trim();

        for (const item of supportKnowledge) {
            for (const key of item.keywords) {
                if (normalized.includes(key)) {
                    return {
                        reply: item.reply,
                        chips: item.chips || []
                    };
                }
            }
        }

        // Default Fallback
        return {
            reply: "Thank you for reaching out! I've noted: *\"" + userText + "\"*.\n\nCould you please pick one of the options below or clarify what you need help with?",
            chips: ["📦 Track Order", "💳 Pricing & Plans", "🛠️ Technical Help", "👤 Talk to Human"]
        };
    };

    // Handle User Message Submission (Calls Python API with Fallback)
    const handleUserSubmit = async (overrideText = null) => {
        const text = (overrideText !== null ? overrideText : chatInput.value).trim();
        if (!text || isTyping) return;

        // Render User Message
        appendMessage('user', text, [], true);
        playChime('send');

        if (overrideText === null) {
            chatInput.value = '';
            chatInput.style.height = 'auto';
        }

        isTyping = true;
        showTypingIndicator();

        let botReply = null;
        let botChips = [];

        // Attempt call to Python Backend API
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const response = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: text,
                    session_id: 'session_' + (localStorage.getItem('chat_session_id') || 'default')
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                botReply = data.reply;
                botChips = data.chips || [];
            }
        } catch (err) {
            // Backend offline or timeout -> use local rule engine
        }

        // Fallback to local intelligence if backend failed
        if (!botReply) {
            const fallback = generateBotResponse(text);
            botReply = fallback.reply;
            botChips = fallback.chips;
        }

        // Realistic typing delay for human-like feeling
        const delay = Math.floor(Math.random() * 300) + 500;

        setTimeout(() => {
            hideTypingIndicator();
            appendMessage('bot', botReply, botChips, true);
            playChime('receive');
            isTyping = false;
        }, delay);
    };

    // Save and Load Chat History from LocalStorage
    const saveHistory = () => {
        try {
            const messages = [];
            const rows = messagesContainer.querySelectorAll('.message-row:not(#typingIndicator)');
            rows.forEach(r => {
                const isUser = r.classList.contains('user');
                const bubble = r.querySelector('.message-bubble');
                if (bubble) {
                    messages.push({
                        sender: isUser ? 'user' : 'bot',
                        text: bubble.innerText
                    });
                }
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (e) {
            // Storage quota handled silently
        }
    };

    const loadHistory = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const messages = JSON.parse(raw);
                if (Array.isArray(messages) && messages.length > 0) {
                    messagesContainer.innerHTML = `
                        <div class="chat-date-divider">
                            <span>Today</span>
                        </div>
                    `;
                    messages.forEach(m => {
                        appendMessage(m.sender, m.text, [], false);
                    });
                    return true;
                }
            }
        } catch (e) {
            // Corrupt storage handled safely
        }
        return false;
    };

    // Reset Chat
    const resetChat = () => {
        localStorage.removeItem(STORAGE_KEY);
        messagesContainer.innerHTML = `
            <div class="chat-date-divider">
                <span>Today</span>
            </div>
        `;
        appendMessage(
            'bot',
            "Namaste & Welcome to **Manam Chocolate**! 🍫✨\n\nI am your **Craft Chocolate Concierge**. How may I assist you with our Indian Craft Chocolate tablets, Karkhana visits in Hyderabad, or gifting collections today?",
            ["🍫 Tablet Library", "🏛️ Visit Karkhana", "📦 Track Order", "🎁 Gifting & Hampers", "☕ Café & Menu"],
            true
        );
    };

    // Toggle Chat Window
    const toggleChat = (forceState = null) => {
        const isActive = forceState !== null 
            ? forceState 
            : !widgetContainer.classList.contains('active');

        if (isActive) {
            widgetContainer.classList.add('active');
            tooltipBubble.classList.add('hidden');
            unreadBadge.classList.add('hidden');
            setTimeout(() => {
                chatInput.focus();
                scrollToBottom();
            }, 150);
        } else {
            widgetContainer.classList.remove('active');
        }
    };

    // Event Listeners
    launcherBtn.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(false));
    tooltipBubble.addEventListener('click', () => toggleChat(true));

    if (triggerDemoChat) {
        triggerDemoChat.addEventListener('click', () => toggleChat(true));
    }

    // Input form submit
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUserSubmit();
    });

    // Enter key submits (Shift+Enter for newline)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserSubmit();
        }
    });

    // Auto-resize input box
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 80) + 'px';
    });

    // Clear / Reset Chat Button
    clearBtn.addEventListener('click', () => {
        if (confirm('Do you want to reset and clear this conversation?')) {
            resetChat();
        }
    });

    // Sound Toggle Button
    soundToggleBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggleBtn.setAttribute('title', soundEnabled ? 'Mute sound' : 'Unmute sound');
        soundToggleBtn.style.opacity = soundEnabled ? '1' : '0.4';
    });

    // Initialize Chat
    const hasExistingHistory = loadHistory();
    if (!hasExistingHistory) {
        resetChat();
    }
});
