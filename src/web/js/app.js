const translations = {
    en: {
        search_placeholder: "Search for scam signatures...",
        welcome_title: "ScamGuard Pro Home",
        welcome_desc: "Real-time threat intelligence and community protection hub.",
        stat_total: "Total Reports",
        stat_threats: "Blocked Threats",
        nav_home: "Home",
        nav_community: "Community",
        nav_safety: "Safety Tricks",
        nav_upload: "Upload Report",
        nav_login: "Log in",
        report_title: "Upload Fraud Report",
        public_feed_title: "Community Intelligence"
    },
    hi: {
        search_placeholder: "घोटाले के हस्ताक्षरों की खोज करें...",
        welcome_title: "स्कैमगार्ड होम",
        welcome_desc: "रीयल-टाइम थ्रेट इंटेलिजेंस और कम्युनिटी प्रोटेक्शन हब।",
        stat_total: "कुल रिपोर्ट",
        stat_threats: "अवरुद्ध खतरे",
        nav_home: "होम",
        nav_community: "समुदाय",
        nav_safety: "सुरक्षा ट्रिक्स",
        nav_upload: "रिपोर्ट अपलोड करें",
        nav_login: "लॉगिन करें",
        report_title: "धोखाधड़ी रिपोर्ट अपलोड करें",
        public_feed_title: "सामुदायिक खुफिया"
    },
    mr: {
        search_placeholder: "फसवणुकीच्या स्वाक्षऱ्या शोधा...",
        welcome_title: "स्कॅमगार्ड होम",
        welcome_desc: "रिअल-टाइम थ्रेट इंटेलिजन्स आणि समुदाय संरक्षण केंद्र.",
        stat_total: "एकूण अहवाल",
        stat_threats: "अवरोधित धोके",
        nav_home: "होम",
        nav_community: "समुदाय",
        nav_safety: "सुरक्षा ट्रिक्स",
        nav_upload: "अहवाल अपलोड करा",
        nav_login: "लॉग इन करा",
        report_title: "फसवणूक अहवाल अपलोड करा",
        public_feed_title: "समुदाय बुद्धिमत्ता"
    },
};

