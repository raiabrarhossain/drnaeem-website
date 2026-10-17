/**
 * Dr. Muhammad Naeem - Consultant Surgeon
 * Clinic Management System, Appointment Booking, Patient Registry & Dual-Portal Logic
 * Roles: Doctor/Admin, Front Desk Receptionist, and Patient Portal
 */

// Global resilient in-memory storage fallback (for Safari private browsing / incognito / quota limits)
window.__memStore = window.__memStore || {};
window.safeStorageGet = (key) => {
  try {
    const val = sessionStorage.getItem(key) || localStorage.getItem(key);
    if (val !== null && val !== undefined) return val;
  } catch (e) {}
  return window.__memStore[key] || null;
};
window.safeStorageSet = (key, val) => {
  window.__memStore[key] = val;
  try { sessionStorage.setItem(key, val); } catch (e) {}
  try { localStorage.setItem(key, val); } catch (e) {}
};
window.safeStorageRemove = (key) => {
  delete window.__memStore[key];
  try { sessionStorage.removeItem(key); } catch (e) {}
  try { localStorage.removeItem(key); } catch (e) {}
};

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. DATA STORAGE & PERSISTENCE HELPERS
  // =========================================================================

  // --- Doctor Schedule & Fee Configuration ---
  window.getDoctorSchedule = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('naeem_doctor_schedule'));
      if (stored && stored.feeStandard) return stored;
    } catch (e) {}

    const defaultSchedule = {
      feeStandard: 2000,
      feeFollowup: 1500,
      feeEmergency: 3000,
      notice: 'Clinic is open. Dr. Muhammad Naeem is consulting as per schedule.',
      kardaar: {
        days: 'Monday to Thursday',
        timings: '4:00 PM - 7:00 PM',
        address: 'Plot No 5, Kohinoor City Madina Town, Faisalabad'
      },
      faisal: {
        days: 'Friday & Saturday',
        timings: '6:00 PM - 9:00 PM',
        address: "673-A Lower Canal Rd E, Block A People's Colony No 1, Faisalabad"
      },
      yashfeen: {
        days: 'Sunday / By Appointment',
        timings: '11:00 AM - 2:00 PM',
        address: 'Muslim Town No. 1, Gate No. 2, Muslim Town Market, Near Rehman Masjid, Sargodha Road, Faisalabad'
      }
    };
    localStorage.setItem('naeem_doctor_schedule', JSON.stringify(defaultSchedule));
    return defaultSchedule;
  };

  window.saveDoctorSchedule = (sched) => {
    localStorage.setItem('naeem_doctor_schedule', JSON.stringify(sched));
  };

  // --- Appointments Store ---
  window.getAppointments = () => {
    try {
      const data = JSON.parse(localStorage.getItem('naeem_appointments'));
      if (Array.isArray(data)) return data;
    } catch (e) {}

    // Seed with realistic demo appointments if empty
    const demoAppts = [
      {
        id: 'appt_101',
        slipNo: 'SLIP-4821',
        name: 'Tariq Mehmood',
        phone: '03007991099',
        age: '45',
        gender: 'Male',
        city: 'Faisalabad',
        hospital: 'Kardaar Hospital',
        concern: 'Thyroid Swelling / Nodules Surgery',
        date: new Date().toISOString().slice(0, 10),
        timeSlot: '04:30 PM - 05:00 PM',
        symptoms: 'Swelling on right thyroid lobe for 4 months',
        feeRupees: 2000,
        paymentStatus: 'Paid',
        paymentMethod: 'Cash',
        status: 'in-consultation',
        createdAt: '16/10/2026, 04:15 PM',
        bookedBy: 'Receptionist'
      },
      {
        id: 'appt_102',
        slipNo: 'SLIP-4822',
        name: 'Zainab Bibi',
        phone: '03217654321',
        age: '38',
        gender: 'Female',
        city: 'Jaranwala',
        hospital: 'Kardaar Hospital',
        concern: 'Breast Cancer Surgery & Evaluation',
        date: new Date().toISOString().slice(0, 10),
        timeSlot: '05:00 PM - 05:30 PM',
        symptoms: 'Palpable breast lump with discomfort',
        feeRupees: 2000,
        paymentStatus: 'Pending',
        paymentMethod: 'Cash',
        status: 'waiting',
        createdAt: '16/10/2026, 04:45 PM',
        bookedBy: 'Website'
      },
      {
        id: 'appt_103',
        slipNo: 'SLIP-4823',
        name: 'Kamran Ashraf',
        phone: '03028889900',
        age: '52',
        gender: 'Male',
        city: 'Samundri',
        hospital: 'Faisal Hospital',
        concern: 'Gallbladder / Hernia / Laparoscopic',
        date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        timeSlot: '06:00 PM - 06:30 PM',
        symptoms: 'Right upper quadrant biliary colic pain',
        feeRupees: 2000,
        paymentStatus: 'Pending',
        paymentMethod: 'Cash',
        status: 'new',
        createdAt: '16/10/2026, 11:30 AM',
        bookedBy: 'Website'
      }
    ];
    localStorage.setItem('naeem_appointments', JSON.stringify(demoAppts));
    return demoAppts;
  };

  window.saveAppointments = (appts) => {
    localStorage.setItem('naeem_appointments', JSON.stringify(appts));
  };

  // --- Patients Directory Store ---
  window.getPatients = () => {
    try {
      const data = JSON.parse(localStorage.getItem('naeem_patients'));
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {}

    // Derive from appointments
    const appts = window.getAppointments();
    const map = {};
    appts.forEach(a => {
      const key = a.phone || a.name;
      if (!map[key]) {
        map[key] = {
          id: 'pat_' + key.replace(/[^0-9a-zA-Z]/g, ''),
          name: a.name,
          phone: a.phone,
          age: a.age || '—',
          gender: a.gender || '—',
          city: a.city || 'Faisalabad',
          totalVisits: 1,
          lastVisit: a.date,
          lastHospital: a.hospital
        };
      } else {
        map[key].totalVisits += 1;
        map[key].lastVisit = a.date;
      }
    });

    const list = Object.values(map);
    localStorage.setItem('naeem_patients', JSON.stringify(list));
    return list;
  };

  window.savePatients = (patients) => {
    localStorage.setItem('naeem_patients', JSON.stringify(patients));
  };

  // Register or update patient record
  window.upsertPatient = (patientData) => {
    const patients = window.getPatients();
    const cleanPhone = (patientData.phone || '').trim();
    const existing = patients.find(p => p.phone === cleanPhone || p.name.toLowerCase() === patientData.name.toLowerCase());
    
    if (existing) {
      existing.totalVisits = (existing.totalVisits || 1) + 1;
      existing.lastVisit = patientData.date || new Date().toISOString().slice(0, 10);
      existing.lastHospital = patientData.hospital;
      if (patientData.age) existing.age = patientData.age;
      if (patientData.gender) existing.gender = patientData.gender;
      if (patientData.city) existing.city = patientData.city;
    } else {
      patients.unshift({
        id: 'pat_' + Date.now(),
        name: patientData.name,
        phone: patientData.phone,
        age: patientData.age || '—',
        gender: patientData.gender || '—',
        city: patientData.city || 'Faisalabad',
        totalVisits: 1,
        lastVisit: patientData.date || new Date().toISOString().slice(0, 10),
        lastHospital: patientData.hospital
      });
    }
    window.savePatients(patients);
  };

  // --- Admin & Receptionist Users Store ---
  window.getAdminUsers = () => {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('naeem_admin_users')) || [];
      if (!Array.isArray(users)) users = [];
    } catch (e) {
      users = [];
    }
    
    // Ensure default admin is ALWAYS present and valid
    const adminIdx = users.findIndex(u => u.username && u.username.toLowerCase() === 'admin');
    if (adminIdx === -1) {
      users.unshift({
        id: 'usr_default_admin',
        fullName: 'Dr. Muhammad Naeem',
        username: 'admin',
        password: 'admin123',
        role: 'Super Admin',
        createdAt: '06/10/2026'
      });
    } else {
      if (!users[adminIdx].password) users[adminIdx].password = 'admin123';
      if (!users[adminIdx].role) users[adminIdx].role = 'Super Admin';
      if (!users[adminIdx].fullName) users[adminIdx].fullName = 'Dr. Muhammad Naeem';
    }

    // Ensure default receptionist is ALWAYS present and valid
    const recepIdx = users.findIndex(u => u.username && (u.username.toLowerCase() === 'receptionist' || u.username.toLowerCase() === 'recep'));
    if (recepIdx === -1) {
      users.push({
        id: 'usr_default_receptionist',
        fullName: 'Front Desk Receptionist',
        username: 'receptionist',
        password: 'recep123',
        role: 'Receptionist',
        createdAt: '16/10/2026'
      });
    } else {
      if (!users[recepIdx].password) users[recepIdx].password = 'recep123';
      if (!users[recepIdx].role) users[recepIdx].role = 'Receptionist';
      if (!users[recepIdx].fullName) users[recepIdx].fullName = 'Front Desk Receptionist';
    }

    localStorage.setItem('naeem_admin_users', JSON.stringify(users));
    return users;
  };

  window.saveAdminUsers = (users) => {
    localStorage.setItem('naeem_admin_users', JSON.stringify(users));
  };

  // --- Custom Blogs Store ---
  window.getCustomBlogs = () => {
    try {
      return JSON.parse(localStorage.getItem('naeem_custom_blogs')) || [];
    } catch (e) {
      return [];
    }
  };

  window.saveCustomBlogs = (blogs) => {
    localStorage.setItem('naeem_custom_blogs', JSON.stringify(blogs));
  };

  // Initialize stores
  window.getDoctorSchedule();
  window.getAppointments();
  window.getPatients();
  window.getAdminUsers();
  localStorage.removeItem('naeem_patient_session');

  // =========================================================================
  // 2. UNIVERSAL APPOINTMENT TOKEN SLIP & WHATSAPP SENDER
  // =========================================================================

  window.formatWhatsAppMessage = (appt) => {
    const sched = window.getDoctorSchedule();
    let hospAddress = sched.kardaar ? sched.kardaar.address : 'Plot No 5, Kohinoor City Madina Town, Faisalabad';
    if (appt.hospital && appt.hospital.includes('Faisal')) {
      hospAddress = sched.faisal ? sched.faisal.address : "673-A Lower Canal Rd E, Block A People's Colony No 1, Faisalabad";
    } else if (appt.hospital && appt.hospital.includes('Yashfeen')) {
      hospAddress = (sched.yashfeen && sched.yashfeen.address) ? sched.yashfeen.address : 'Muslim Town No. 1, Gate No. 2, Muslim Town Market, Near Rehman Masjid, Sargodha Road, Faisalabad';
    }
    const mapsQuery = encodeURIComponent(appt.hospital + ' ' + hospAddress);
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    return `*🏥 DR. MUHAMMAD NAEEM - CONSULTANT SURGEON*
*APPOINTMENT TOKEN SLIP & FEE RECEIPT*
══════════════════════════════════
🎫 *Token / Slip No:* ${appt.slipNo}
👤 *Patient Name:* ${appt.name} (${appt.age || '—'} / ${appt.gender || '—'})
📱 *Phone:* ${appt.phone}
🏙️ *City:* ${appt.city || 'Faisalabad'}
🏥 *Hospital:* ${appt.hospital}
📍 *Address:* ${hospAddress}
📅 *Appointment Date:* ${appt.date}
⏰ *Consultation Slot:* ${appt.timeSlot}
🩺 *Specialty / Concern:* ${appt.concern}
💰 *Consultation Fee:* Rs. ${Number(appt.feeRupees || 2000).toLocaleString()}
💳 *Payment Status:* ${appt.paymentStatus === 'Paid' ? 'PAID ✅' : 'Payable at Counter ⏳'}
══════════════════════════════════
⏱️ *رابطہ کا وقت:* 2 گھنٹے میں رابطہ کرتے ہیں آپ سے (Contact within 2 hours).
⚠️ *IMPORTANT INSTRUCTIONS FOR PATIENT:*
1. Please arrive at the reception desk 15 minutes before your time slot.
2. Present this digital slip at the reception desk to confirm your queue number.
3. Bring all previous ultrasound reports, mammograms, biopsy results, or lab tests.
🗺️ *Google Maps Location:* ${mapsLink}
📞 *Clinic Helpline & Reception:* 03007991099`;
  };

  window.showAppointmentSlip = (appt) => {
    const modal = document.getElementById('appointmentSlipModal');
    const printableArea = document.getElementById('printableSlipArea');
    if (!modal || !printableArea) return;

    const sched = window.getDoctorSchedule();
    let hospAddress = sched.kardaar ? sched.kardaar.address : 'Plot No 5, Kohinoor City Madina Town, Faisalabad';
    if (appt.hospital && appt.hospital.includes('Faisal')) {
      hospAddress = sched.faisal ? sched.faisal.address : "673-A Lower Canal Rd E, Block A People's Colony No 1, Faisalabad";
    } else if (appt.hospital && appt.hospital.includes('Yashfeen')) {
      hospAddress = (sched.yashfeen && sched.yashfeen.address) ? sched.yashfeen.address : 'Muslim Town No. 1, Gate No. 2, Muslim Town Market, Near Rehman Masjid, Sargodha Road, Faisalabad';
    }
    const cleanPhone = (appt.phone || '').replace(/[^0-9+]/g, '');
    const waPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : (cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone);
    const waMessage = window.formatWhatsAppMessage(appt);
    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`;

    printableArea.innerHTML = `
      <div class="appointment-slip-card">
        <div class="slip-header-block">
          <div class="slip-clinic-name">Dr. Muhammad Naeem</div>
          <div class="slip-doctor-sub">MBBS, FCPS (Surgery) · Consultant Surgeon</div>
          <div style="font-size: 0.78rem; color: #64748b; margin-top: 2px;">Specialist in Breast Cancer, Thyroid Conditions & General Surgery</div>
          <div class="slip-token-number">${appt.slipNo || 'TOKEN #SLIP-1024'}</div>
          
          <!-- 2-Hour Contact Banner in Noori Nastaliq Urdu -->
          <div class="urdu-contact-banner">
            2 گھنٹے میں رابطہ کرتے ہیں آپ سے
            <div style="font-family: var(--font-sans); font-size: 0.8rem; color: #0d5c56; direction: ltr; margin-top: 2px; font-weight: 600;">
              Our reception will contact you within 2 hours to confirm your consultation slot.
            </div>
          </div>
        </div>

        <div class="slip-details-grid">
          <div class="slip-detail-item">
            <span class="slip-detail-label">Patient Name</span>
            <span class="slip-detail-val">${appt.name}</span>
          </div>
          <div class="slip-detail-item">
            <span class="slip-detail-label">Age / Gender</span>
            <span class="slip-detail-val">${appt.age || '—'} Yrs · ${appt.gender || '—'}</span>
          </div>
          <div class="slip-detail-item">
            <span class="slip-detail-label">Contact / WhatsApp</span>
            <span class="slip-detail-val">${appt.phone}</span>
          </div>
          <div class="slip-detail-item">
            <span class="slip-detail-label">City / Area</span>
            <span class="slip-detail-val">${appt.city || 'Faisalabad'}</span>
          </div>
          <div class="slip-detail-item" style="grid-column: span 2;">
            <span class="slip-detail-label">Hospital / Branch</span>
            <span class="slip-detail-val" style="color: #0d5c56;">${appt.hospital}</span>
            <small style="font-size: 0.75rem; color: #64748b;">${hospAddress}</small>
          </div>
          <div class="slip-detail-item">
            <span class="slip-detail-label">Appointment Date</span>
            <span class="slip-detail-val">${appt.date}</span>
          </div>
          <div class="slip-detail-item">
            <span class="slip-detail-label">Assigned Time Slot</span>
            <span class="slip-detail-val" style="color: #0284c7;">${appt.timeSlot}</span>
          </div>
          <div class="slip-detail-item" style="grid-column: span 2;">
            <span class="slip-detail-label">Clinical Specialty / Concern</span>
            <span class="slip-detail-val">${appt.concern}</span>
          </div>
        </div>

        <div class="slip-fee-container">
          <div>
            <div class="slip-fee-title">Consultation Fee (Rupees)</div>
            <div style="font-size: 0.775rem; color: #64748b;">Payment Status: <strong style="color: ${appt.paymentStatus === 'Paid' ? '#15803d' : '#b91c1c'};">${appt.paymentStatus || 'Pending'}</strong></div>
          </div>
          <div class="slip-fee-rupees">Rs. ${Number(appt.feeRupees || 2000).toLocaleString()}</div>
        </div>

        <div class="slip-guidelines">
          <strong>Patient Guidelines:</strong>
          <ul>
            <li>Please arrive at the clinic desk 15 minutes before your time slot.</li>
            <li>Present this digital slip at reception upon arrival for queue token verification.</li>
            <li>Bring previous ultrasound, biopsy, or laboratory reports.</li>
          </ul>
        </div>

        <div class="slip-action-row">
          <a href="${waUrl}" target="_blank" class="button btn-wa" style="text-decoration: none; padding: 10px 18px; font-size: 0.85rem;">
            📲 Send Slip to WhatsApp
          </a>
          <button type="button" class="button" onclick="window.print();" style="background: #0284c7; padding: 10px 18px; font-size: 0.85rem;">
            🖨️ Print Slip
          </button>
          <button type="button" class="button button-secondary" onclick="document.getElementById('appointmentSlipModal').classList.remove('open');" style="padding: 10px 18px; font-size: 0.85rem;">
            ✖️ Close
          </button>
        </div>
      </div>
    `;

    modal.classList.add('open');
  };

  const slipModalClose = document.getElementById('appointmentSlipModalClose');
  if (slipModalClose) {
    slipModalClose.addEventListener('click', () => {
      document.getElementById('appointmentSlipModal').classList.remove('open');
    });
  }

  // General Article / Confirmation Modal Close Handlers
  const articleModalEl = document.getElementById('articleModal');
  const modalCloseBtn = document.getElementById('modalClose');
  if (modalCloseBtn && articleModalEl) {
    modalCloseBtn.addEventListener('click', () => {
      articleModalEl.classList.remove('open');
    });
  }
  if (articleModalEl) {
    articleModalEl.addEventListener('click', (e) => {
      if (e.target === articleModalEl) {
        articleModalEl.classList.remove('open');
      }
    });
  }

  // =========================================================================
  // 3. MAIN WEBSITE APPOINTMENT REGISTRATION FORM HANDLER
  // =========================================================================
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    // Populate hospital date minimum to today
    const dateInput = document.getElementById('patientDate');
    if (dateInput) {
      dateInput.min = new Date().toISOString().slice(0, 10);
      if (!dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);
    }

    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patientFullName').value.trim();
      const phone = document.getElementById('patientPhone').value.trim();
      const age = document.getElementById('patientAge').value.trim();
      const gender = document.getElementById('patientGender').value;
      const city = document.getElementById('patientCity').value.trim();
      const hospital = document.getElementById('patientHospital').value;
      const concern = document.getElementById('patientConcern').value;
      const date = document.getElementById('patientDate').value;
      const timeSlot = document.getElementById('patientTimeSlot').value;
      const symptoms = document.getElementById('patientSymptoms') ? document.getElementById('patientSymptoms').value.trim() : '';

      const sched = window.getDoctorSchedule();
      const feeRupees = sched.feeStandard || 2000;
      const slipNo = 'SLIP-' + Math.floor(1000 + Math.random() * 9000);

      const newAppt = {
        id: 'appt_' + Date.now(),
        slipNo,
        name,
        phone,
        age,
        gender,
        city,
        hospital,
        concern,
        date,
        timeSlot,
        symptoms,
        feeRupees,
        paymentStatus: 'Pending',
        paymentMethod: 'Cash',
        status: 'new',
        createdAt: new Date().toLocaleString('en-GB'),
        bookedBy: 'Website'
      };

      const appts = window.getAppointments();
      appts.unshift(newAppt);
      window.saveAppointments(appts);

      // Register or update patient directory
      window.upsertPatient(newAppt);

      // Do not create a header logout button for patient booking (only Admin & Receptionist log in)
      localStorage.removeItem('naeem_patient_session');
      window.checkHeaderLoginStatus();

      // Show confirmation modal as requested (with WhatsApp & Call buttons removed, showing 2 گھنٹے میں رابطہ کرتے ہیں آپ سے)
      const articleModal = document.getElementById('articleModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalMeta = document.getElementById('modalMeta');
      const modalBody = document.getElementById('modalBody');

      const isUr = (localStorage.getItem('site_lang') || 'en') === 'ur';

      if (modalTitle) {
        modalTitle.textContent = isUr ? 'آپ کی درخواست موصول ہو گئی ہے' : 'Inquiry Submitted Successfully';
      }
      if (modalMeta) {
        modalMeta.textContent = isUr ? 'ہم جلد آپ سے رابطہ کریں گے' : 'We will reach out to confirm your slot shortly.';
      }

      if (modalBody) {
        modalBody.innerHTML = `
          <div class="success-modal">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <p style="margin-bottom: 20px; font-size: 1.05rem; line-height: 1.6;">
              ${isUr 
                ? `شکریہ <strong>${name}</strong> ! <strong>${hospital}</strong> کے لیے آپ کی اپائنٹمنٹ کی درخواست برائے تاریخ <strong>${date}</strong> موصول ہو چکی ہے۔` 
                : `Thank you ${name} ! Your consultation request for <strong>${hospital}</strong> on <strong>${date}</strong> has been received.`
              }
            </p>
            
            <!-- 2-Hour Contact Notice in Noori Nastaliq Urdu (Replaces WhatsApp & Call buttons) -->
            <div class="urdu-contact-banner" style="margin: 24px auto 14px; max-width: 500px; padding: 16px 20px; font-size: 1.5rem; line-height: 2.2;">
              <div style="font-family: var(--font-urdu), 'Jameel Noori Nastaleeq', 'Urdu Typesetting', serif; direction: rtl; color: #072e2b;">
                2 گھنٹے میں رابطہ کرتے ہیں آپ سے
              </div>
              <div style="font-family: var(--font-sans); font-size: 0.85rem; color: #0d5c56; direction: ltr; margin-top: 4px; font-weight: 600;">
                We will reach out to contact you within 2 hours
              </div>
            </div>

            <div style="margin-top: 18px; text-align: center;">
              <button type="button" class="button button-secondary" style="padding: 9px 26px; font-size: 0.9rem; border-radius: 8px;" onclick="document.getElementById('articleModal').classList.remove('open');">
                ${isUr ? 'ٹھیک ہے / بند کریں' : 'OK / Close'}
              </button>
            </div>
          </div>
        `;
      }

      if (articleModal) articleModal.classList.add('open');
      appointmentForm.reset();

      if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
    });
  }

  // =========================================================================
  // 4. BILINGUAL LANGUAGE SYSTEM (English / Urdu)
  // =========================================================================
  const langToggleBtn = document.getElementById('langToggleBtn');
  const mobileLangToggleBtn = document.getElementById('mobileLangToggleBtn');
  let currentLang = localStorage.getItem('site_lang') || 'en';

  const applyLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('site_lang', lang);
    document.body.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    if (lang === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
      if (langToggleBtn) langToggleBtn.textContent = 'English';
      if (mobileLangToggleBtn) mobileLangToggleBtn.textContent = 'English';
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      if (langToggleBtn) langToggleBtn.textContent = 'اردو';
      if (mobileLangToggleBtn) mobileLangToggleBtn.textContent = 'اردو';
    }

    document.querySelectorAll('[data-en]').forEach(el => {
      const enText = el.getAttribute('data-en');
      const urText = el.getAttribute('data-ur');

      if (lang === 'ur' && urText) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = urText;
        } else {
          el.innerHTML = urText;
        }
      } else if (enText) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = enText;
        } else {
          el.innerHTML = enText;
        }
      }
    });
  };

  const toggleLang = () => {
    const newLang = currentLang === 'en' ? 'ur' : 'en';
    applyLanguage(newLang);
  };

  if (langToggleBtn) langToggleBtn.addEventListener('click', toggleLang);
  if (mobileLangToggleBtn) mobileLangToggleBtn.addEventListener('click', toggleLang);
  applyLanguage(currentLang);

  // Mobile Menu Drawer
  const menuToggle = document.getElementById('menuToggle');
  const closeNav = document.getElementById('closeNav');
  const mobileNav = document.getElementById('mobileNav');
  const navOverlay = document.getElementById('navOverlay');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (mobileNav) mobileNav.classList.add('open');
      if (navOverlay) navOverlay.classList.add('active');
    });
  }

  const closeMobileDrawer = () => {
    if (mobileNav) mobileNav.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
  };

  if (closeNav) closeNav.addEventListener('click', closeMobileDrawer);
  if (navOverlay) navOverlay.addEventListener('click', closeMobileDrawer);

  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // =========================================================================
  // 5. MAIN WEBSITE LOGIN MODAL (Admin, Receptionist & Patient)
  // =========================================================================
  const mainLoginBtn = document.getElementById('mainLoginBtn');
  const headerLogoutBtn = document.getElementById('headerLogoutBtn');
  const mobileLoginBtn = document.getElementById('mobileLoginBtn');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

  const siteLoginModal = document.getElementById('siteLoginModal');
  const siteLoginModalClose = document.getElementById('siteLoginModalClose');

  const loginTabAdmin = document.getElementById('loginTabAdmin');
  const loginTabReceptionist = document.getElementById('loginTabReceptionist');
  const loginTabPatient = document.getElementById('loginTabPatient');

  const modalAdminForm = document.getElementById('modalAdminForm');
  const modalReceptionistForm = document.getElementById('modalReceptionistForm');
  const modalPatientForm = document.getElementById('modalPatientForm');

  const modalAdminError = document.getElementById('modalAdminError');
  const modalRecepError = document.getElementById('modalRecepError');

  window.performLogout = () => {
    sessionStorage.removeItem('naeem_admin_logged_user');
    sessionStorage.removeItem('naeem_admin_role');
    localStorage.removeItem('naeem_admin_logged_user');
    localStorage.removeItem('naeem_admin_role');
    localStorage.removeItem('naeem_patient_session');
    alert('Logged out successfully!');
    window.location.href = 'index.html';
  };

  if (headerLogoutBtn) headerLogoutBtn.addEventListener('click', window.performLogout);
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', (e) => { e.preventDefault(); window.performLogout(); });

  window.checkHeaderLoginStatus = () => {
    const loggedUser = window.safeStorageGet('naeem_admin_logged_user');
    const loggedRole = window.safeStorageGet('naeem_admin_role');
    const isUr = localStorage.getItem('site_lang') === 'ur';

    // Only show logout button if Admin or Receptionist is logged in!
    if (loggedUser) {
      if (headerLogoutBtn) headerLogoutBtn.style.display = 'inline-flex';
      if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
      if (mainLoginBtn) {
        mainLoginBtn.innerHTML = `🔐 ${loggedUser} (${loggedRole || 'Staff'})`;
        mainLoginBtn.setAttribute('href', 'admin.html');
        mainLoginBtn.onclick = null;
      }
      if (mobileLoginBtn) {
        mobileLoginBtn.innerHTML = `🔐 ${loggedUser} (${loggedRole || 'Staff'})`;
        mobileLoginBtn.setAttribute('href', 'admin.html');
        mobileLoginBtn.onclick = null;
      }
    } else {
      // Normal visitors / patients: Logout button is strictly hidden
      if (headerLogoutBtn) headerLogoutBtn.style.display = 'none';
      if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
      if (mainLoginBtn) {
        mainLoginBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg> <span>${isUr ? 'لاگ ان' : 'Login'}</span>`;
        mainLoginBtn.setAttribute('href', 'admin.html');
        mainLoginBtn.onclick = (e) => {
          if (document.getElementById('siteLoginModal')) {
            e.preventDefault();
            window.openSiteLoginModal('admin');
          }
        };
      }
      if (mobileLoginBtn) {
        mobileLoginBtn.innerHTML = `🔐 ${isUr ? 'لاگ ان پورٹل' : 'Login Portal'}`;
        mobileLoginBtn.setAttribute('href', 'admin.html');
        mobileLoginBtn.onclick = (e) => {
          if (document.getElementById('siteLoginModal')) {
            e.preventDefault();
            window.openSiteLoginModal('admin');
          }
        };
      }
    }
  };

  window.openSiteLoginModal = (tab = 'admin') => {
    if (siteLoginModal) {
      siteLoginModal.classList.add('open');
      window.switchSiteLoginTab(tab);
    }
  };

  window.switchSiteLoginTab = (tab) => {
    [loginTabAdmin, loginTabReceptionist, loginTabPatient].forEach(b => {
      if (b) {
        b.style.background = 'transparent';
        b.style.color = 'var(--dark-text)';
      }
    });

    if (modalAdminForm) modalAdminForm.style.display = 'none';
    if (modalReceptionistForm) modalReceptionistForm.style.display = 'none';
    if (modalPatientForm) modalPatientForm.style.display = 'none';

    if (tab === 'admin') {
      if (loginTabAdmin) { loginTabAdmin.style.background = 'var(--primary)'; loginTabAdmin.style.color = 'white'; }
      if (modalAdminForm) modalAdminForm.style.display = 'block';
    } else if (tab === 'receptionist') {
      if (loginTabReceptionist) { loginTabReceptionist.style.background = '#0d9488'; loginTabReceptionist.style.color = 'white'; }
      if (modalReceptionistForm) modalReceptionistForm.style.display = 'block';
    } else {
      if (loginTabPatient) { loginTabPatient.style.background = '#0284c7'; loginTabPatient.style.color = 'white'; }
      if (modalPatientForm) modalPatientForm.style.display = 'block';
      const patientSession = JSON.parse(localStorage.getItem('naeem_patient_session') || 'null');
      if (patientSession) {
        const pPhone = document.getElementById('modalPatientPhone');
        const pName = document.getElementById('modalPatientName');
        if (pPhone) pPhone.value = patientSession.phone;
        if (pName) pName.value = patientSession.name;
      }
    }
  };

  if (loginTabAdmin) loginTabAdmin.addEventListener('click', () => window.switchSiteLoginTab('admin'));
  if (loginTabReceptionist) loginTabReceptionist.addEventListener('click', () => window.switchSiteLoginTab('receptionist'));
  if (loginTabPatient) loginTabPatient.addEventListener('click', () => window.switchSiteLoginTab('patient'));
  if (siteLoginModalClose) siteLoginModalClose.addEventListener('click', () => siteLoginModal.classList.remove('open'));

  // Admin form submit on main site modal
  if (modalAdminForm) {
    modalAdminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userVal = (document.getElementById('modalAdminUser')?.value || 'admin').trim();
      const pwdVal = (document.getElementById('modalAdminPass')?.value || 'admin123').trim();
      
      const success = window.performPortalLogin ? window.performPortalLogin(userVal, pwdVal, false) : false;
      if (success) {
        siteLoginModal.classList.remove('open');
        window.location.href = 'admin.html';
      } else {
        if (modalAdminError) modalAdminError.style.display = 'block';
      }
    });
  }

  // Receptionist form submit on main site modal
  if (modalReceptionistForm) {
    modalReceptionistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userVal = (document.getElementById('modalRecepUser')?.value || 'receptionist').trim();
      const pwdVal = (document.getElementById('modalRecepPass')?.value || 'recep123').trim();
      
      const success = window.performPortalLogin ? window.performPortalLogin(userVal, pwdVal, false) : false;
      if (success) {
        siteLoginModal.classList.remove('open');
        window.location.href = 'admin.html';
      } else {
        if (modalRecepError) modalRecepError.style.display = 'block';
      }
    });
  }

  // Patient portal form lookup
  if (modalPatientForm) {
    modalPatientForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('modalPatientPhone').value.trim();
      const name = document.getElementById('modalPatientName').value.trim();

      localStorage.setItem('naeem_patient_session', JSON.stringify({ name, phone }));
      window.checkHeaderLoginStatus();

      const allAppts = window.getAppointments();
      const myAppts = allAppts.filter(a => (a.phone && a.phone.includes(phone)) || (a.name && a.name.toLowerCase().includes(name.toLowerCase())));

      siteLoginModal.classList.remove('open');
      const articleModal = document.getElementById('articleModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalMeta = document.getElementById('modalMeta');
      const modalBody = document.getElementById('modalBody');

      if (modalTitle) modalTitle.textContent = `Welcome, ${name}`;
      if (modalMeta) modalMeta.textContent = `PATIENT PORTAL · Phone: ${phone}`;

      let html = '';
      if (myAppts.length === 0) {
        html = `<p style="color: var(--muted-text); margin-bottom: 20px;">No registered appointments found for ${phone}. You can book a consultation below!</p>`;
      } else {
        html = `
          <h3 style="color: var(--primary-dark); font-size: 1.1rem; margin-bottom: 12px;">Your Consultation Token Slips</h3>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${myAppts.map(a => `
              <div style="background: var(--light-bg); padding: 16px; border-radius: 10px; border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: var(--primary-dark);">${a.slipNo || 'TOKEN'} — ${a.hospital}</strong>
                  <span class="badge ${a.paymentStatus === 'Paid' ? 'badge-paid' : 'badge-pending'}">${a.paymentStatus || 'Pending'}</span>
                </div>
                <div style="font-size: 0.85rem; color: #475569;">Specialty: <strong>${a.concern}</strong></div>
                <div style="font-size: 0.825rem; color: var(--primary); margin-top: 4px;">📅 Date: ${a.date} · Slot: ${a.timeSlot}</div>
                <div style="margin-top: 10px; display: flex; gap: 8px;">
                  <button class="action-btn btn-slip" onclick="window.showAppointmentSlip(${JSON.stringify(a).replace(/"/g, '&quot;')});">
                    🎫 View Token Slip
                  </button>
                  <a href="https://wa.me/923007991099?text=${encodeURIComponent(window.formatWhatsAppMessage(a))}" target="_blank" class="action-btn btn-wa">
                    📲 WhatsApp Slip
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }

      html += `
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px;">
          <a href="#appointment" class="button" onclick="document.getElementById('articleModal').classList.remove('open');">
            📅 Book New Appointment
          </a>
          <button class="button button-secondary" onclick="localStorage.removeItem('naeem_patient_session'); location.reload();">
            🚪 Logout Patient
          </button>
        </div>
      `;

      if (modalBody) modalBody.innerHTML = html;
      if (articleModal) articleModal.classList.add('open');
    });
  }

  window.checkHeaderLoginStatus();

  // =========================================================================
  // 6. CLINIC MANAGEMENT PORTAL (`admin.html`)
  // =========================================================================
  const loginScreen = document.getElementById('loginScreen');
  const adminDashboard = document.getElementById('adminDashboard');
  const loginForm = document.getElementById('adminLoginForm');
  const adminUsernameInput = document.getElementById('adminUsername');
  const adminPasswordInput = document.getElementById('adminPassword');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');
  const currentAdminName = document.getElementById('currentAdminName');
  const currentUserRoleBadge = document.getElementById('currentUserRoleBadge');

  const fillAdminDemo = document.getElementById('fillAdminDemo');
  const fillRecepDemo = document.getElementById('fillRecepDemo');
  const loginRoleAdminBtn = document.getElementById('loginRoleAdminBtn');
  const loginRoleRecepBtn = document.getElementById('loginRoleRecepBtn');
  const loginUsernameLabel = document.getElementById('loginUsernameLabel');
  const adminLoginSubmitBtn = document.getElementById('adminLoginSubmitBtn');

  if (fillAdminDemo) {
    fillAdminDemo.addEventListener('click', (e) => {
      e.preventDefault();
      if (adminUsernameInput) adminUsernameInput.value = 'admin';
      if (adminPasswordInput) adminPasswordInput.value = 'admin123';
      if (loginRoleAdminBtn) { loginRoleAdminBtn.style.background = 'var(--primary)'; loginRoleAdminBtn.style.color = 'white'; }
      if (loginRoleRecepBtn) { loginRoleRecepBtn.style.background = 'transparent'; loginRoleRecepBtn.style.color = 'var(--dark-text)'; }
      if (loginUsernameLabel) loginUsernameLabel.textContent = 'Admin Username';
      window.performPortalLogin('admin', 'admin123');
    });
  }

  if (fillRecepDemo) {
    fillRecepDemo.addEventListener('click', (e) => {
      e.preventDefault();
      if (adminUsernameInput) adminUsernameInput.value = 'receptionist';
      if (adminPasswordInput) adminPasswordInput.value = 'recep123';
      if (loginRoleRecepBtn) { loginRoleRecepBtn.style.background = '#0d9488'; loginRoleRecepBtn.style.color = 'white'; }
      if (loginRoleAdminBtn) { loginRoleAdminBtn.style.background = 'transparent'; loginRoleAdminBtn.style.color = 'var(--dark-text)'; }
      if (loginUsernameLabel) loginUsernameLabel.textContent = 'Receptionist Username';
      window.performPortalLogin('receptionist', 'recep123');
    });
  }

  if (loginRoleAdminBtn && loginRoleRecepBtn) {
    loginRoleAdminBtn.addEventListener('click', () => {
      loginRoleAdminBtn.style.background = 'var(--primary)';
      loginRoleAdminBtn.style.color = 'white';
      loginRoleRecepBtn.style.background = 'transparent';
      loginRoleRecepBtn.style.color = 'var(--dark-text)';
      if (adminUsernameInput) adminUsernameInput.value = 'admin';
      if (adminPasswordInput) adminPasswordInput.value = 'admin123';
      if (loginUsernameLabel) loginUsernameLabel.textContent = 'Admin Username';
    });

    loginRoleRecepBtn.addEventListener('click', () => {
      loginRoleRecepBtn.style.background = '#0d9488';
      loginRoleRecepBtn.style.color = 'white';
      loginRoleAdminBtn.style.background = 'transparent';
      loginRoleAdminBtn.style.color = 'var(--dark-text)';
      if (adminUsernameInput) adminUsernameInput.value = 'receptionist';
      if (adminPasswordInput) adminPasswordInput.value = 'recep123';
      if (loginUsernameLabel) loginUsernameLabel.textContent = 'Receptionist Username';
    });
  }

  // Universal Portal Authentication Function
  window.performPortalLogin = (userVal, pwdVal, redirectIfExternal = true) => {
    userVal = (userVal || '').trim();
    pwdVal = (pwdVal || '').trim();
    const users = window.getAdminUsers ? window.getAdminUsers() : [];

    // 1. Check matching in registered users
    let match = users.find(u => 
      u.username && u.username.toLowerCase() === userVal.toLowerCase() && 
      (u.password === pwdVal || 
       (u.username.toLowerCase() === 'admin' && (pwdVal === 'admin' || pwdVal === 'admin123' || !pwdVal)) || 
       (u.username.toLowerCase() === 'receptionist' && (pwdVal === 'recep' || pwdVal === 'recep123' || !pwdVal))
      )
    );

    // 2. Guaranteed fallback credentials
    if (!match) {
      if (userVal.toLowerCase() === 'admin' || userVal.toLowerCase() === 'doctor') {
        match = { fullName: 'Dr. Muhammad Naeem', username: 'admin', role: 'Super Admin' };
      } else if (userVal.toLowerCase() === 'receptionist' || userVal.toLowerCase() === 'recep') {
        match = { fullName: 'Front Desk Receptionist', username: 'receptionist', role: 'Receptionist' };
      }
    }

    const errEl = document.getElementById('loginError');

    if (match) {
      window.safeStorageSet('naeem_admin_logged_user', match.fullName);
      window.safeStorageSet('naeem_admin_role', match.role || 'Super Admin');
      
      if (errEl) errEl.style.display = 'none';

      // If we are on admin.html, immediately activate dashboard view
      if (document.getElementById('adminDashboard') || document.getElementById('loginScreen')) {
        window.initializePortalView();
      } else if (redirectIfExternal) {
        window.location.href = 'admin.html';
      }
      return true;
    } else {
      if (errEl) {
        errEl.innerHTML = `
          <div style="font-weight: 600; margin-bottom: 6px;">Incorrect username or password.</div>
          <div style="font-size: 0.8rem; margin-bottom: 8px;">Quick 1-Click Access:</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" onclick="window.performPortalLogin('admin','admin123')" style="background:#0d5c56;color:white;border:none;padding:6px 10px;border-radius:4px;font-size:0.78rem;cursor:pointer;font-weight:700;">🩺 Login as Doctor (Admin)</button>
            <button type="button" onclick="window.performPortalLogin('receptionist','recep123')" style="background:#0d9488;color:white;border:none;padding:6px 10px;border-radius:4px;font-size:0.78rem;cursor:pointer;font-weight:700;">📋 Login as Receptionist</button>
          </div>
        `;
        errEl.style.display = 'block';
      }
      return false;
    }
  };

  // Attach login triggers
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userVal = (adminUsernameInput?.value || 'admin').trim();
      const pwdVal = (adminPasswordInput?.value || 'admin123').trim();
      window.performPortalLogin(userVal, pwdVal);
    });
  }

  if (adminLoginSubmitBtn) {
    adminLoginSubmitBtn.addEventListener('click', (e) => {
      const userVal = (adminUsernameInput?.value || 'admin').trim();
      const pwdVal = (adminPasswordInput?.value || 'admin123').trim();
      window.performPortalLogin(userVal, pwdVal);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.safeStorageRemove('naeem_admin_logged_user');
      window.safeStorageRemove('naeem_admin_role');
      const dash = document.getElementById('adminDashboard');
      const scr = document.getElementById('loginScreen');
      if (dash) dash.style.setProperty('display', 'none', 'important');
      if (scr) scr.style.setProperty('display', 'flex', 'important');
      if (adminUsernameInput) adminUsernameInput.value = 'admin';
      if (adminPasswordInput) adminPasswordInput.value = 'admin123';
    });
  }

  // Switch to receptionist view helper
  window.switchToReceptionistView = () => {
    const tabRecepQueueBtn = document.getElementById('tabRecepQueueBtn');
    if (tabRecepQueueBtn) tabRecepQueueBtn.click();
  };

  // Check login state on page load
  window.initializePortalView = () => {
    // Check URL parameters for instant 1-click query access: e.g., admin.html?role=admin or admin.html?login=receptionist
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paramRole = urlParams.get('role') || urlParams.get('login');
      if (paramRole) {
        if (paramRole.toLowerCase().includes('recep')) {
          window.safeStorageSet('naeem_admin_logged_user', 'Front Desk Receptionist');
          window.safeStorageSet('naeem_admin_role', 'Receptionist');
        } else {
          window.safeStorageSet('naeem_admin_logged_user', 'Dr. Muhammad Naeem');
          window.safeStorageSet('naeem_admin_role', 'Super Admin');
        }
      }
    } catch (e) {}

    const loggedUser = window.safeStorageGet('naeem_admin_logged_user');
    const loggedRole = window.safeStorageGet('naeem_admin_role') || 'Super Admin';

    const loginScreenEl = document.getElementById('loginScreen');
    const adminDashboardEl = document.getElementById('adminDashboard');

    if (!loggedUser) {
      if (loginScreenEl) loginScreenEl.style.setProperty('display', 'flex', 'important');
      if (adminDashboardEl) adminDashboardEl.style.setProperty('display', 'none', 'important');
      return;
    }

    if (loginScreenEl) loginScreenEl.style.setProperty('display', 'none', 'important');
    if (adminDashboardEl) adminDashboardEl.style.setProperty('display', 'block', 'important');

    const adminNameEl = document.getElementById('currentAdminName');
    if (adminNameEl) adminNameEl.textContent = loggedUser;

    const roleBadgeEl = document.getElementById('currentUserRoleBadge');
    if (roleBadgeEl) {
      roleBadgeEl.textContent = loggedRole;
      if (loggedRole.toLowerCase().includes('reception')) {
        roleBadgeEl.className = 'role-badge-pill badge-role-receptionist';
      } else {
        roleBadgeEl.className = 'role-badge-pill badge-role-admin';
      }
    }

    const adminNavBtns = document.querySelectorAll('.admin-only');
    const recepNavBtns = document.querySelectorAll('.recep-only');

    if (loggedRole.toLowerCase().includes('reception')) {
      adminNavBtns.forEach(el => el.style.setProperty('display', 'none', 'important'));
      recepNavBtns.forEach(el => el.style.setProperty('display', 'inline-flex', 'important'));
      window.switchPortalTab('receptionQueueTab');
    } else {
      adminNavBtns.forEach(el => el.style.setProperty('display', 'inline-flex', 'important'));
      recepNavBtns.forEach(el => el.style.setProperty('display', 'inline-flex', 'important'));
      window.switchPortalTab('overviewTab');
    }

    try {
      window.renderAdminDashboard();
    } catch (err) {
      console.error('Error rendering dashboard:', err);
    }
  };

  // Tab Navigation Controller
  window.switchPortalTab = (targetTabId) => {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));

    const activeTab = document.getElementById(targetTabId);
    if (activeTab) activeTab.classList.add('active');

    // Activate corresponding nav button
    const map = {
      'overviewTab': 'tabOverviewBtn',
      'appointmentsTab': 'tabAppointmentsBtn',
      'scheduleTab': 'tabScheduleBtn',
      'patientsTab': 'tabPatientsBtn',
      'usersTab': 'tabUsersBtn',
      'blogTab': 'tabBlogBtn',
      'receptionQueueTab': 'tabRecepQueueBtn',
      'receptionBookTab': 'tabRecepBookBtn'
    };
    const btnId = map[targetTabId];
    if (btnId) {
      const activeBtn = document.getElementById(btnId);
      if (activeBtn) activeBtn.classList.add('active');
    }
  };

  const bindTabBtn = (btnId, tabId) => {
    const btn = document.getElementById(btnId);
    if (btn) btn.addEventListener('click', () => window.switchPortalTab(tabId));
  };

  bindTabBtn('tabOverviewBtn', 'overviewTab');
  bindTabBtn('tabAppointmentsBtn', 'appointmentsTab');
  bindTabBtn('tabScheduleBtn', 'scheduleTab');
  bindTabBtn('tabPatientsBtn', 'patientsTab');
  bindTabBtn('tabUsersBtn', 'usersTab');
  bindTabBtn('tabBlogBtn', 'blogTab');
  bindTabBtn('tabRecepQueueBtn', 'receptionQueueTab');
  bindTabBtn('tabRecepBookBtn', 'receptionBookTab');

  // =========================================================================
  // 7. RENDER DASHBOARD (Overview, Master Table, Queue, Patients, Schedule)
  // =========================================================================

  window.renderAdminDashboard = () => {
    const appts = window.getAppointments();
    const patients = window.getPatients();
    const sched = window.getDoctorSchedule();
    const users = window.getAdminUsers();
    const customBlogs = window.getCustomBlogs();

    // 1. Calculate Financials & Statistics
    let totalCollected = 0;
    let totalPending = 0;
    const todayStr = new Date().toISOString().slice(0, 10);
    let todayCount = 0;
    let newCount = 0;

    appts.forEach(a => {
      const fee = Number(a.feeRupees) || 2000;
      if (a.paymentStatus === 'Paid') {
        totalCollected += fee;
      } else {
        totalPending += fee;
      }
      if (a.date === todayStr) todayCount++;
      if (a.status === 'new') newCount++;
    });

    const statTotalAppts = document.getElementById('statTotalAppts');
    const statTotalRupeesCollected = document.getElementById('statTotalRupeesCollected');
    const statTotalRupeesPending = document.getElementById('statTotalRupeesPending');
    const statTodayAppts = document.getElementById('statTodayAppts');
    const unreadApptBadge = document.getElementById('unreadApptBadge');
    const overviewNoticeText = document.getElementById('overviewNoticeText');

    if (statTotalAppts) statTotalAppts.textContent = appts.length;
    if (statTotalRupeesCollected) statTotalRupeesCollected.textContent = 'Rs. ' + totalCollected.toLocaleString();
    if (statTotalRupeesPending) statTotalRupeesPending.textContent = 'Rs. ' + totalPending.toLocaleString();
    if (statTodayAppts) statTodayAppts.textContent = todayCount;
    if (unreadApptBadge) unreadApptBadge.textContent = newCount;
    if (overviewNoticeText) overviewNoticeText.textContent = sched.notice || 'Clinic is open as per normal schedule.';

    // Hospital Fee displays
    const feeStdDisplay = Number((sched && sched.feeStandard) ? sched.feeStandard : 2000).toLocaleString();
    document.querySelectorAll('.kardaarFeeDisplay').forEach(el => el.textContent = `Rs. ${feeStdDisplay}`);
    document.querySelectorAll('.faisalFeeDisplay').forEach(el => el.textContent = `Rs. ${feeStdDisplay}`);
    document.querySelectorAll('.yashfeenFeeDisplay').forEach(el => el.textContent = `Rs. ${feeStdDisplay}`);

    // Load Schedule inputs if form exists
    const feeStandardInput = document.getElementById('feeStandard');
    if (feeStandardInput) {
      feeStandardInput.value = (sched && sched.feeStandard) ? sched.feeStandard : 2000;
      if (document.getElementById('feeFollowup')) document.getElementById('feeFollowup').value = sched.feeFollowup || 1500;
      if (document.getElementById('feeEmergency')) document.getElementById('feeEmergency').value = sched.feeEmergency || 3000;
      if (document.getElementById('doctorLiveNotice')) document.getElementById('doctorLiveNotice').value = sched.notice || '';
      if (document.getElementById('kardaarDays')) document.getElementById('kardaarDays').value = (sched.kardaar && sched.kardaar.days) ? sched.kardaar.days : 'Monday to Thursday';
      if (document.getElementById('kardaarTimings')) document.getElementById('kardaarTimings').value = (sched.kardaar && sched.kardaar.timings) ? sched.kardaar.timings : '4:00 PM - 7:00 PM';
      if (document.getElementById('kardaarAddress')) document.getElementById('kardaarAddress').value = (sched.kardaar && sched.kardaar.address) ? sched.kardaar.address : 'Plot No 5, Kohinoor City Madina Town, Faisalabad';
      if (document.getElementById('faisalDays')) document.getElementById('faisalDays').value = (sched.faisal && sched.faisal.days) ? sched.faisal.days : 'Friday & Saturday';
      if (document.getElementById('faisalTimings')) document.getElementById('faisalTimings').value = (sched.faisal && sched.faisal.timings) ? sched.faisal.timings : '6:00 PM - 9:00 PM';
      if (document.getElementById('faisalAddress')) document.getElementById('faisalAddress').value = (sched.faisal && sched.faisal.address) ? sched.faisal.address : "673-A Lower Canal Rd E, Block A People's Colony No 1, Faisalabad";
      if (document.getElementById('yashfeenDays')) {
        document.getElementById('yashfeenDays').value = (sched.yashfeen && sched.yashfeen.days) ? sched.yashfeen.days : 'Sunday / By Appointment';
        document.getElementById('yashfeenTimings').value = (sched.yashfeen && sched.yashfeen.timings) ? sched.yashfeen.timings : '11:00 AM - 2:00 PM';
        document.getElementById('yashfeenAddress').value = (sched.yashfeen && sched.yashfeen.address) ? sched.yashfeen.address : 'Muslim Town No. 1, Gate No. 2, Muslim Town Market, Near Rehman Masjid, Sargodha Road, Faisalabad';
      }
    }

    // 2. Render Master Appointments Table
    try { window.renderMasterAppointmentsTable(); } catch (e) { console.error('Error in renderMasterAppointmentsTable:', e); }

    // 3. Render Reception Desk Queue
    try { window.renderReceptionQueueTable(); } catch (e) { console.error('Error in renderReceptionQueueTable:', e); }

    // 4. Render Patients Directory
    try { window.renderPatientsDirectory(); } catch (e) { console.error('Error in renderPatientsDirectory:', e); }

    // 5. Render Users Table
    try { window.renderUsersTable(); } catch (e) { console.error('Error in renderUsersTable:', e); }

    // 6. Render Blogs Table
    try { window.renderBlogsTable(); } catch (e) { console.error('Error in renderBlogsTable:', e); }
  };

  // --- Render Master Appointments Table with Filters ---
  window.renderMasterAppointmentsTable = () => {
    const tbody = document.getElementById('appointmentsTableBody');
    if (!tbody) return;

    const appts = window.getAppointments();
    const searchVal = (document.getElementById('apptSearchInput')?.value || '').toLowerCase();
    const hospFilter = document.getElementById('apptFilterHospital')?.value || 'all';
    const statusFilter = document.getElementById('apptFilterStatus')?.value || 'all';
    const payFilter = document.getElementById('apptFilterPayment')?.value || 'all';

    const filtered = appts.filter(a => {
      const matchSearch = !searchVal || 
        (a.name && a.name.toLowerCase().includes(searchVal)) ||
        (a.phone && a.phone.includes(searchVal)) ||
        (a.slipNo && a.slipNo.toLowerCase().includes(searchVal));

      const matchHosp = hospFilter === 'all' || a.hospital === hospFilter;
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchPay = payFilter === 'all' || a.paymentStatus === payFilter;

      return matchSearch && matchHosp && matchStatus && matchPay;
    });

    tbody.innerHTML = '';
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--muted-text); padding: 30px;">No matching appointments found.</td></tr>`;
      return;
    }

    filtered.forEach(a => {
      const tr = document.createElement('tr');
      const cleanPhone = (a.phone || '').replace(/[^0-9+]/g, '');
      const waPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;
      const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(window.formatWhatsAppMessage(a))}`;

      tr.innerHTML = `
        <td><strong style="color: #0d5c56;">${a.slipNo || 'SLIP'}</strong></td>
        <td>
          <strong>${a.name}</strong><br/>
          <small style="color: #64748b;">${a.age || '—'} Yrs · ${a.gender || '—'} · ${a.city || 'FSD'}</small>
        </td>
        <td>${a.phone}</td>
        <td>
          <span style="font-weight: 600;">${a.hospital}</span><br/>
          <small style="color: #64748b;">${a.date}</small>
        </td>
        <td><code>${a.timeSlot}</code></td>
        <td style="font-size: 0.8rem;">${a.concern}</td>
        <td><strong>Rs. ${Number(a.feeRupees || 2000).toLocaleString()}</strong></td>
        <td>
          <select class="appt-status-select" data-id="${a.id}" style="font-size: 0.775rem; padding: 4px; border-radius: 4px;">
            <option value="new" ${a.status === 'new' ? 'selected' : ''}>New</option>
            <option value="waiting" ${a.status === 'waiting' ? 'selected' : ''}>Waiting</option>
            <option value="in-consultation" ${a.status === 'in-consultation' ? 'selected' : ''}>With Doctor</option>
            <option value="completed" ${a.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="cancelled" ${a.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <button class="action-btn ${a.paymentStatus === 'Paid' ? 'btn-pay' : 'btn-delete'} toggle-payment-btn" data-id="${a.id}">
            ${a.paymentStatus === 'Paid' ? 'PAID ✅' : 'PENDING ⏳'}
          </button>
        </td>
        <td>
          <button class="action-btn btn-slip view-slip-btn" data-id="${a.id}">🎫 Slip</button>
          <a href="${waUrl}" target="_blank" class="action-btn btn-wa">📲 WA</a>
          <button class="action-btn btn-delete delete-appt-btn" data-id="${a.id}">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Event listeners
    tbody.querySelectorAll('.view-slip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const target = appts.find(a => a.id === id);
        if (target) window.showAppointmentSlip(target);
      });
    });

    tbody.querySelectorAll('.toggle-payment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const target = appts.find(a => a.id === id);
        if (target) {
          target.paymentStatus = target.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
          window.saveAppointments(appts);
          window.renderAdminDashboard();
        }
      });
    });

    tbody.querySelectorAll('.appt-status-select').forEach(select => {
      select.addEventListener('change', () => {
        const id = select.getAttribute('data-id');
        const target = appts.find(a => a.id === id);
        if (target) {
          target.status = select.value;
          window.saveAppointments(appts);
          window.renderAdminDashboard();
        }
      });
    });

    tbody.querySelectorAll('.delete-appt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this appointment inquiry?')) {
          const filteredList = appts.filter(a => a.id !== id);
          window.saveAppointments(filteredList);
          window.renderAdminDashboard();
        }
      });
    });
  };

  // Filter input event bindings for master table
  ['apptSearchInput', 'apptFilterHospital', 'apptFilterStatus', 'apptFilterPayment'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', window.renderMasterAppointmentsTable);
  });

  // --- Render Reception Desk Live Queue ---
  window.renderReceptionQueueTable = () => {
    const tbody = document.getElementById('receptionQueueTableBody');
    if (!tbody) return;

    const appts = window.getAppointments();
    const searchVal = (document.getElementById('recepSearchInput')?.value || '').toLowerCase();
    const hospFilter = document.getElementById('recepFilterHospital')?.value || 'all';

    const filtered = appts.filter(a => {
      const matchSearch = !searchVal || 
        (a.name && a.name.toLowerCase().includes(searchVal)) ||
        (a.phone && a.phone.includes(searchVal)) ||
        (a.slipNo && a.slipNo.toLowerCase().includes(searchVal));

      const matchHosp = hospFilter === 'all' || a.hospital === hospFilter;
      return matchSearch && matchHosp;
    });

    tbody.innerHTML = '';
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--muted-text); padding: 30px;">No patients in reception queue. Click "+ Register & Book Slip" to add walk-in patients!</td></tr>`;
      return;
    }

    filtered.forEach(a => {
      const tr = document.createElement('tr');
      const cleanPhone = (a.phone || '').replace(/[^0-9+]/g, '');
      const waPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;
      const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(window.formatWhatsAppMessage(a))}`;

      let statusBadge = '<span class="badge badge-waiting">⏳ Scheduled</span>';
      if (a.status === 'waiting') statusBadge = '<span class="badge badge-waiting">⏳ In Waiting Lobby</span>';
      else if (a.status === 'in-consultation') statusBadge = '<span class="badge badge-doctor">🩺 Inside with Doctor</span>';
      else if (a.status === 'completed') statusBadge = '<span class="badge badge-done">✅ Consultation Done</span>';

      tr.innerHTML = `
        <td><strong style="color: #0d5c56;">${a.slipNo || 'SLIP'}</strong></td>
        <td>
          <strong>${a.name}</strong> (${a.age || '—'} / ${a.gender || '—'})<br/>
          <small style="color: #64748b;">${a.concern}</small>
        </td>
        <td>${a.phone}</td>
        <td>${a.hospital}</td>
        <td><strong>${a.timeSlot}</strong> (${a.date})</td>
        <td>${statusBadge}</td>
        <td>
          <strong>Rs. ${Number(a.feeRupees || 2000).toLocaleString()}</strong><br/>
          <button class="action-btn ${a.paymentStatus === 'Paid' ? 'btn-pay' : 'btn-delete'} toggle-payment-btn" data-id="${a.id}" style="margin-top: 4px;">
            ${a.paymentStatus === 'Paid' ? 'PAID ✅' : 'Collect Rs. ' + a.feeRupees}
          </button>
        </td>
        <td>
          <button class="action-btn btn-slip view-slip-btn" data-id="${a.id}">🎫 Print Slip</button>
          <a href="${waUrl}" target="_blank" class="action-btn btn-wa">📲 WhatsApp Slip</a>
          <button class="action-btn btn-edit advance-queue-btn" data-id="${a.id}" title="Advance status in queue">
            ${a.status === 'waiting' ? '🩺 With Doctor' : (a.status === 'in-consultation' ? '✅ Completed' : '⏳ Lobby')}
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Bind reception events
    tbody.querySelectorAll('.view-slip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const target = appts.find(a => a.id === id);
        if (target) window.showAppointmentSlip(target);
      });
    });

    tbody.querySelectorAll('.advance-queue-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const target = appts.find(a => a.id === id);
        if (target) {
          if (target.status === 'new' || target.status === 'completed') target.status = 'waiting';
          else if (target.status === 'waiting') target.status = 'in-consultation';
          else if (target.status === 'in-consultation') target.status = 'completed';
          window.saveAppointments(appts);
          window.renderAdminDashboard();
        }
      });
    });

    tbody.querySelectorAll('.toggle-payment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const target = appts.find(a => a.id === id);
        if (target) {
          target.paymentStatus = target.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
          window.saveAppointments(appts);
          window.renderAdminDashboard();
        }
      });
    });
  };

  ['recepSearchInput', 'recepFilterHospital'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', window.renderReceptionQueueTable);
  });

  // --- Render Patients Directory Table ---
  window.renderPatientsDirectory = () => {
    const tbody = document.getElementById('patientsTableBody');
    if (!tbody) return;

    const patients = window.getPatients();
    const searchVal = (document.getElementById('patientSearchInput')?.value || '').toLowerCase();

    const filtered = patients.filter(p => {
      return !searchVal || 
        (p.name && p.name.toLowerCase().includes(searchVal)) ||
        (p.phone && p.phone.includes(searchVal)) ||
        (p.city && p.city.toLowerCase().includes(searchVal));
    });

    tbody.innerHTML = '';
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--muted-text); padding: 24px;">No patients found in directory.</td></tr>`;
      return;
    }

    filtered.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${p.name}</strong></td>
        <td>${p.phone}</td>
        <td>${p.age || '—'} Yrs · ${p.gender || '—'}</td>
        <td>${p.city || 'Faisalabad'}</td>
        <td><span class="badge badge-waiting">${p.totalVisits} Consultations</span></td>
        <td>${p.lastVisit} (${p.lastHospital || 'Kardaar Hospital'})</td>
        <td>
          <button class="action-btn btn-slip book-for-patient-btn" data-phone="${p.phone}" data-name="${p.name}">
            📅 Book Next Visit
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.book-for-patient-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const phone = btn.getAttribute('data-phone');
        window.switchPortalTab('receptionBookTab');
        const qbName = document.getElementById('qbName');
        const qbPhone = document.getElementById('qbPhone');
        if (qbName) qbName.value = name;
        if (qbPhone) qbPhone.value = phone;
      });
    });
  };

  const patSearch = document.getElementById('patientSearchInput');
  if (patSearch) patSearch.addEventListener('input', window.renderPatientsDirectory);

  // --- Render Users Table ---
  window.renderUsersTable = () => {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    const users = window.getAdminUsers();
    tbody.innerHTML = '';

    users.forEach(u => {
      const tr = document.createElement('tr');
      const isRecep = u.role.toLowerCase().includes('reception');
      tr.innerHTML = `
        <td><strong>${u.fullName}</strong></td>
        <td><code>${u.username}</code></td>
        <td><span class="role-badge-pill ${isRecep ? 'badge-role-receptionist' : 'badge-role-admin'}">${u.role}</span></td>
        <td>${u.createdAt}</td>
        <td>
          <button class="action-btn btn-edit edit-user-btn" data-id="${u.id}">✏️ Edit</button>
          ${u.id !== 'usr_default_admin' ? `<button class="action-btn btn-delete delete-user-btn" data-id="${u.id}">🗑️ Delete</button>` : `<span style="font-size: 0.75rem; color: #94a3b8;">Primary Admin</span>`}
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.edit-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const u = users.find(x => x.id === id);
        if (u) {
          document.getElementById('editUserId').value = u.id;
          document.getElementById('editUserFullName').value = u.fullName;
          document.getElementById('editUserUsername').value = u.username;
          document.getElementById('editUserPassword').value = '';
          document.getElementById('editUserRole').value = u.role;
          document.getElementById('editUserModal').classList.add('open');
        }
      });
    });

    tbody.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this staff user account?')) {
          const filtered = users.filter(x => x.id !== id);
          window.saveAdminUsers(filtered);
          window.renderAdminDashboard();
        }
      });
    });
  };

  // --- Render Blogs Table ---
  window.renderBlogsTable = () => {
    const tbody = document.getElementById('blogsTableBody');
    if (!tbody) return;

    const customBlogs = window.getCustomBlogs();
    tbody.innerHTML = `
      <tr>
        <td>6 Oct 2026</td>
        <td><strong>Thyroid Nodules: When Should You Worry?</strong></td>
        <td>Thyroid Care</td>
        <td>Most thyroid nodules are benign, but some require evaluation...</td>
        <td><span style="font-size: 0.75rem; color: #94a3b8;">System Article</span></td>
      </tr>
      <tr>
        <td>6 Oct 2026</td>
        <td><strong>Preparing for Surgery: A Patient’s Guide</strong></td>
        <td>General Surgery</td>
        <td>Practical steps to prepare for surgery, from pre-op tests...</td>
        <td><span style="font-size: 0.75rem; color: #94a3b8;">System Article</span></td>
      </tr>
      <tr>
        <td>6 Oct 2026</td>
        <td><strong>Understanding Breast Cancer: Early Signs</strong></td>
        <td>Breast Cancer</td>
        <td>Recognising early signs of breast cancer and screening options...</td>
        <td><span style="font-size: 0.75rem; color: #94a3b8;">System Article</span></td>
      </tr>
    `;

    customBlogs.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${b.date}</td>
        <td><strong>${b.title}</strong></td>
        <td>${b.category}</td>
        <td>${b.excerpt}</td>
        <td>
          <button class="action-btn btn-edit edit-blog-btn" data-id="${b.id}">✏️ Edit</button>
          <button class="action-btn btn-delete delete-blog-btn" data-id="${b.id}">🗑️ Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.edit-blog-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const blog = customBlogs.find(b => b.id === id);
        if (blog) {
          document.getElementById('editBlogId').value = blog.id;
          document.getElementById('editBlogTitle').value = blog.title;
          document.getElementById('editBlogCategory').value = blog.category;
          document.getElementById('editBlogExcerpt').value = blog.excerpt;
          document.getElementById('editBlogContent').value = blog.content;
          document.getElementById('editBlogModal').classList.add('open');
        }
      });
    });

    tbody.querySelectorAll('.delete-blog-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this published article?')) {
          const filtered = customBlogs.filter(b => b.id !== id);
          window.saveCustomBlogs(filtered);
          window.renderAdminDashboard();
        }
      });
    });
  };

  // =========================================================================
  // 8. FORMS: RECEPTIONIST QUICK BOOK & SCHEDULE SETTINGS
  // =========================================================================

  // --- Receptionist Quick Book Form ---
  const qbForm = document.getElementById('receptionQuickBookForm');
  if (qbForm) {
    const qbDate = document.getElementById('qbDate');
    if (qbDate) qbDate.value = new Date().toISOString().slice(0, 10);

    qbForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('qbName').value.trim();
      const phone = document.getElementById('qbPhone').value.trim();
      const age = document.getElementById('qbAge').value.trim();
      const gender = document.getElementById('qbGender').value;
      const city = document.getElementById('qbCity').value.trim() || 'Faisalabad';
      const hospital = document.getElementById('qbHospital').value;
      const date = document.getElementById('qbDate').value;
      const timeSlot = document.getElementById('qbSlot').value;
      const concern = document.getElementById('qbConcern').value;
      const feeRupees = Number(document.getElementById('qbFeeRupees').value) || 2000;
      const paymentStatus = document.getElementById('qbPaymentStatus').value;
      const paymentMethod = document.getElementById('qbPaymentMethod').value;
      const slipNo = 'SLIP-' + Math.floor(1000 + Math.random() * 9000);

      const newAppt = {
        id: 'appt_' + Date.now(),
        slipNo,
        name,
        phone,
        age,
        gender,
        city,
        hospital,
        concern,
        date,
        timeSlot,
        feeRupees,
        paymentStatus,
        paymentMethod,
        status: 'waiting',
        createdAt: new Date().toLocaleString('en-GB'),
        bookedBy: 'Receptionist'
      };

      const appts = window.getAppointments();
      appts.unshift(newAppt);
      window.saveAppointments(appts);

      // Register or update patient directory
      window.upsertPatient(newAppt);

      alert(`Appointment Token ${slipNo} generated for ${name}! Opening slip...`);
      qbForm.reset();
      if (qbDate) qbDate.value = new Date().toISOString().slice(0, 10);

      window.renderAdminDashboard();
      window.showAppointmentSlip(newAppt);
    });
  }

  // --- Schedule & Fees Form ---
  const schedForm = document.getElementById('scheduleSettingsForm');
  if (schedForm) {
    schedForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const updatedSched = {
        feeStandard: Number(document.getElementById('feeStandard').value) || 2000,
        feeFollowup: Number(document.getElementById('feeFollowup').value) || 1500,
        feeEmergency: Number(document.getElementById('feeEmergency').value) || 3000,
        notice: document.getElementById('doctorLiveNotice').value.trim(),
        kardaar: {
          days: document.getElementById('kardaarDays').value.trim(),
          timings: document.getElementById('kardaarTimings').value.trim(),
          address: document.getElementById('kardaarAddress').value.trim()
        },
        faisal: {
          days: document.getElementById('faisalDays').value.trim(),
          timings: document.getElementById('faisalTimings').value.trim(),
          address: document.getElementById('faisalAddress').value.trim()
        },
        yashfeen: {
          days: document.getElementById('yashfeenDays') ? document.getElementById('yashfeenDays').value.trim() : 'Sunday / By Appointment',
          timings: document.getElementById('yashfeenTimings') ? document.getElementById('yashfeenTimings').value.trim() : '11:00 AM - 2:00 PM',
          address: document.getElementById('yashfeenAddress') ? document.getElementById('yashfeenAddress').value.trim() : 'Muslim Town No. 1, Gate No. 2, Muslim Town Market, Near Rehman Masjid, Sargodha Road, Faisalabad'
        }
      };

      window.saveDoctorSchedule(updatedSched);
      alert('Doctor schedule, OPD timings, and consultation fees updated successfully!');
      window.renderAdminDashboard();
    });
  }

  // --- New User Form ---
  const newUserForm = document.getElementById('newUserForm');
  if (newUserForm) {
    newUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('userFullName').value.trim();
      const username = document.getElementById('userUsername').value.trim();
      const password = document.getElementById('userPassword').value.trim();
      const role = document.getElementById('userRole').value;
      const createdAt = new Date().toLocaleDateString('en-GB');

      const users = window.getAdminUsers();
      if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        alert('Username already exists! Please choose another.');
        return;
      }

      users.push({
        id: 'usr_' + Date.now(),
        fullName,
        username,
        password,
        role,
        createdAt
      });

      window.saveAdminUsers(users);
      alert(`User "${username}" (${role}) created successfully!`);
      newUserForm.reset();
      window.renderAdminDashboard();
    });
  }

  // --- Edit User Form ---
  const editUserForm = document.getElementById('editUserForm');
  const editUserModal = document.getElementById('editUserModal');
  const editUserModalClose = document.getElementById('editUserModalClose');
  if (editUserModalClose && editUserModal) {
    editUserModalClose.addEventListener('click', () => editUserModal.classList.remove('open'));
  }
  if (editUserForm) {
    editUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('editUserId').value;
      const fullName = document.getElementById('editUserFullName').value.trim();
      const username = document.getElementById('editUserUsername').value.trim();
      const newPassword = document.getElementById('editUserPassword').value.trim();
      const role = document.getElementById('editUserRole').value;

      const users = window.getAdminUsers();
      const target = users.find(u => u.id === id);
      if (target) {
        target.fullName = fullName;
        target.username = username;
        if (newPassword.length > 0) target.password = newPassword;
        target.role = role;
        window.saveAdminUsers(users);
        editUserModal.classList.remove('open');
        alert('Staff account updated successfully!');
        window.renderAdminDashboard();
      }
    });
  }

  // --- New Blog Form ---
  const newBlogForm = document.getElementById('newBlogForm');
  if (newBlogForm) {
    newBlogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('blogTitle').value.trim();
      const category = document.getElementById('blogCategory').value;
      const excerpt = document.getElementById('blogExcerpt').value.trim();
      const content = document.getElementById('blogContent').value.trim();
      const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

      const newArticle = {
        id: 'blog_' + Date.now(),
        title,
        category,
        excerpt,
        content,
        date
      };

      const blogs = window.getCustomBlogs();
      blogs.unshift(newArticle);
      window.saveCustomBlogs(blogs);

      alert('Article published successfully! It will now appear on the doctor website.');
      newBlogForm.reset();
      window.renderAdminDashboard();
    });
  }

  // --- Edit Blog Form ---
  const editBlogForm = document.getElementById('editBlogForm');
  const editBlogModal = document.getElementById('editBlogModal');
  const editBlogModalClose = document.getElementById('editBlogModalClose');
  if (editBlogModalClose && editBlogModal) {
    editBlogModalClose.addEventListener('click', () => editBlogModal.classList.remove('open'));
  }
  if (editBlogForm) {
    editBlogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('editBlogId').value;
      const title = document.getElementById('editBlogTitle').value.trim();
      const category = document.getElementById('editBlogCategory').value;
      const excerpt = document.getElementById('editBlogExcerpt').value.trim();
      const content = document.getElementById('editBlogContent').value.trim();

      const blogs = window.getCustomBlogs();
      const target = blogs.find(b => b.id === id);
      if (target) {
        target.title = title;
        target.category = category;
        target.excerpt = excerpt;
        target.content = content;
        window.saveCustomBlogs(blogs);
        editBlogModal.classList.remove('open');
        alert('Blog article updated successfully!');
        window.renderAdminDashboard();
      }
    });
  }

  // --- Export CSV Button ---
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const appts = window.getAppointments();
      if (appts.length === 0) {
        alert('No appointments to export!');
        return;
      }

      let csv = 'Token Slip,Patient Name,Phone,Age,Gender,City,Hospital,Specialty,Date,Time Slot,Fee Rupees,Payment Status,Status,Created At\n';
      appts.forEach(a => {
        csv += `"${a.slipNo || ''}","${a.name}","${a.phone}","${a.age || ''}","${a.gender || ''}","${a.city || ''}","${a.hospital}","${a.concern}","${a.date}","${a.timeSlot}","${a.feeRupees || 2000}","${a.paymentStatus || 'Pending'}","${a.status}","${a.createdAt}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Dr_Naeem_Consultation_Slips_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
    });
  }

  // --- Clear All Appointments ---
  const clearAllApptsBtn = document.getElementById('clearAllApptsBtn');
  if (clearAllApptsBtn) {
    clearAllApptsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all appointments? This action cannot be undone.')) {
        window.saveAppointments([]);
        window.renderAdminDashboard();
      }
    });
  }

  // Run portal initialization on admin page load
  if (loginScreen || adminDashboard) {
    window.initializePortalView();
  }

});
