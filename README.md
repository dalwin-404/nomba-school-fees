# 🎓 SchoolPay (Powered by Nomba)

> **DevCareer x Nomba Hackathon Submission**
> Eliminating manual school fee accounting with automated reconciliation and Nomba Virtual Accounts.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)

---

## 📖 The Problem
Schools process hundreds of fee payments per term, usually via manual bank transfers. Administrators spend countless hours hunting down receipts, matching transaction narratives to students, and manually updating ledgers. This process is prone to human error, fraud, and misdirected funds.

## 🚀 Our Solution: SchoolPay
SchoolPay is a modern financial dashboard built specifically for educational institutions. By leveraging **Nomba's Virtual Accounts**, we instantly provision a unique, dedicated bank account for every student. When a parent makes a transfer to their child's virtual account, SchoolPay receives an automated Webhook, perfectly matches the transaction to the student, and reconciles the school's ledger in real-time. **Zero manual entry required.**

---

## ✨ Key Features & Technical Highlights

### 1. 🤖 Automated Reconciliation Engine
A robust backend system that evaluates incoming Nomba transactions against a student's expected termly fees. It instantly calculates overpayments, underpayments, and updates the student's status (`PAID`, `PARTIAL`, `OVERDUE`) without human intervention.

### 2. 🔐 Production-Grade Webhooks & Idempotency
We implemented a highly secure `/api/webhooks/nomba` endpoint that:
- Verifies Nomba's signature to ensure payload authenticity.
- Uses database-level idempotency to completely prevent duplicate transaction logging in case of webhook retries.
- Safely handles edge cases like misdirected payments (payments made to deactivated or unrecognized accounts).

### 3. 🎨 Premium UI / UX Design
A world-class dashboard designed with a heavy focus on user experience.
- **Glassmorphism & Micro-animations:** A stunning interface featuring glowing ambient backgrounds and dynamic hover states.
- **Interactive Data Visualization:** Custom Recharts integrations for real-time revenue analytics.
- **Command Palette (Cmd+K):** A native, keyboard-first navigation system for power users.
- **Visual Progress Rings:** Intuitive SVG data-rings on student cards to instantly convey payment completion status at a glance.

### 4. 🗄️ Scalable Architecture (Supabase)
Relational Postgres schema cleanly separating `schools`, `students`, `fees`, `virtual_accounts`, and `transactions` for massive scalability.

---

## 🧪 How to Test the Demo (Reviewer Guide)

To easily test the platform's reconciliation engine without needing to perform real Nomba bank transfers, we have built a secure Demo Data generator directly into the dashboard.

**1. Log in to the Application:**
- **URL:** `https://nomba-school-fees.vercel.app/login`
- **Email:** `demo@school.com`
- **Password:** `password123`

**2. Generate Mock Data:**
Once logged in to the dashboard, click the **"Generate Demo Data"** button at the top of the page. This securely calls our protected `POST /api/mock/demo-setup` endpoint, which automatically:
- Provisions 5 test students.
- Generates Virtual Accounts for them.
- Injects simulated financial transactions (including underpayments, complete payments, and overpayments).
- Instantly runs the Reconciliation Engine and brings the dashboard charts and activity feeds to life.

---

## 🛠️ Local Development Setup

If you wish to run the project locally:

**1. Clone the repository**
```bash
git clone https://github.com/your-username/nomba-school-fees.git
cd nomba-school-fees
```

**2. Install Dependencies**
```bash
npm install
```

**3. Configure Environment Variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NOMBA_CLIENT_ID=your_nomba_client_id
NOMBA_CLIENT_SECRET=your_nomba_client_secret
NOMBA_ACCOUNT_ID=your_nomba_account_id
```

**4. Start the Application**
```bash
npm run dev
```
Navigate to `http://localhost:3000`.

---

## 🏆 Why SchoolPay Stands Out
* **Built for Scale:** The underlying architecture treats Nomba Virtual Accounts not as an afterthought, but as the core infrastructural layer of student data mapping.
* **Flawless Type Safety:** 100% strict TypeScript compliance across frontend components and backend API routes.
* **Day-1 Usability:** By designing the UI to feel like a premium SaaS application, school administrators require zero training to immediately understand their financial position.
