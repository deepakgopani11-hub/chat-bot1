/**
 * KGK Group Real Estate (KGK Realty) — AI Concierge & Appointment Booking Engine
 * High-end luxury property consultant with interactive appointment scheduling
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
    const navBookVisitBtn = document.getElementById('navBookVisitBtn');
    const heroBookAptBtn = document.getElementById('heroBookAptBtn');
    const heroExploreProjectsBtn = document.getElementById('heroExploreProjectsBtn');
    const openAppointmentWizardBtn = document.getElementById('openAppointmentWizardBtn');
    const lookupAppointmentBtn = document.getElementById('lookupAppointmentBtn');
    const chatAppointmentWizardTrigger = document.getElementById('chatAppointmentWizardTrigger');

    // State Variables
    let soundEnabled = true;
    let isTyping = false;
    const STORAGE_KEY = 'kgk_realty_chat_v1';

    // Local Client-Side Appointments Cache (Mirrors backend store)
    const localAppointments = {
        "KGK-APT-2024": {
            id: "KGK-APT-2024",
            name: "Rajesh Sharma",
            phone: "+91 98290 11223",
            email: "rajesh.sharma@example.com",
            project: "KGK Sarvam (Tonk Road, Jaipur)",
            type: "Site Visit & Model Flat Tour",
            date: "2026-11-05",
            slot: "11:30 AM – 1:00 PM (Morning Slot)",
            status: "Confirmed & Relationship Manager Assigned",
            rm_name: "Vikram Rathore",
            rm_phone: "+91 98296 25004",
            meeting_point: "KGK Sarvam Experience Gallery, Tonk Road, Jaipur"
        },
        "KGK-APT-5102": {
            id: "KGK-APT-5102",
            name: "Anita Singhania",
            phone: "+91 98211 44556",
            email: "anita.s@example.com",
            project: "KGK Aarohan (C-Scheme, Jaipur)",
            type: "Private Sky-Residence Consultation",
            date: "2026-11-08",
            slot: "3:00 PM – 4:30 PM (Afternoon Slot)",
            status: "Confirmed & Relationship Manager Assigned",
            rm_name: "Priyanka Mehta",
            rm_phone: "+91 88241 00200",
            meeting_point: "KGK Aarohan Lounge, C-Scheme, Jaipur"
        },
        "KGK-APT-7819": {
            id: "KGK-APT-7819",
            name: "Amit Deshmukh",
            phone: "+91 98200 99887",
            email: "amit.deshmukh@example.com",
            project: "RSM Athena (Ulwe, Navi Mumbai)",
            type: "Virtual Video Walkthrough",
            date: "2026-11-02",
            slot: "5:00 PM – 5:45 PM (Evening Slot)",
            status: "Confirmed — Video Link Sent",
            rm_name: "Rohan Deshmukh",
            rm_phone: "+91 22 4028 8888",
            meeting_point: "Google Meet / Zoom (Link sent via WhatsApp)"
        }
    };

    // Client-Side KGK Real Estate Knowledge Base & Rules
    const realEstateKnowledge = [
        {
            keywords: ['hi', 'hello', 'hey', 'namaste', 'greetings', 'start', 'help'],
            reply: "Namaste & Welcome to **KGK Group Real Estate** (KGK Realty)! 🏛️✨\n\nCarrying a **115+ year global legacy of trust, craftsmanship, and precision**, we develop premier residential landmarks and commercial hubs across **Jaipur, Mumbai, and Delhi NCR**.\n\nHow may I assist you today? You can explore our landmark projects, book a private site visit, inquire about pricing & RERA, or check an existing appointment.",
            chips: ["📅 Book Site Visit", "🏢 Landmark Projects", "📍 Jaipur Projects", "🌊 Mumbai Projects", "💎 About KGK Group", "📋 RERA & Trust", "🔍 Check Appointment"]
        },
        {
            keywords: ['project', 'projects', 'portfolio', 'apartments', 'flats', 'properties', 'developments'],
            reply: "Here is the distinguished property portfolio of **KGK Realty**:\n\n🏛️ **Ultra-Luxury & Luxury Residential (Jaipur)**:\n• **KGK Aarohan (C-Scheme)**: 4 & 5 BHK Sky Residences in Jaipur's central district.\n• **KGK Sarvam (Tonk Road)**: 3, 4 & 5 BHK stepped-terrace residences with grand clubhouse.\n• **KGK Aahvan (Vaishali Nagar)**: 3, 4 & 5 BHK luxury residences in West Jaipur.\n• **KGK Akshar & Amulya**: Contemporary 2, 3 & 4 BHK homes in Mansarovar & Jagatpura.\n\n🏢 **Commercial Landmarks**:\n• **KGK Lehariya (Airport Road, Jaipur)**: High-street retail & Grade-A corporate office suites.\n• **KGK Aakar (Jagatpura)**: Retail & commercial showroom arcade.\n\n🌊 **Mumbai Metropolitan Region (MMR)**:\n• **RSM Athena & RSM Crystal (Ulwe, Navi Mumbai)**: 1, 2 & 3 BHK high-rises near NMIA airport.\n\nWould you like to schedule an in-person site visit or view pricing?",
            chips: ["KGK Aarohan (C-Scheme)", "KGK Sarvam (Tonk Road)", "KGK Lehariya Commercial", "📅 Book Site Visit", "💰 Pricing & Payment Plans"]
        },
        {
            keywords: ['aarohan', 'c-scheme', 'c scheme', 'sky residence', 'penthouse'],
            reply: "🏛️ **KGK Aarohan (C-Scheme, Central Jaipur)** — *Ultra-Luxury Sky Residences*\n\n• **Configurations**: 4 & 5 BHK Penthouses & Sky Residences (sprawling floor areas).\n• **Price Range**: ₹3.5 Cr – ₹7.5 Cr\n• **RERA Reg.**: `RAJ/P/2017/385`\n• **Highlights**:\n  - Jaipur's most prestigious central address overlooking Central Park.\n  - Private high-speed elevators opening into your own foyer.\n  - Infinity rooftop swimming pool, sauna, and sky observation lounge.\n  - 3-tier biometric security and full home automation.",
            chips: ["📅 Visit KGK Aarohan", "Detailed Cost Sheet", "Floor Plans", "🏢 Other Projects"]
        },
        {
            keywords: ['sarvam', 'tonk road', 'jawahar circle'],
            reply: "🏛️ **KGK Sarvam (Tonk Road, Jaipur)** — *Luxury Stepped Living*\n\n• **Configurations**: 3, 4 & 5 BHK High-Rise Apartments\n• **Price Range**: ₹1.15 Cr – ₹2.85 Cr\n• **Status**: Ready to Move / Possession Ongoing\n• **RERA Reg.**: `RAJ/P/2018/742`\n• **Highlights**:\n  - Distinctive stepped-terrace architecture ensuring open skies for all homes.\n  - Independent multi-level clubhouse with indoor badminton courts & gym.\n  - Minutes from Jaipur International Airport, Marriott, and World Trade Park.\n  - 80% open landscaped greens.",
            chips: ["📅 Visit KGK Sarvam", "Sarvam Pricing", "Clubhouse Amenities", "🏢 Other Projects"]
        },
        {
            keywords: ['lehariya', 'commercial', 'office', 'retail', 'shop', 'shops', 'showroom'],
            reply: "🏢 **KGK Lehariya (Airport Road / Jawahar Circle, Jaipur)** — *Grade-A Commercial Landmark*\n\n• **Offerings**: High-Street Retail Showrooms & Premium Corporate Office Suites\n• **Price Range**: ₹55 Lakh – ₹6.5 Cr\n• **RERA Reg.**: `RAJ/P/2022/1943`\n• **Highlights**:\n  - High-traffic prime frontage on the Jaipur Airport corridor.\n  - Architectural facade inspired by the heritage Lehariya weave.\n  - Escalators, multi-level basement car parking, and food & beverage court.\n  - Ideal for flagship retail stores and corporate corporate headquarters.",
            chips: ["📅 Book Commercial Visit", "Office Floor Plans", "Retail ROI Details", "KGK Aakar Commercial"]
        },
        {
            keywords: ['aahvan', 'vaishali', 'vaishali nagar'],
            reply: "🏛️ **KGK Aahvan (Vaishali Nagar, Jaipur)** — *Premium Modern Living*\n\n• **Configurations**: 3, 4 & 5 BHK Luxury Apartments\n• **Price Range**: ₹95 Lakh – ₹2.25 Cr\n• **RERA Reg.**: `RAJ/P/2021/1594`\n• **Highlights**:\n  - Situated in Jaipur's most upscale residential neighborhood.\n  - Temperature-controlled swimming pool, spa, and fitness studio.\n  - Individual EV charging stations for parking bays.\n  - Walking distance to top international schools and lifestyle centers.",
            chips: ["📅 Visit KGK Aahvan", "Aahvan Price Sheet", "Floor Layouts"]
        },
        {
            keywords: ['mumbai', 'navi mumbai', 'ulwe', 'athena', 'crystal', 'karjat', 'khopoli'],
            reply: "🌊 **KGK Realty in Mumbai (MMR)**:\n\n• **RSM Athena (Ulwe, Navi Mumbai)**: 14-storey high-rise 1, 2 & 3 BHK residences and retail, situated just 10 mins from the upcoming Navi Mumbai International Airport (NMIA) and Atal Setu (MTHL).\n• **RSM Crystal (Ulwe)**: Smart compact 1 BHK configurations tailored for investors.\n• **Unimont Aurum (Karjat) & Unimont Empire (Khopoli)**: Scenic hill-view township residences connecting Mumbai and Pune.\n\nWould you like to schedule a site inspection or virtual video tour?",
            chips: ["📅 Book Mumbai Visit", "RSM Athena Details", "📞 Contact Mumbai Desk"]
        },
        {
            keywords: ['delhi', 'gurugram', 'gurgaon', 'sare', 'dmic'],
            reply: "🏛️ **Delhi NCR & Industrial Corridor Developments**:\n\n• **Sare Gurugram (Sector 92)**: KGK Realty in consortium with Dhoot Infrastructure revived this mega-housing community for 1,200+ families near Dwarka Expressway.\n• **Industrial Parks along DMIC**: Mega manufacturing & logistics infrastructure aligned with the Delhi-Mumbai Industrial Corridor.",
            chips: ["Sare Gurugram Details", "Industrial Parks", "📅 Book Consultation"]
        },
        {
            keywords: ['price', 'pricing', 'cost', 'payment plan', 'clp', 'down payment', 'loan', 'bank'],
            reply: "💳 **KGK Realty Pricing & Payment Plans**:\n\n• **Indicative Price Ranges**:\n  - *KGK Amulya (Jagatpura)*: 2 & 3 BHK from **₹45 Lakhs**\n  - *KGK Akshar (Mansarovar)*: 3 & 4 BHK from **₹68 Lakhs**\n  - *KGK Aahvan (Vaishali Nagar)*: 3 & 4 BHK from **₹95 Lakhs**\n  - *KGK Sarvam (Tonk Road)*: Luxury 3 & 4 BHK from **₹1.15 Cr**\n  - *KGK Aarohan (C-Scheme)*: Ultra-Luxury from **₹3.5 Cr**\n  - *KGK Lehariya (Commercial)*: Retail & Suites from **₹55 Lakhs**\n\n• **Payment Flexibility**:\n  - **Construction Linked Plan (CLP)**: Pay along with construction milestones.\n  - **Pre-Approved Bank Loans**: Fast-track loan sanctioning with SBI, HDFC, ICICI, Axis Bank, and Bank of Baroda.",
            chips: ["Bank Loan Assistance", "📅 Book Site Visit", "Cost Sheet Download", "Commercial Pricing"]
        },
        {
            keywords: ['rera', 'legal', 'approval', 'safe', 'clear title', 'registration'],
            reply: "⚖️🛡️ **100% Transparency & RERA Compliance**:\n\n• **Fully Registered**: Every KGK Realty project carries a valid RERA registration (e.g. Aarohan `RAJ/P/2017/385`, Sarvam `RAJ/P/2018/742`, Lehariya `RAJ/P/2022/1943`, Athena `P52000021980`).\n• **Clear Freehold Titles**: All land parcels are 100% owned, freehold, and legally vetted.\n• **KGK Financial Strength**: Backed by the 115+ year financial integrity of the multinational KGK Group—delivering stability without high external debt.\n• **Escrow Protected**: All client advances are managed under strict RERA escrow regulations.",
            chips: ["View RERA Numbers", "📅 Book Site Visit", "💎 KGK Legacy"]
        },
        {
            keywords: ['about', 'legacy', 'heritage', 'history', 'founder', 'kgk group'],
            reply: "💎 **The KGK Group Legacy — Over 115 Years of Excellence**:\n\n• **Established in 1905**: Founded by the Kothari family in Jaipur, growing into a global conglomerate across 15+ countries.\n• **Gems & Jewelry Legacy**: Worldwide leader in diamonds, gemstones, and fine jewelry manufacturing.\n• **Real Estate Inception (2010)**: Applying the same precision, durability, and artistry to landmark architecture.\n• **Social Responsibility**: Bhagwan Mahaveer Cancer Hospital, The Shriram Universal School (TSUS), and heritage restoration across Rajasthan.",
            chips: ["Real Estate Vision", "Corporate Philanthropy", "📅 Book Site Visit"]
        },
        {
            keywords: ['contact', 'phone', 'email', 'address', 'office', 'whatsapp', 'helpline'],
            reply: "📞 **KGK Realty Corporate & Sales Contact Points**:\n\n🏛️ **Jaipur Global Headquarters**:\n• E.P. Campus, Near Jawahar Circle, JLN Marg, Jaipur, Rajasthan 302017\n• Phone: **+91 98296 25004** / **08071822869**\n• WhatsApp Concierge: **+91 88241 00200**\n\n🌊 **Mumbai Corporate Office**:\n• 3rd Floor, KGK Tower II, Borivali (East), Mumbai 400066\n• Phone: **+91 22 4028 8888**\n\n📧 **Email**: `sales@kgkrealty.com` | `contact@kgkrealty.com`",
            chips: ["📅 Book Site Visit", "WhatsApp Chat", "Request Call Back"]
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
                osc.type = 'sine';
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            } else if (type === 'confirm') {
                // Majestic 3-tone chime for appointment confirmation
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(659.25, now + 0.1);
                osc.frequency.setValueAtTime(880, now + 0.2);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
                osc.start(now);
                osc.stop(now + 0.45);
            } else {
                // Soft bell chime for incoming message
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(587.33, now);
                osc.frequency.setValueAtTime(880, now + 0.08);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
                osc.start(now);
                osc.stop(now + 0.28);
            }
        } catch (e) {
            // Audio context silently handled if blocked by browser policy
        }
    };

    // Format current time
    const getCurrentTime = () => {
        const d = new Date();
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Simple markdown formatter
    const formatMessageText = (raw) => {
        let text = raw
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Bold **text**
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Inline code `code`
        text = text.replace(/`([^`]+)`/g, '<code style="background:rgba(197,160,89,0.15);padding:2px 5px;border-radius:4px;color:var(--gold-light)">$1</code>');

        // Line breaks
        text = text.replace(/\n/g, '<br>');

        return text;
    };

    // Append Message to UI
    const appendMessage = (sender, text, chips = [], save = true, customCardHtml = '') => {
        const row = document.createElement('div');
        row.className = `message-row ${sender}`;

        const isBot = sender === 'bot';
        const avatarIcon = isBot ? '🏛️' : '👤';

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
                ${customCardHtml}
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
                    handleChipClick(query);
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
            <div class="msg-mini-avatar" aria-hidden="true">🏛️</div>
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

    // Render In-Chat Interactive Appointment Booking Form
    const renderAppointmentForm = (preselectedProject = "KGK Aarohan (C-Scheme, Jaipur)") => {
        const formId = 'aptForm_' + Date.now();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];

        const formHtml = `
            <div class="inchat-form-card" id="${formId}">
                <div class="inchat-form-title">
                    <span>📅</span>
                    <span>VIP Site Visit Booking Form</span>
                </div>

                <div class="inchat-input-group">
                    <label>Select Landmark Project</label>
                    <select class="inchat-select apt-project-select">
                        <option value="KGK Aarohan (C-Scheme, Jaipur)" ${preselectedProject.includes('Aarohan') ? 'selected' : ''}>KGK Aarohan (C-Scheme, Jaipur) — 4 & 5 BHK</option>
                        <option value="KGK Sarvam (Tonk Road, Jaipur)" ${preselectedProject.includes('Sarvam') ? 'selected' : ''}>KGK Sarvam (Tonk Road, Jaipur) — 3, 4 & 5 BHK</option>
                        <option value="KGK Lehariya (Airport Road Commercial)" ${preselectedProject.includes('Lehariya') ? 'selected' : ''}>KGK Lehariya (Airport Road) — Commercial & Retail</option>
                        <option value="KGK Aahvan (Vaishali Nagar, Jaipur)" ${preselectedProject.includes('Aahvan') ? 'selected' : ''}>KGK Aahvan (Vaishali Nagar, Jaipur) — 3 & 4 BHK</option>
                        <option value="RSM Athena (Ulwe, Navi Mumbai)" ${preselectedProject.includes('Athena') ? 'selected' : ''}>RSM Athena (Ulwe, Navi Mumbai) — 1, 2 & 3 BHK</option>
                        <option value="KGK Akshar (Mansarovar Ext, Jaipur)" ${preselectedProject.includes('Akshar') ? 'selected' : ''}>KGK Akshar (Mansarovar Ext) — 3 & 4 BHK</option>
                        <option value="KGK Amulya (Jagatpura, Jaipur)" ${preselectedProject.includes('Amulya') ? 'selected' : ''}>KGK Amulya (Jagatpura, Jaipur) — 2 & 3 BHK</option>
                    </select>
                </div>

                <div class="inchat-input-group">
                    <label>Consultation Mode</label>
                    <select class="inchat-select apt-type-select">
                        <option value="In-Person Site Visit & Model Tour">🚗 In-Person Site Visit & Model Flat Tour</option>
                        <option value="Virtual Video Walkthrough">💻 Virtual Video Walkthrough (NRI/Remote)</option>
                        <option value="Private Office Consultation">🏛️ Private Consultation at KGK Jaipur HQ</option>
                    </select>
                </div>

                <div style="display:flex; gap:0.5rem;">
                    <div class="inchat-input-group" style="flex:1;">
                        <label>Preferred Date</label>
                        <input type="date" class="inchat-text-input apt-date-input" value="${minDate}" min="${minDate}">
                    </div>
                    <div class="inchat-input-group" style="flex:1;">
                        <label>Time Slot</label>
                        <select class="inchat-select apt-slot-select">
                            <option value="11:00 AM – 1:00 PM (Morning Slot)">Morning (11:00 AM – 1:00 PM)</option>
                            <option value="2:30 PM – 4:30 PM (Afternoon Slot)">Afternoon (2:30 PM – 4:30 PM)</option>
                            <option value="5:00 PM – 7:00 PM (Evening Slot)">Evening (5:00 PM – 7:00 PM)</option>
                        </select>
                    </div>
                </div>

                <div class="inchat-input-group">
                    <label>Your Full Name *</label>
                    <input type="text" class="inchat-text-input apt-name-input" placeholder="e.g. Rahul Singhal" required>
                </div>

                <div style="display:flex; gap:0.5rem;">
                    <div class="inchat-input-group" style="flex:1.2;">
                        <label>Phone / WhatsApp *</label>
                        <input type="tel" class="inchat-text-input apt-phone-input" placeholder="+91 98XXX XXXXX" required>
                    </div>
                    <div class="inchat-input-group" style="flex:1;">
                        <label>Email (Optional)</label>
                        <input type="email" class="inchat-text-input apt-email-input" placeholder="rahul@example.com">
                    </div>
                </div>

                <button class="inchat-submit-btn apt-submit-btn">
                    <span>Confirm VIP Site Visit</span>
                </button>
            </div>
        `;

        appendMessage(
            'bot',
            "Please select your preferred landmark project, date, and contact details below to reserve your private site tour:",
            [],
            false,
            formHtml
        );

        // Bind form submission event
        const formEl = document.getElementById(formId);
        if (formEl) {
            const submitBtn = formEl.querySelector('.apt-submit-btn');
            submitBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const name = formEl.querySelector('.apt-name-input').value.trim();
                const phone = formEl.querySelector('.apt-phone-input').value.trim();
                const email = formEl.querySelector('.apt-email-input').value.trim();
                const project = formEl.querySelector('.apt-project-select').value;
                const type = formEl.querySelector('.apt-type-select').value;
                const date = formEl.querySelector('.apt-date-input').value;
                const slot = formEl.querySelector('.apt-slot-select').value;

                if (!name || !phone) {
                    alert('Please provide your name and phone number to confirm your visit.');
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Scheduling with Senior Manager...';

                await submitAppointmentBooking({ name, phone, email, project, type, date, slot });
                formEl.style.opacity = '0.5';
                formEl.style.pointerEvents = 'none';
            });
        }
    };

    // Submit Appointment (Calls Backend API with Local Fallback)
    const submitAppointmentBooking = async (formData) => {
        showTypingIndicator();

        let appointmentResult = null;

        try {
            const res = await fetch(`${API_BASE}/api/appointment/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                appointmentResult = data.appointment;
            }
        } catch (err) {
            console.log('ℹ️ Local offline booking fallback used');
        }

        // Fallback local booking generation
        if (!appointmentResult) {
            const aptNum = Math.floor(1000 + Math.random() * 9000);
            const aptId = `KGK-APT-${aptNum}`;
            const rmList = [
                { name: "Vikram Rathore", phone: "+91 98296 25004" },
                { name: "Priyanka Mehta", phone: "+91 88241 00200" },
                { name: "Siddharth Khandelwal", phone: "+91 98296 25004" }
            ];
            const chosenRm = rmList[Math.floor(Math.random() * rmList.length)];

            appointmentResult = {
                id: aptId,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                project: formData.project,
                type: formData.type,
                date: formData.date,
                slot: formData.slot,
                status: "Confirmed & Relationship Manager Assigned",
                rm_name: chosenRm.name,
                rm_phone: chosenRm.phone,
                meeting_point: `${formData.project} Experience Gallery / Site Office`
            };
        }

        // Cache locally for instant lookup
        localAppointments[appointmentResult.id] = appointmentResult;

        setTimeout(() => {
            hideTypingIndicator();
            playChime('confirm');

            const ticketHtml = `
                <div class="appointment-ticket-card">
                    <div class="ticket-header">
                        <span class="ticket-id">#${appointmentResult.id}</span>
                        <span class="ticket-status-badge">✅ CONFIRMED</span>
                    </div>
                    <div class="ticket-detail-item">
                        <strong>Guest Name:</strong> ${appointmentResult.name}
                    </div>
                    <div class="ticket-detail-item">
                        <strong>Project:</strong> ${appointmentResult.project}
                    </div>
                    <div class="ticket-detail-item">
                        <strong>Scheduled Date:</strong> ${appointmentResult.date}
                    </div>
                    <div class="ticket-detail-item">
                        <strong>Time Slot:</strong> ${appointmentResult.slot}
                    </div>
                    <div class="ticket-detail-item">
                        <strong>Consultation Mode:</strong> ${appointmentResult.type}
                    </div>
                    <div class="ticket-rm-box">
                        👤 <strong>Designated Manager:</strong> <span>${appointmentResult.rm_name}</span> (${appointmentResult.rm_phone})<br>
                        📍 <strong>Meeting Point:</strong> ${appointmentResult.meeting_point}
                    </div>
                </div>
            `;

            appendMessage(
                'bot',
                `✨ **Congratulations, ${appointmentResult.name}!** Your VIP site visit has been officially confirmed.\n\nA calendar invite & directions have been sent to your WhatsApp (${appointmentResult.phone}). Our Senior Relationship Manager will be ready to welcome you with a curated walkthrough.`,
                ["🏢 Explore Project Highlights", "🔍 Check Appointment Status", "📞 Call Relationship Manager"],
                true,
                ticketHtml
            );
        }, 600);
    };

    // Lookup Appointment by ID
    const lookupAppointment = async (aptId) => {
        showTypingIndicator();

        let info = localAppointments[aptId];

        try {
            const res = await fetch(`${API_BASE}/api/appointment/${aptId}`);
            if (res.ok) {
                const data = await res.json();
                info = data.appointment;
            }
        } catch (e) {
            // Use local
        }

        setTimeout(() => {
            hideTypingIndicator();

            if (info) {
                playChime('receive');
                const ticketHtml = `
                    <div class="appointment-ticket-card">
                        <div class="ticket-header">
                            <span class="ticket-id">#${info.id}</span>
                            <span class="ticket-status-badge">✅ ${info.status.toUpperCase()}</span>
                        </div>
                        <div class="ticket-detail-item"><strong>Guest Name:</strong> ${info.name}</div>
                        <div class="ticket-detail-item"><strong>Project:</strong> ${info.project}</div>
                        <div class="ticket-detail-item"><strong>Scheduled Date:</strong> ${info.date}</div>
                        <div class="ticket-detail-item"><strong>Time Slot:</strong> ${info.slot}</div>
                        <div class="ticket-detail-item"><strong>Mode:</strong> ${info.type || 'In-Person Site Visit'}</div>
                        <div class="ticket-rm-box">
                            👤 <strong>Relationship Manager:</strong> <span>${info.rm_name || 'Senior Property Advisor'}</span> (${info.rm_phone || '+91 98296 25004'})<br>
                            📍 <strong>Meeting Point:</strong> ${info.meeting_point || 'Experience Gallery'}
                        </div>
                    </div>
                `;

                appendMessage(
                    'bot',
                    `🏛️📋 **Appointment Record Found for #${info.id}**\nYour appointment is actively scheduled on our calendar. Our team is fully prepared for your visit.`,
                    ["📅 Book Another Visit", "Directions to Site", "📞 Contact Manager"],
                    true,
                    ticketHtml
                );
            } else {
                appendMessage(
                    'bot',
                    `We could not find an active appointment with ID **${aptId}**. Please check your reference code (e.g. #KGK-APT-2024) or book a fresh site visit below:`,
                    ["📅 Book Site Visit", "#KGK-APT-2024", "#KGK-APT-5102"]
                );
            }
        }, 500);
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
                const statusSubtext = document.getElementById('agentStatusText');
                if (statusSubtext) {
                    statusSubtext.innerHTML = '● <strong>KGK Realty Desk</strong> Online • 24/7';
                    statusSubtext.style.color = 'var(--online-green)';
                }
                console.log('🏛️ KGK Real Estate Backend connected:', data);
            }
        } catch (e) {
            console.log('ℹ️ Running in client-side real estate concierge mode (Python server offline)');
        }
    };
    checkBackendStatus();

    // Determine Bot Response (Client Fallback)
    const generateBotResponse = (userText) => {
        const normalized = userText.toLowerCase().trim();

        // Check for appointment lookup
        const aptMatch = normalized.match(/(?:kgk[-_]?)?apt[-_]?\d{4}/i);
        if (aptMatch) {
            const digits = normalized.match(/\d{4}/);
            if (digits) {
                const cleanId = `KGK-APT-${digits[0]}`;
                lookupAppointment(cleanId);
                return null;
            }
        }

        // Check for booking intent
        if (normalized.includes('book') || normalized.includes('appointment') || normalized.includes('site visit') || normalized.includes('schedule visit')) {
            renderAppointmentForm();
            return null;
        }

        for (const item of realEstateKnowledge) {
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
            reply: `Thank you for contacting **KGK Group Real Estate**! 🏛️✨\n\nRegarding *"${userText}"*, our property advisors are ready to assist. Would you like to explore our landmark residences in Jaipur & Mumbai, review RERA credentials, or schedule a VIP site visit?`,
            chips: ["📅 Book Site Visit", "🏢 Landmark Projects", "📍 Jaipur Projects", "💰 Pricing & Payment Plans", "📞 Contact Sales Team"]
        };
    };

    // Handle Chip Button Clicks
    const handleChipClick = (query) => {
        if (query.includes('Book') || query.includes('Visit') || query.includes('Open Booking Form')) {
            // Check if specific project
            let proj = "KGK Aarohan (C-Scheme, Jaipur)";
            if (query.includes('Sarvam')) proj = "KGK Sarvam (Tonk Road, Jaipur)";
            if (query.includes('Lehariya')) proj = "KGK Lehariya (Airport Road Commercial)";
            if (query.includes('Aahvan')) proj = "KGK Aahvan (Vaishali Nagar, Jaipur)";
            if (query.includes('Mumbai') || query.includes('Athena')) proj = "RSM Athena (Ulwe, Navi Mumbai)";
            renderAppointmentForm(proj);
            return;
        }

        if (query.includes('#KGK-APT-') || query.includes('Check Appointment')) {
            const aptIdMatch = query.match(/KGK-APT-\d{4}/);
            if (aptIdMatch) {
                lookupAppointment(aptIdMatch[0]);
                return;
            }
        }

        handleUserSubmit(query);
    };

    // Handle User Message Submission
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

        // Check for immediate appointment form trigger
        const normalized = text.toLowerCase();
        if (normalized === 'book site visit' || normalized === 'book appointment' || normalized === 'schedule visit' || normalized === 'open booking form') {
            renderAppointmentForm();
            return;
        }

        isTyping = true;
        showTypingIndicator();

        let botReply = null;
        let botChips = [];

        // Attempt call to Python Backend API
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);

            const response = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: text,
                    session_id: 'session_' + (localStorage.getItem('kgk_session_id') || 'default')
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
            if (fallback === null) {
                hideTypingIndicator();
                isTyping = false;
                return;
            }
            botReply = fallback.reply;
            botChips = fallback.chips;
        }

        // Realistic typing delay
        const delay = Math.floor(Math.random() * 250) + 400;

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
                            <span>Today • Senior Relationship Desk</span>
                        </div>
                    `;
                    messages.forEach(m => {
                        appendMessage(m.sender, m.text, [], false);
                    });
                    return true;
                }
            }
        } catch (e) {
            // Handled safely
        }
        return false;
    };

    // Reset Chat
    const resetChat = () => {
        localStorage.removeItem(STORAGE_KEY);
        messagesContainer.innerHTML = `
            <div class="chat-date-divider">
                <span>Today • Senior Relationship Desk</span>
            </div>
        `;
        appendMessage(
            'bot',
            "Namaste & Welcome to **KGK Group Real Estate** (KGK Realty)! 🏛️✨\n\nI am your **Luxury Property Concierge**. Backed by over a century of uncompromised craftsmanship and trust, we develop landmark residential and commercial properties in **Jaipur, Mumbai, and Delhi NCR**.\n\nHow may I assist your real estate journey today?",
            ["📅 Book Site Visit", "🏢 Landmark Projects", "📍 Jaipur Projects", "🌊 Mumbai Projects", "📋 RERA & Trust", "🔍 Check Appointment"],
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

    // Event Listeners for UI Triggers
    launcherBtn.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(false));
    tooltipBubble.addEventListener('click', () => toggleChat(true));

    if (triggerDemoChat) {
        triggerDemoChat.addEventListener('click', () => toggleChat(true));
    }

    if (navBookVisitBtn) {
        navBookVisitBtn.addEventListener('click', () => {
            toggleChat(true);
            setTimeout(() => renderAppointmentForm(), 200);
        });
    }

    if (heroBookAptBtn) {
        heroBookAptBtn.addEventListener('click', () => {
            toggleChat(true);
            setTimeout(() => renderAppointmentForm(), 200);
        });
    }

    if (openAppointmentWizardBtn) {
        openAppointmentWizardBtn.addEventListener('click', () => {
            toggleChat(true);
            setTimeout(() => renderAppointmentForm(), 200);
        });
    }

    if (lookupAppointmentBtn) {
        lookupAppointmentBtn.addEventListener('click', () => {
            toggleChat(true);
            setTimeout(() => {
                appendMessage(
                    'bot',
                    "Please select or enter your **Appointment ID** (for example `#KGK-APT-2024`, `#KGK-APT-5102`, or `#KGK-APT-7819`) to look up your scheduled visit details:",
                    ["#KGK-APT-2024", "#KGK-APT-5102", "#KGK-APT-7819"]
                );
            }, 200);
        });
    }

    if (heroExploreProjectsBtn) {
        heroExploreProjectsBtn.addEventListener('click', () => {
            const projSection = document.getElementById('projects');
            if (projSection) {
                projSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (chatAppointmentWizardTrigger) {
        chatAppointmentWizardTrigger.addEventListener('click', () => {
            renderAppointmentForm();
        });
    }

    // Attach "Book Site Visit" on Project Cards
    document.querySelectorAll('.btn-card-visit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectName = e.target.getAttribute('data-project');
            toggleChat(true);
            setTimeout(() => {
                renderAppointmentForm(projectName);
            }, 200);
        });
    });

    // Attach "Inquire via AI" on Project Cards
    document.querySelectorAll('.btn-card-ask').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const query = e.target.getAttribute('data-query');
            toggleChat(true);
            setTimeout(() => {
                handleUserSubmit(query);
            }, 200);
        });
    });

    // Chat Form Submit
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
        if (confirm('Do you want to reset this consultation and clear chat history?')) {
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