document.addEventListener('DOMContentLoaded', async () => {
    let dbData = null;
    const tabContents = document.querySelectorAll('.tab-content');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav li');
    const langSelect = document.getElementById('lang-select');
    let mainChart = null;
    const API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
        ? 'http://127.0.0.1:5000'
        : 'https://scam-community.onrender.com'; // Change this after deploying to Render

    // Multi-Language Logic
    function updateLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (el.tagName === 'INPUT') el.placeholder = translations[lang][key];
                else el.textContent = translations[lang][key];
            }
        });

        // Manual updates for elements without simple data-i18n
        document.querySelector('.welcome-header h1').textContent = translations[lang].welcome_title;
        document.querySelector('.welcome-header p').textContent = translations[lang].welcome_desc;
    }

    langSelect.addEventListener('change', (e) => updateLanguage(e.target.value));

    // Google Auth Logic
    window.handleCredentialResponse = (response) => {
        const user = decodeJwt(response.credential);
        alert(`Welcome ${user.name}! You are now authorized to upload reports.`);
        
        // Update user UI
        document.querySelector('.user-name').textContent = user.name;
        document.querySelector('.user-status').textContent = "Verified Member";
        
        // Hide Login sidebar button
        const loginBtn = document.getElementById('sidebar-login-btn');
        if (loginBtn) loginBtn.style.display = 'none';
        
        // Switch to home after login
        switchTab('home');
    };

    function decodeJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    }

    async function initSystem() {
        try {
            const response = await fetch(`${API_URL}/api/data`);
            const data = await response.json();
            dbData = data;
        } catch (error) {
            console.warn("Backend not detected, running in standalone mode.");
            dbData = {
                "scams": [],
                "features": ["Auth", "Logic", "AI", "Cloud", "Crypto", "Web3", "Scale", "ML", "SSL", "API", "SDK", "Vault", "Node", "Cluster", "Shard", "Sync"],
                "stats": { "total_reports": "0", "blocked_threats": "0", "verified_partners": "0", "active_scams": "0" }
            };
        }
        renderDashboard();
        renderFeed();
        initCharts();
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');
            if (tabId) {
                switchTab(tabId);
                // Close sidebar on mobile after click
                if (window.innerWidth <= 1024) {
                    document.querySelector('.sidebar').classList.remove('open');
                }
            }
        });
    });

    // Mobile Menu Toggle Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 &&
            !sidebar.contains(e.target) &&
            !mobileMenuBtn.contains(e.target) &&
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    function switchTab(tabId) {
        sidebarLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeLink) activeLink.classList.add('active');
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) content.classList.add('active');
        });

        // Initialize secondary login if switching to login tab
        if (tabId === 'login-tab') {
            google.accounts.id.renderButton(
                document.getElementById("g_id_signin_secondary"),
                { theme: "outline", size: "large", width: "250" }
            );
        }
    }

    function renderFeed() {
        const stream = document.getElementById('reports-stream');
        if (!stream) return;
        stream.innerHTML = '';
        dbData.scams.forEach(scam => {
            const div = document.createElement('div');
            div.className = 'glass-card feed-item';
            div.innerHTML = `
                <div class="feed-info">
                    <span class="severity-indicator ${scam.severity.toLowerCase()}">${scam.severity}</span>
                    <strong style="margin-left: 10px">${scam.title}</strong>
                    <span style="color: var(--text-muted); font-size: 0.8rem; margin-left:10px">By: ${scam.provider}</span>
                </div>
                <div class="feed-meta">
                    <span style="font-size: 0.8rem; color: var(--text-muted)">${scam.timestamp}</span>
                </div>
            `;
            stream.appendChild(div);
        });
    }

    // Report Submission Simulation
    const reportForm = document.getElementById('scam-form-v3');
    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const details = reportForm.querySelector('textarea').value;
            const category = reportForm.querySelector('select').value;

            if (!details) return alert("Please provide report details.");

            const newReport = {
                id: Date.now(),
                title: category + " Alert",
                category: category,
                severity: "High",
                timestamp: "Just now",
                status: "Pending",
                provider: document.querySelector('.user-name').textContent
            };

            // Post to API
            fetch(`${API_URL}/api/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newReport.title,
                    category: newReport.category,
                    severity: newReport.severity,
                    timestamp: newReport.timestamp,
                    status: newReport.status,
                    provider: newReport.provider,
                    details: details
                })
            }).then(() => {
                dbData.scams.unshift(newReport);
                dbData.stats.total_reports = (parseInt(dbData.stats.total_reports || 0) + 1).toString();

                if (mainChart) {
                    mainChart.data.datasets[0].data[2]++;
                    mainChart.update();
                }

                renderFeed();
                renderDashboard();
                reportForm.reset();
                alert("Report successfully uploaded to Cloud Intelligence!");
                switchTab('community');
            }).catch(err => {
                console.error("Database sync failed:", err);
                alert("Network latency detected. Saved locally.");
                dbData.scams.unshift(newReport);
                renderFeed();
                reportForm.reset();
                switchTab('community');
            });
        });
    }

    function renderDashboard() {
        document.getElementById('stat-total').textContent = dbData.stats.total_reports || 0;
        document.getElementById('stat-threats').textContent = dbData.stats.blocked_threats || 0;

        const stats = document.querySelectorAll('.stat-card .value');
        if (stats.length >= 4) {
            stats[2].textContent = dbData.stats.verified_partners || 0;
            stats[3].textContent = dbData.stats.active_scams || 0;
        }
    }

    function initCharts() {
        const ctx = document.getElementById('scamChart');
        if (!ctx || mainChart) return;
        mainChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Attacks Blocked',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    initSystem();
});
