# Dr. Muhammad Naeem - Consultant Surgeon Website & Clinic Management System

A modern, responsive, high-performance medical website and clinic management portal designed for **Dr. Muhammad Naeem (Consultant Surgeon in Faisalabad)** specializing in Breast Cancer, Thyroid Conditions, and General Surgery.

---

## 🌟 Key Features

1. **Patient Registration & Proper Doctor Appointments**:
   - Comprehensive registration fields: Patient Full Name, Phone / WhatsApp, Age, Gender, City, Hospital Branch, Clinical Specialty, Preferred Date, and Preferred Time Slot.
   - Live **Consultation Fee in Rupees (Rs.)** dynamically loaded from doctor settings.
   - Generates unique **Digital Consultation Token Slips** (e.g., `SLIP-4821`).

2. **2 Role-Based Logins**:
   - **🩺 Role 1: Doctor / Super Admin** (`admin` / `admin123`)
     - Complete oversight: Doctor Schedule & OPD Timings Manager (Kardaar & Faisal hospitals), Consultation Fees in Rupees (Rs. 2,000 standard, Rs. 1,500 follow-up), Financial & Revenue summary in Rupees (Paid vs Pending), Master Appointments table, Patient Directory, Staff & Receptionist account creation, and Blog Manager.
   - **📋 Role 2: Front Desk Receptionist** (`receptionist` / `recep123`)
     - Walk-in / Phone patient registration & quick appointment booking.
     - Live Queue Management: Track waiting patients, consultation with doctor, and completed visits.
     - Fee collection in Rupees (Cash, JazzCash, EasyPaisa, Bank).
     - **WhatsApp Appointment Slip Dispatcher**: 1-click sends complete official token slip, doctor details, hospital address & Google Maps link, and consultation fee in rupees directly to patient's WhatsApp!
     - Direct **Slip Printing** formatted for clean counter receipts.

3. **Bilingual Support (English & Urdu)**:
   - One-click interactive toggle switches between English and Urdu with native RTL (Right-to-Left) typography.

4. **Hospital Affiliations**:
   - Interactive location cards and Google Maps integration for:
     - **Kardaar Hospital**: Mon-Thu 4:00 PM - 7:00 PM (Plot No 5, Kohinoor City Madina Town, Faisalabad)
     - **Faisal Hospital**: Fri-Sat 6:00 PM - 9:00 PM (673-A Lower Canal Rd E, People's Colony No 1, Faisalabad)

5. **Patient Portal**:
   - Patients can sign in with their contact number to view their upcoming consultation slots and digital token slips.

---

## 🔑 Login Credentials

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Doctor / Super Admin** | `admin` | `admin123` | Full Access: Schedule, Timings, Rupees Fees, Master Records, Staff Accounts |
| **Front Desk Receptionist** | `receptionist` | `recep123` | Queue Desk, Register Patients, Issue Slips, Send WhatsApp Slips with Rupees |

---

## 📁 File Structure

```text
Doctor website/
├── index.html                  # Main Website & Patient Registration Booking
├── admin.html                  # Dual-Role Clinic Management Portal (Admin & Receptionist)
├── styles.css                  # Design System, Responsive Layout & Printable Slip Styles
├── script.js                   # Application Logic, Persistence, Queue & WhatsApp Dispatcher
├── images/
│   ├── dr-naeem.png            # Consultant Surgeon Profile Photo
│   └── hero.png                # Hero Banner
├── blog/
│   ├── index.html              # Patient Articles Listing
│   ├── thyroid-nodules-when-to-worry.html
│   ├── preparing-for-surgery-patients-guide.html
│   └── understanding-breast-cancer-early-signs.html
├── .gitignore
└── README.md
```

---

## 🚀 GitHub Connection

The repository is linked to GitHub:
- **Remote Repository**: `https://github.com/raiabrarhossain/drnaeem-website.git`
- **Main Branch**: `main`

To sync and push changes:
```bash
git add .
git commit -m "Add dual-role login (Admin & Receptionist), patient appointment registration, schedule manager, and WhatsApp slip in rupees"
git push origin main
```

---

## 📞 Contact Information
- **Doctor**: Dr. Muhammad Naeem (Consultant Surgeon)
- **Phone / WhatsApp**: `03007991099` (+923007991099)
- **Locations**: Kardaar Hospital & Faisal Hospital, Faisalabad, Punjab
