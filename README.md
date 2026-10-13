# LifeLink Sri Lanka – Blood Donor Management System
> **"A Drop of Hope, Give Blood, Give Life"**

LifeLink is a production-oriented, full-stack blood donor management web application specifically designed for **Sri Lanka**, initially focusing on the **Jaffna District** and covering all 25 districts across all 9 provinces.

---

## 1. System Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Leaflet.js (OpenStreetMap)
- **Interactive Full-Stack Dev Server**: Express.js with Vite middleware (`server.ts`) hosting live REST endpoints, persistent database state, and real-time Leaflet map rendering.
- **Backend Architecture**: Python 3, Django, Django REST Framework, CORS Headers (`/backend`)
- **Database Engine**: MySQL 8 (SQL-compatible schema in `backend/mysql_schema.sql` and Django migrations in `backend/core/migrations/`)
- **Localization**: English, Tamil (தமிழ்), and Sinhala (සිංහල) with instant UI language switching.
- **Timezone & Locale**: `Asia/Colombo`, Currency: LKR, Phone Validation: Sri Lankan `+94` format.

---

## 2. Key Features

1. **Pixel-Perfect UI Matching Design Reference**:
   - Deep blood red (`#B80024`), soft rose pink, and clean medical typography.
   - Hero section with live database stats, floating action badges ("Donate", "Request", "Search").
   - 4-step "How It Works" and "Why Donate Blood?" informative sections.
   - Emergency medical notices with Sri Lanka's **1990 Suwa Seriya** and regional hospital blood banks.

2. **Find Blood Donors with Interactive Sri Lanka Map**:
   - Filter by blood group (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`), district, and search radius.
   - Privacy-safe donor cards with distance estimation and location.
   - Interactive OpenStreetMap (Leaflet) with satellite/standard toggles and interactive donor popups.
   - Secure Contact Request modal that shields the donor's private phone number and home coordinates.

3. **Emergency Blood Request System**:
   - Submit emergency requests with patient details, required units, urgency level, and hospital selection (e.g., Teaching Hospital Jaffna, Tellippalai, NHSL).
   - Instant unique tracking ID generation (`REQ-LK-2024-XXX`).
   - Automatically dispatched to the requester dashboard and admin dashboard.

4. **Multi-Role Dashboards**:
   - **Admin Command Center**: Real-time Recharts analytics (monthly trends, district requests, blood group distribution), donor verify/suspend actions, request status coordinator, contact message inbox, campaign creator, and downloadable CSV reports.
   - **Donor Dashboard**: Personal profile, availability toggle switch, preferred locations checklist (Jaffna, Vaddukoddai, Chulipuram, Araly), incoming patient requests (Accept/Decline), and verified donation history.
   - **Requester Dashboard**: Overview KPI cards (Total donations, lives helped, community points) and live blood request status tracking.

---

## 3. Quick Demo Login Accounts

| Role | Name | Email | District / Blood Group |
|---|---|---|---|
| **Donor** | Divya K. | `divya@lifelink.lk` | Jaffna • O+ |
| **Requester** | Ravi S. | `ravi@lifelink.lk` | Jaffna |
| **Admin** | Dr. Ketheeswaran M. | `admin@lifelink.lk` | Jaffna / National |

*Use the quick role switcher in the top navigation bar or the 1-Click buttons in the Login modal for instant evaluation.*

---

## 4. Local Development Setup in VS Code

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- MySQL 8.0 Server & MySQL Workbench

### Running the Live Full-Stack App (Current Environment)
```bash
# 1. Install dependencies
npm install

# 2. Run the fullstack server (Express API + Vite Frontend on port 3000)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Setting up the Django & MySQL Backend Locally

### A. Creating the Database in MySQL Workbench
1. Open **MySQL Workbench** and connect to your local MySQL 8 server.
2. Open the file `backend/mysql_schema.sql` (File > Open SQL Script).
3. Execute the script (lightning icon). This creates the `lifelink_db` database, normalized tables, and indexes.

### B. Configuring Django Environment
```bash
cd backend
python -m venv venv

# On Linux/macOS:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Create .env file
cat <<EOT >> .env
DB_NAME=lifelink_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306
DJANGO_SECRET_KEY=your_secret_key_here
DEBUG=True
EOT
```

### C. Running Migrations and Creating Superuser
```bash
# Apply migrations to MySQL
python manage.py migrate

# Create the administrator superuser
python manage.py createsuperuser
# Username: admin
# Email: admin@lifelink.lk
# Password: [Your secure password]

# Run the Django development server
python manage.py runserver 8000
```
Django Admin will be available at [http://localhost:8000/admin/](http://localhost:8000/admin/) and the REST API at [http://localhost:8000/api/](http://localhost:8000/api/).

---

## 6. Testing Main Workflows

1. **Donor Availability Toggle**:
   - Log in as Divya K. (`divya@lifelink.lk`).
   - Navigate to **Donor Dashboard** > Toggle "Available for Donation" and change preferred locations.
   - Click **Save Changes** and notice immediate persistence.
2. **Emergency Request Pipeline**:
   - Go to **Request Blood** > Fill in Patient Name ("Thavaratnam V."), select "Teaching Hospital Jaffna", 2 units of O+, and submit.
   - Note the generated Request ID and switch to **Requester Dashboard** to view the active status.
   - Switch to **Admin Dashboard** > view the incoming request, update status to "Fulfilled".
3. **Privacy-Safe Donor Search**:
   - Navigate to **Find Donors** > Filter by "O+" and "Jaffna".
   - Click on Tharshan K. on the map or donor card > click **Contact** to open the secure request modal.
4. **Reports Export**:
   - Go to **Admin Dashboard** > Click **Export Donors CSV** or **Export Requests CSV** to download real CSV datasets.

---

## 7. Sri Lankan Emergency Medical Notice
LifeLink coordinates voluntary community blood donors and does not replace official Sri Lankan medical emergency services. In acute trauma or critical surgery cases, contact **1990 Suwa Seriya** or the **Teaching Hospital Jaffna Blood Bank (+94 21 222 2261)** directly.
