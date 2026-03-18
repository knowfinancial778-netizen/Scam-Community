const translations = {
    en: {
        search_placeholder: "Search for scam signatures...",
        welcome_title: "System Overview",
        welcome_desc: "Real-time analytics powered by Java, Python, and C++ Engine Cluster.",
        stat_total: "Total Reports",
        stat_threats: "Blocked Threats",
        nav_dashboard: "Dashboard",
        nav_report: "Submit Report",
        nav_feed: "Live Threat Feed",
        report_title: "Advanced Report Submission",
        public_feed_title: "Live Community Reports"
    },
    hi: {
        search_placeholder: "घोटाले के हस्ताक्षरों की खोज करें...",
        welcome_title: "प्रणाली अवलोकन",
        welcome_desc: "जावा, पायथन और सी++ इंजन क्लस्टर द्वारा संचालित रीयल-टाइम एनालिटिक्स।",
        stat_total: "कुल रिपोर्ट",
        stat_threats: "अवरुद्ध खतरे",
        nav_dashboard: "डैशबोर्ड",
        nav_report: "रिपोर्ट सबमिट करें",
        nav_feed: "लाइव थ्रेट फीड",
        report_title: "उन्नत रिपोर्ट सबमिशन",
        public_feed_title: "लाइव कम्युनिटी रिपोर्ट्स"
    },
    mr: {
        search_placeholder: "फसवणुकीच्या स्वाक्षऱ्या शोधा...",
        welcome_title: "प्रणाली विहंगावलोकन",
        welcome_desc: "जावा, पायथन आणि सी++ इंजिन क्लस्टरद्वारे समर्थित रिअल-टाइम विश्लेषण.",
        stat_total: "एकूण अहवाल",
        stat_threats: "अवरोधित धोके",
        nav_dashboard: "डॅशबोर्ड",
        nav_report: "अहवाल सबमिट करा",
        nav_feed: "लाइव्ह थ्रेट फीड",
        report_title: "प्रगत अहवाल सबमिशन",
        public_feed_title: "थेट समुदाय अहवाल"
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    let dbData = null;
    const tabContents = document.querySelectorAll('.tab-content');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav li');
    const langSelect = document.getElementById('lang-select');
    let mainChart = null;

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
        console.log("Encoded JWT ID token: " + response.credential);
        const user = decodeJwt(response.credential);
        alert(`Welcome ${user.name}! You are now authorized to publish reports.`);
        document.querySelector('.user-name').textContent = user.name;
        document.querySelector('.user-status').textContent = "Verified Provider";
    };

    function decodeJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    }

    async function initSystem() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/data');
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
            fetch('http://127.0.0.1:5000/api/report', {
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
                alert("Report synced with Database Cluster!");
                switchTab('live-feed');
            }).catch(err => {
                console.error("Database sync failed:", err);
                alert("Database offline. Running in local session mode.");
                dbData.scams.unshift(newReport);
                renderFeed();
                reportForm.reset();
                switchTab('live-feed');
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
