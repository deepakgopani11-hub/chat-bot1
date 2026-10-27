# 🍫 Manam Chocolate — Indian Craft Chocolate™ AI Concierge

A specialized, luxury AI Concierge chatbot trained on authentic domain knowledge from **[Manam Chocolate](https://manamchocolate.com/)**, India's leading craft chocolate brand.

Anchored in the **bottom-right corner** of the website with animated micro-interactions, quick-action chips, audio chimes, temperature storage guides, melt-free shipping policies, and a **Python backend server**.

---

## 🌾 Trained Domain Knowledge (Manam Chocolate)

The chatbot has been trained with comprehensive information collected directly from `manamchocolate.com`:

1. **Origin & Founder**:
   - **Founder**: Chaitanya Muppala.
   - **Terroir**: Directly partnered with 100+ cacao farmers in **West Godavari**, Andhra Pradesh, where cacao grows alongside coconut, banana, and black pepper.
   - **Fermentation**: Proprietary 5-step box fermentation at the **Distinct Origins Fermentery** in Tadikalapudi.
2. **Product Library & Pricing**:
   - **Single-Origin Tablets**: 60% Dark Milk, 66% Dark (*Silver Award, Academy of Chocolate London*), 69% Dark, 80% Dark, 100% Pure Dark (₹375–₹495, 80g).
   - **Single Farm Series**: GVS Prasad Farm harvest editions.
   - **Chocolate Lab Editions**: Fruit and spice infusions like *Pedda Rasalu Mango* and *Chakkarakeli Banana* (₹495–₹675).
   - **Indulgence & Bonbons**: Hand-painted edible jewels with single-origin ganaches and nut pralines (₹1,000–₹2,500+).
   - **Snacking Barks & Dragees**: Roasted hazelnuts, almonds, cacao nibs, and signature thins (₹350–₹950).
3. **The Hyderabad Karkhana Experience**:
   - Flagship 10,000 sq.ft. experiential sanctuary on **Road No. 12, Banjara Hills, Hyderabad**.
   - Live factory conching, interactive make-your-own chocolate lab, and an all-day specialty café.
   - Beverage Bar at Sattva Knowledge City, Hitec City.
4. **Melt-Free Shipping & Cold-Pack Packaging**:
   - Pan-India shipping in insulated thermal packaging with food-grade gel ice packs.
   - Real-time simulated order tracking (e.g. `#MNM-40291`, `#MNM-88219`, `#MNM-10423`).
5. **Storage & Tasting**:
   - Optimal storage temperature: **16°C – 20°C** away from strong odors.
   - Room rest guide: 10 minutes before tasting for optimal melt and flavor release.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Optional: Add Gemini AI Key for Supercharged Generative Answers
Create a `.env` file (copied from `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If left empty, the bot automatically uses the rich built-in Manam Chocolate rule database).*

### 3. Start the Python Backend
```bash
python app.py
```
Open **http://localhost:5000/** in your browser to experience the Concierge!

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns backend status (`brand: Manam Chocolate`) |
| `POST` | `/api/chat` | Send `{ "message": "...", "session_id": "..." }` to query the concierge |
| `GET` | `/api/orders/<id>` | Lookup cold-pack shipment status by Order ID (`#MNM-40291`) |

---

## 🌐 Deployment

Ready for 1-click deployment on **Render** (via `render.yaml`) and **Vercel** (via `vercel.json`).