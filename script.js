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
    const STORAGE_KEY = 'chat_bot_history_v1';

    // Knowledge Base / Support FAQ database
    const supportKnowledge = [
        {
            keywords: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good evening', 'start'],
            reply: "Hello there! 👋 Welcome to Customer Support. How can I assist you with your project or account today?",
            chips: ["📦 Track Order", "💳 Pricing & Plans", "🛠️ Technical Help", "👤 Talk to Human"]
        },
        {
            keywords: ['price', 'pricing', 'cost', 'plan', 'plans', 'subscription', 'upgrade'],
            reply: "We offer 3 flexible plans:\n\n• **Starter**: $19/mo (Perfect for small teams)\n• **Pro**: $49/mo (Advanced analytics & AI tools)\n• **Enterprise**: Custom solutions with 24/7 dedicated support.\n\nAll plans include a **14-day free trial** with no credit card required!",
            chips: ["Start Free Trial", "Compare Features", "👤 Talk to Sales"]
        },
        {
            keywords: ['order', 'track', 'shipping', 'delivery', 'package', 'tracking'],
            reply: "To track your shipment, please provide your **Order ID** (e.g., `#ORD-88219`). You can also view real-time shipping status directly in your account dashboard under **Billing & Orders**.",
            chips: ["#ORD-88219", "Check Order Status", "Shipping Policy"]
        },
        {
            keywords: ['human', 'agent', 'representative', 'person', 'support team', 'call', 'talk to human'],
            reply: "Connecting you to our live support queue... 🔄\n\n**Sarah (Tier 2 Support Specialist)** is available. Typical response time is **under 2 minutes**. Please describe your issue in detail so she can jump right in!",
            chips: ["Billing Issue", "API Integration", "Cancel Order"]
        },
        {
            keywords: ['refund', 'return', 'cancel', 'money back', 'guarantee'],
            reply: "We provide a **30-day 100% money-back guarantee**. If you're not satisfied, you can request an instant refund under **Account Settings > Billing > Request Refund** or let me file a ticket for you.",
            chips: ["File Refund Ticket", "Return Policy", "Cancel Plan"]
        },
        {
            keywords: ['contact', 'email', 'phone', 'hours', 'reach', 'address'],
            reply: "You can reach us through several channels:\n\n📧 **Email**: support@example.com\n📞 **Phone**: +1 (800) 555-0199\n⏰ **Hours**: 24 hours a day, 7 days a week.",
            chips: ["Send Email", "Schedule Call", "Live Chat"]
        },
        {
            keywords: ['bug', 'issue', 'broken', 'error', 'login', 'password', 'reset'],
            reply: "Having trouble logging in or noticing a bug?\n\n1. You can reset your password using the **'Forgot Password'** link on the login page.\n2. Clear your browser cache and cookies.\n3. Check our [Status Page](#) for scheduled maintenance.",
            chips: ["Reset Password", "System Status", "Report Bug"]
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
            ? '🤖' 
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
            <div class="msg-mini-avatar" aria-hidden="true">🤖</div>
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
            "👋 Hi there! I'm Nova, your AI customer support assistant. How can we help you today?",
            ["📦 Track Order", "💳 Pricing & Plans", "🛠️ Technical Help", "👤 Talk to Human"],
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
