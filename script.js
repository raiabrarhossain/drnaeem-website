/**
 * Dr. Muhammad Naeem - Consultant Surgeon Website & Admin JavaScript
 * Handles Bilingual Toggle, Mobile Drawer, Modal Articles, Appointment Persistence, Daily Blog CRUD, User Management, and Main Website Login Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Data Persistence Helpers ---
  const getAppointments = () => {
    try {
      return JSON.parse(localStorage.getItem('naeem_appointments')) || [];
    } catch (e) {
      return [];
    }
  };

  const saveAppointments = (appts) => {
    localStorage.setItem('naeem_appointments', JSON.stringify(appts));
  };

  const getCustomBlogs = () => {
    try {
      return JSON.parse(localStorage.getItem('naeem_custom_blogs')) || [];
    } catch (e) {
      return [];
    }
  };

  const saveCustomBlogs = (blogs) => {
    localStorage.setItem('naeem_custom_blogs', JSON.stringify(blogs));
  };

  // --- Admin Users Persistence ---
  window.getAdminUsers = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('naeem_admin_users'));
      if (stored && stored.length > 0) return stored;
    } catch (e) {}
    
    const defaultUsers = [{
      id: 'usr_default_admin',
      fullName: 'Dr. Muhammad Naeem',
      username: 'admin',
      password: 'admin123',
      role: 'Super Admin',
      createdAt: '06/10/2026'
    }];
    localStorage.setItem('naeem_admin_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  };

  const saveAdminUsers = (users) => {
    localStorage.setItem('naeem_admin_users', JSON.stringify(users));
  };

  window.getAdminUsers();

  // --- Language Toggle System ---
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

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const closeNav = document.getElementById('closeNav');
  const mobileNav = document.getElementById('mobileNav');
  const navOverlay = document.getElementById('navOverlay');

  const openMobileNav = () => {
    if (mobileNav) mobileNav.classList.add('open');
    if (navOverlay) navOverlay.classList.add('active');
  };

  const closeMobileNav = () => {
    if (mobileNav) mobileNav.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
  };

  if (menuToggle) menuToggle.addEventListener('click', openMobileNav);
  if (closeNav) closeNav.addEventListener('click', closeMobileNav);
  if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);

  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // --- Article Reader Modal System ---
  const modalBackdrop = document.getElementById('articleModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalMeta = document.getElementById('modalMeta');
  const modalBody = document.getElementById('modalBody');

  const defaultArticles = {
    'thyroid-nodules': {
      titleEn: 'Thyroid Nodules: When Should You Worry?',
      titleUr: 'تھائیرائیڈ کی گلٹیاں: آپ کو کب فکر مند ہونا چاہیے؟',
      metaEn: 'THYROID CARE · Published Oct 6, 2026',
      metaUr: 'تھائیرائیڈ کی دیکھ بھال · شائع شدہ 6 اکتوبر 2026',
      contentEn: `
        <p>Thyroid nodules are solid or fluid-filled lumps that form within your thyroid gland. Most thyroid nodules are benign, but a thorough surgical evaluation is essential to rule out malignancy.</p>
        <h3>Common Symptoms</h3>
        <ul>
          <li>A noticeable lump or swelling in the neck</li>
          <li>Tightness or difficulty swallowing</li>
          <li>Voice hoarseness</li>
        </ul>
        <p>Contact Dr. Naeem for clinical examination and thyroid ultrasound guidance.</p>
      `,
      contentUr: `
        <p>تھائیرائیڈ کی گلٹیاں گردن کی تہہ میں موجود غدود میں بننے والے ابھار ہوتے ہیں۔ زیادہ تر گلٹیاں بے ضرر ہوتی ہیں لیکن سرجن سے معائنہ ضروری ہے۔</p>
      `
    },
    'preparing-for-surgery': {
      titleEn: 'Preparing for Surgery: A Patient’s Guide',
      titleUr: 'سرجری کی تیاری: مریضوں کے لیے اہم رہنمائی',
      metaEn: 'GENERAL SURGERY · Published Oct 6, 2026',
      metaUr: 'جنرل سرجری · شائع شدہ 6 اکتوبر 2026',
      contentEn: `
        <p>Preparing for surgery effectively reduces pre-operative anxiety and accelerates recovery.</p>
      `,
      contentUr: `
        <p>سرجری سے پہلے آگاہی مریض کی پریشانی کو کم کرتی ہے۔</p>
      `
    },
    'breast-cancer-early-signs': {
      titleEn: 'Understanding Breast Cancer: Early Signs & Screening',
      titleUr: 'چھاتی کا کینسر: ابتدائی علامات اور سکریننگ',
      metaEn: 'BREAST CANCER SURGERY · Published Oct 6, 2026',
      metaUr: 'چھاتی کے کینسر کی سرجری · شائع شدہ 6 اکتوبر 2026',
      contentEn: `
        <p>Early detection of breast cancer leads to high treatment success rates.</p>
      `,
      contentUr: `
        <p>چھاتی کے کینسر کی وقت پر تشخیص مؤثر علاج کی ضامن ہے۔</p>
      `
    }
  };

  document.querySelectorAll('.article-card a[data-article]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const articleKey = btn.getAttribute('data-article');
      if (articleKey && defaultArticles[articleKey] && modalBackdrop) {
        e.preventDefault();
        const article = defaultArticles[articleKey];
        const isUr = currentLang === 'ur';
        
        if (modalTitle) modalTitle.textContent = isUr ? article.titleUr : article.titleEn;
        if (modalMeta) modalMeta.textContent = isUr ? article.metaUr : article.metaEn;
        if (modalBody) modalBody.innerHTML = isUr ? article.contentUr : article.contentEn;
        
        modalBackdrop.classList.add('open');
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
      }
    });
  }

  // --- Dynamic Render Custom Admin Articles on Homepage ---
  const renderCustomBlogsOnWebsite = () => {
    const customBlogs = getCustomBlogs();
    const servicesGrid = document.querySelector('.articles .services-grid');
    
    if (servicesGrid && customBlogs.length > 0) {
      customBlogs.forEach((blog) => {
        const articleCard = document.createElement('article');
        articleCard.className = 'service-card article-card';
        articleCard.innerHTML = `
          <div class="service-top">
            <span class="medical-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
            </span>
            <span>${blog.category}</span>
          </div>
          <h3>${blog.title}</h3>
          <p>${blog.excerpt}</p>
          <div class="article-date">${blog.date}</div>
          <a href="#" class="custom-blog-read-btn" data-id="${blog.id}">
            <span>Read article</span> &rarr;
          </a>
        `;
        servicesGrid.prepend(articleCard);

        articleCard.querySelector('.custom-blog-read-btn').addEventListener('click', (e) => {
          e.preventDefault();
          if (modalTitle) modalTitle.textContent = blog.title;
          if (modalMeta) modalMeta.textContent = `${blog.category.toUpperCase()} · Published ${blog.date}`;
          if (modalBody) modalBody.innerHTML = `<p style="font-size: 1.05rem; line-height: 1.8;">${blog.content.replace(/\n/g, '<br>')}</p>`;
          if (modalBackdrop) modalBackdrop.classList.add('open');
        });
      });
    }
  };

  renderCustomBlogsOnWebsite();

  // --- Main Website Login Button & Modal System ---
  const mainLoginBtn = document.getElementById('mainLoginBtn');
  const headerLogoutBtn = document.getElementById('headerLogoutBtn');
  const mobileLoginBtn = document.getElementById('mobileLoginBtn');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
  
  const siteLoginModal = document.getElementById('siteLoginModal');
  const siteLoginModalClose = document.getElementById('siteLoginModalClose');

  const loginTabAdmin = document.getElementById('loginTabAdmin');
  const loginTabPatient = document.getElementById('loginTabPatient');
  const modalAdminForm = document.getElementById('modalAdminForm');
  const modalPatientForm = document.getElementById('modalPatientForm');
  const modalAdminError = document.getElementById('modalAdminError');

  const performLogout = () => {
    sessionStorage.removeItem('naeem_admin_logged_user');
    localStorage.removeItem('naeem_patient_session');
    alert('Logged out successfully!');
    checkHeaderLoginStatus();
  };

  if (headerLogoutBtn) headerLogoutBtn.addEventListener('click', performLogout);
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', (e) => { e.preventDefault(); performLogout(); });

  // Check login state to update Header Button & Logout button visibility
  const checkHeaderLoginStatus = () => {
    const loggedAdmin = sessionStorage.getItem('naeem_admin_logged_user');
    const loggedPatient = JSON.parse(localStorage.getItem('naeem_patient_session') || 'null');
    const isUr = localStorage.getItem('site_lang') === 'ur';

    if (loggedAdmin || loggedPatient) {
      if (headerLogoutBtn) headerLogoutBtn.style.display = 'inline-flex';
      if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
    } else {
      if (headerLogoutBtn) headerLogoutBtn.style.display = 'none';
      if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
    }

    if (mainLoginBtn) {
      if (loggedAdmin) {
        mainLoginBtn.innerHTML = `🔐 ${loggedAdmin}`;
        mainLoginBtn.setAttribute('href', 'admin.html');
        mainLoginBtn.onclick = null;
      } else if (loggedPatient) {
        mainLoginBtn.innerHTML = `👤 ${loggedPatient.name}`;
        mainLoginBtn.setAttribute('href', '#');
        mainLoginBtn.onclick = (e) => { e.preventDefault(); openSiteLoginModal('patient'); };
      } else {
        mainLoginBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg> <span>${isUr ? 'لاگ ان' : 'Login'}</span>`;
        mainLoginBtn.setAttribute('href', 'admin.html');
        mainLoginBtn.onclick = null;
      }
    }

    if (mobileLoginBtn) {
      if (loggedAdmin) {
        mobileLoginBtn.innerHTML = `🔐 Admin Portal (${loggedAdmin})`;
        mobileLoginBtn.setAttribute('href', 'admin.html');
        mobileLoginBtn.onclick = null;
      } else if (loggedPatient) {
        mobileLoginBtn.innerHTML = `👤 Patient (${loggedPatient.name})`;
        mobileLoginBtn.setAttribute('href', '#');
        mobileLoginBtn.onclick = (e) => { e.preventDefault(); openSiteLoginModal('patient'); };
      } else {
        mobileLoginBtn.innerHTML = `🔐 ${isUr ? 'لاگ ان پورٹل' : 'Login Portal'}`;
        mobileLoginBtn.setAttribute('href', 'admin.html');
        mobileLoginBtn.onclick = null;
      }
    }
  };

  const openSiteLoginModal = (tab = 'admin') => {
    const modal = document.getElementById('siteLoginModal');
    if (modal) {
      modal.classList.add('open');
      if (tab === 'admin') {
        switchLoginTab('admin');
      } else {
        switchLoginTab('patient');
      }
    }
  };

  window.openSiteLoginModal = openSiteLoginModal;

  const switchLoginTab = (tab) => {
    if (tab === 'admin') {
      loginTabAdmin.style.background = 'var(--primary)';
      loginTabAdmin.style.color = 'white';
      loginTabPatient.style.background = 'transparent';
      loginTabPatient.style.color = 'var(--dark-text)';

      modalAdminForm.style.display = 'block';
      modalPatientForm.style.display = 'none';
    } else {
      loginTabPatient.style.background = '#0284c7';
      loginTabPatient.style.color = 'white';
      loginTabAdmin.style.background = 'transparent';
      loginTabAdmin.style.color = 'var(--dark-text)';

      modalPatientForm.style.display = 'block';
      modalAdminForm.style.display = 'none';

      // Prefill if patient session exists
      const patientSession = JSON.parse(localStorage.getItem('naeem_patient_session') || 'null');
      if (patientSession) {
        document.getElementById('modalPatientPhone').value = patientSession.phone;
        document.getElementById('modalPatientName').value = patientSession.name;
      }
    }
  };

  if (loginTabAdmin) loginTabAdmin.addEventListener('click', () => switchLoginTab('admin'));
  if (loginTabPatient) loginTabPatient.addEventListener('click', () => switchLoginTab('patient'));
  if (siteLoginModalClose) siteLoginModalClose.addEventListener('click', () => siteLoginModal.classList.remove('open'));
  if (siteLoginModal) {
    siteLoginModal.addEventListener('click', (e) => {
      if (e.target === siteLoginModal) siteLoginModal.classList.remove('open');
    });
  }

  // Handle Admin Form in Site Modal
  if (modalAdminForm) {
    modalAdminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userVal = document.getElementById('modalAdminUser').value.trim();
      const pwdVal = document.getElementById('modalAdminPass').value.trim();

      const users = window.getAdminUsers();
      const match = users.find(u => u.username.toLowerCase() === userVal.toLowerCase() && u.password === pwdVal);

      if (match) {
        sessionStorage.setItem('naeem_admin_logged_user', match.fullName);
        if (modalAdminError) modalAdminError.style.display = 'none';
        siteLoginModal.classList.remove('open');
        window.location.href = 'admin.html';
      } else {
        if (modalAdminError) modalAdminError.style.display = 'block';
      }
    });
  }

  // Handle Patient Form in Site Modal
  if (modalPatientForm) {
    modalPatientForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('modalPatientPhone').value.trim();
      const name = document.getElementById('modalPatientName').value.trim();

      localStorage.setItem('naeem_patient_session', JSON.stringify({ name, phone }));
      checkHeaderLoginStatus();

      // Show Patient Appointments Popup
      const allAppts = getAppointments();
      const myAppts = allAppts.filter(a => a.phone.includes(phone) || a.name.toLowerCase().includes(name.toLowerCase()));

      siteLoginModal.classList.remove('open');
      
      if (modalTitle) modalTitle.textContent = `Welcome, ${name}`;
      if (modalMeta) modalMeta.textContent = `PATIENT PORTAL · Contact: ${phone}`;
      
      let apptHtml = '';
      if (myAppts.length === 0) {
        apptHtml = `<p style="color: var(--muted-text); margin-bottom: 20px;">No appointment records found for ${phone}. You can submit a new inquiry below!</p>`;
      } else {
        apptHtml = `
          <h3 style="color: var(--primary-dark); font-size: 1.1rem; margin-bottom: 12px;">Your Appointment Inquiries</h3>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${myAppts.map(a => `
              <div style="background: var(--light-bg); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 4px;">
                  <span>${a.hospital}</span>
                  <span class="status-badge ${a.status === 'new' ? 'status-new' : 'status-contacted'}">${a.status}</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--muted-text);">Concern: ${a.concern}</div>
                <div style="font-size: 0.8rem; color: var(--primary); margin-top: 4px;">Requested Date: ${a.date} (Submitted: ${a.createdAt})</div>
              </div>
            `).join('')}
          </div>
        `;
      }

      apptHtml += `
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px;">
          <a href="#appointment" class="button" onclick="document.getElementById('articleModal').classList.remove('open');">
            📅 Book New Appointment
          </a>
          <button class="button button-secondary" onclick="localStorage.removeItem('naeem_patient_session'); location.reload();">
            🚪 Logout Patient
          </button>
        </div>
      `;

      if (modalBody) modalBody.innerHTML = apptHtml;
      if (modalBackdrop) modalBackdrop.classList.add('open');
    });
  }

  checkHeaderLoginStatus();

  // --- Appointment Form Submission Handler ---
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(appointmentForm);
      const name = formData.get('full_name');
      const phone = formData.get('phone');
      const hospital = formData.get('hospital');
      const concern = formData.get('concern');
      const date = formData.get('preferred_date');
      const createdAt = new Date().toLocaleString();

      const newQuery = {
        id: 'appt_' + Date.now(),
        name,
        phone,
        hospital,
        concern,
        date,
        createdAt,
        status: 'new'
      };

      const appts = getAppointments();
      appts.unshift(newQuery);
      saveAppointments(appts);

      // Auto save patient session
      localStorage.setItem('naeem_patient_session', JSON.stringify({ name, phone }));
      checkHeaderLoginStatus();

      const msg = `Hello Dr. Muhammad Naeem's Clinic,\n\nI would like to request an appointment:\n- Name: ${name}\n- Phone: ${phone}\n- Hospital: ${hospital}\n- Concern: ${concern}\n- Preferred Date: ${date}`;
      const waUrl = `https://wa.me/923007991099?text=${encodeURIComponent(msg)}`;

      const isUr = currentLang === 'ur';
      if (modalTitle) modalTitle.textContent = isUr ? 'آپ کی درخواست موصول ہو گئی ہے' : 'Inquiry Submitted Successfully';
      if (modalMeta) modalMeta.textContent = isUr ? 'ہم جلد آپ سے رابطہ کریں گے' : 'We will reach out to confirm your slot shortly.';
      
      if (modalBody) {
        modalBody.innerHTML = `
          <div class="success-modal">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <p style="margin-bottom: 20px; font-size: 1.05rem;">
              ${isUr ? `شکریہ ${name}! آپ کی درخواست موصول ہو چکی ہے۔ فوری تصدیق کے لیے آپ واٹس ایپ پر بھی پیام بھیج سکتے ہیں۔` : `Thank you ${name}! Your consultation request for <strong>${hospital}</strong> on <strong>${date}</strong> has been received.`}
            </p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              <a href="${waUrl}" target="_blank" class="button" style="background: #25d366; color: white; border: none;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
                ${isUr ? 'واٹس ایپ پر میسج کریں' : 'Send via WhatsApp Now'}
              </a>
              <a href="tel:+923007991099" class="button button-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                ${isUr ? 'کال کریں 03007991099' : 'Call 03007991099'}
              </a>
            </div>
          </div>
        `;
      }
      
      if (modalBackdrop) modalBackdrop.classList.add('open');
      appointmentForm.reset();
    });
  }

  // --- Admin Dashboard Master Render ---
  window.renderAdminDashboard = () => {
    const apptsTableBody = document.getElementById('appointmentsTableBody');
    const blogsTableBody = document.getElementById('blogsTableBody');
    const usersTableBody = document.getElementById('usersTableBody');

    const statTotalAppts = document.getElementById('statTotalAppts');
    const statNewAppts = document.getElementById('statNewAppts');
    const statTotalBlogs = document.getElementById('statTotalBlogs');
    const statTotalUsers = document.getElementById('statTotalUsers');
    const unreadApptBadge = document.getElementById('unreadApptBadge');

    const appts = getAppointments();
    const customBlogs = getCustomBlogs();
    const users = window.getAdminUsers();

    const newApptsCount = appts.filter(a => a.status === 'new').length;
    if (statTotalAppts) statTotalAppts.textContent = appts.length;
    if (statNewAppts) statNewAppts.textContent = newApptsCount;
    if (unreadApptBadge) unreadApptBadge.textContent = newApptsCount;
    if (statTotalBlogs) statTotalBlogs.textContent = 3 + customBlogs.length;
    if (statTotalUsers) statTotalUsers.textContent = users.length;

    if (apptsTableBody) {
      apptsTableBody.innerHTML = '';
      if (appts.length === 0) {
        apptsTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--muted-text); padding: 30px;">No appointment inquiries received yet. Submit a test form on the main website!</td></tr>`;
      } else {
        appts.forEach(appt => {
          const tr = document.createElement('tr');
          const cleanPhone = appt.phone.replace(/[^0-9+]/g, '');
          const waUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone}?text=Hello%20${encodeURIComponent(appt.name)},%20this%20is%20Dr.%20Muhammad%20Naeem's%20clinic%20regarding%20your%20appointment%20request.`;
          
          tr.innerHTML = `
            <td style="font-size: 0.8rem; color: var(--muted-text);">${appt.createdAt}</td>
            <td><strong>${appt.name}</strong></td>
            <td>${appt.phone}</td>
            <td>${appt.hospital}</td>
            <td>${appt.concern}</td>
            <td>${appt.date}</td>
            <td>
              <span class="status-badge ${appt.status === 'new' ? 'status-new' : 'status-contacted'}">
                ${appt.status}
              </span>
            </td>
            <td>
              <a href="${waUrl}" target="_blank" class="action-btn btn-wa">WhatsApp</a>
              <a href="tel:${cleanPhone}" class="action-btn btn-call">Call</a>
              <button class="action-btn btn-delete toggle-status-btn" data-id="${appt.id}">
                ${appt.status === 'new' ? 'Mark Contacted' : 'Mark New'}
              </button>
              <button class="action-btn btn-delete delete-appt-btn" data-id="${appt.id}">Delete</button>
            </td>
          `;
          apptsTableBody.appendChild(tr);
        });

        apptsTableBody.querySelectorAll('.toggle-status-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const target = appts.find(a => a.id === id);
            if (target) {
              target.status = target.status === 'new' ? 'contacted' : 'new';
              saveAppointments(appts);
              window.renderAdminDashboard();
            }
          });
        });

        apptsTableBody.querySelectorAll('.delete-appt-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const filtered = appts.filter(a => a.id !== id);
            saveAppointments(filtered);
            window.renderAdminDashboard();
          });
        });
      }
    }

    if (blogsTableBody) {
      blogsTableBody.innerHTML = `
        <tr>
          <td>Oct 6, 2026</td>
          <td><strong>Thyroid Nodules: When Should You Worry?</strong></td>
          <td>Thyroid Care</td>
          <td>Most thyroid nodules are benign, but some require evaluation...</td>
          <td><span style="font-size: 0.8rem; color: var(--muted-text);">System Article</span></td>
        </tr>
        <tr>
          <td>Oct 6, 2026</td>
          <td><strong>Preparing for Surgery: A Patient’s Guide</strong></td>
          <td>General Surgery</td>
          <td>Practical steps to prepare for surgery, from pre-op tests...</td>
          <td><span style="font-size: 0.8rem; color: var(--muted-text);">System Article</span></td>
        </tr>
        <tr>
          <td>Oct 6, 2026</td>
          <td><strong>Understanding Breast Cancer: Early Signs</strong></td>
          <td>Breast Cancer</td>
          <td>Recognising early signs of breast cancer and screening options...</td>
          <td><span style="font-size: 0.8rem; color: var(--muted-text);">System Article</span></td>
        </tr>
      `;

      customBlogs.forEach(blog => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${blog.date}</td>
          <td><strong>${blog.title}</strong></td>
          <td>${blog.category}</td>
          <td>${blog.excerpt}</td>
          <td>
            <button class="action-btn btn-edit edit-blog-btn" data-id="${blog.id}">✏️ Edit</button>
            <button class="action-btn btn-delete delete-blog-btn" data-id="${blog.id}">🗑️ Delete</button>
          </td>
        `;
        blogsTableBody.appendChild(tr);
      });

      blogsTableBody.querySelectorAll('.edit-blog-btn').forEach(btn => {
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

      blogsTableBody.querySelectorAll('.delete-blog-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this blog article?')) {
            const filtered = customBlogs.filter(b => b.id !== id);
            saveCustomBlogs(filtered);
            window.renderAdminDashboard();
          }
        });
      });
    }

    if (usersTableBody) {
      usersTableBody.innerHTML = '';
      users.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${u.fullName}</strong></td>
          <td><code>${u.username}</code></td>
          <td><span class="status-badge status-contacted">${u.role}</span></td>
          <td>${u.createdAt}</td>
          <td>
            <button class="action-btn btn-edit edit-user-btn" data-id="${u.id}">✏️ Edit</button>
            ${u.id !== 'usr_default_admin' ? `<button class="action-btn btn-delete delete-user-btn" data-id="${u.id}">🗑️ Delete</button>` : `<span style="font-size: 0.75rem; color: var(--muted-text);">Protected</span>`}
          </td>
        `;
        usersTableBody.appendChild(tr);
      });

      usersTableBody.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const user = users.find(u => u.id === id);
          if (user) {
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editUserFullName').value = user.fullName;
            document.getElementById('editUserUsername').value = user.username;
            document.getElementById('editUserPassword').value = '';
            document.getElementById('editUserRole').value = user.role;
            document.getElementById('editUserModal').classList.add('open');
          }
        });
      });

      usersTableBody.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this user?')) {
            const filtered = users.filter(u => u.id !== id);
            saveAdminUsers(filtered);
            window.renderAdminDashboard();
          }
        });
      });
    }
  };

  // --- Edit Blog Modal Submit Handler ---
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

      const customBlogs = getCustomBlogs();
      const target = customBlogs.find(b => b.id === id);

      if (target) {
        target.title = title;
        target.category = category;
        target.excerpt = excerpt;
        target.content = content;

        saveCustomBlogs(customBlogs);
        editBlogModal.classList.remove('open');
        alert('Blog article updated successfully!');
        window.renderAdminDashboard();
      }
    });
  }

  // --- Add New User Form Handler ---
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
        alert('Username already exists! Choose a different username.');
        return;
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        fullName,
        username,
        password,
        role,
        createdAt
      };

      users.push(newUser);
      saveAdminUsers(users);

      alert(`User "${username}" created successfully!`);
      newUserForm.reset();
      window.renderAdminDashboard();
    });
  }

  // --- Edit User Modal Submit Handler ---
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

        saveAdminUsers(users);
        editUserModal.classList.remove('open');
        alert('User profile updated successfully!');
        window.renderAdminDashboard();
      }
    });
  }

  // --- New Blog Form Handler ---
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

      const blogs = getCustomBlogs();
      blogs.unshift(newArticle);
      saveCustomBlogs(blogs);

      alert('Article published successfully! It will now appear on the website.');
      newBlogForm.reset();
      if (window.renderAdminDashboard) window.renderAdminDashboard();
    });
  }

  // --- Export CSV Handler ---
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const appts = getAppointments();
      if (appts.length === 0) {
        alert('No appointments to export!');
        return;
      }

      let csv = 'Timestamp,Patient Name,Phone,Hospital,Procedure/Concern,Requested Date,Status\n';
      appts.forEach(a => {
        csv += `"${a.createdAt}","${a.name}","${a.phone}","${a.hospital}","${a.concern.replace(/"/g, '""')}","${a.date}","${a.status}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Dr_Naeem_Appointments_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    });
  }

  // --- Clear All Handler ---
  const clearAllApptsBtn = document.getElementById('clearAllApptsBtn');
  if (clearAllApptsBtn) {
    clearAllApptsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all appointment inquiries?')) {
        saveAppointments([]);
        if (window.renderAdminDashboard) window.renderAdminDashboard();
      }
    });
  }

});
