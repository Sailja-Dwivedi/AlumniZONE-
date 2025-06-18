
// const API_BASE_URL = 'http://localhost:3000';
const API_BASE_URL = `https://alumni-web-api.onrender.com`;


document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');

    const Token = localStorage.getItem('Token');
    const userRole = localStorage.getItem('userRole');

    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    // Mobile menu toggle
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
        });
    });

    // Update navbar visibility
    updateNavbar();

    // Redirect if not university admin
    if (!Token || userRole !== 'university_admin') {
        window.location.href = '../index.html';
        return;
    }

    // Load data
    loadUniversityData();
    loadRecentGraduates();

    // Profile redirection
    const profileLink = document.getElementById('profileLink');
    if (profileLink) {
        profileLink.addEventListener('click', function (e) {
            e.preventDefault();
            redirectToRoleDashboard(userRole);
        });
    }

    // Logout handler
    const logoutBtn = document.getElementById('logoutLink');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

function updateNavbar() {
    const token = localStorage.getItem('Token');
    const profileLink = document.getElementById('profileLink');
    const logoutLink = document.getElementById('logoutLink');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');

    if (token) {
        profileLink?.classList.remove('hidden');
        logoutLink?.classList.remove('hidden');
        loginLink?.classList.add('hidden');
        registerLink?.classList.add('hidden');
    } else {
        profileLink?.classList.add('hidden');
        logoutLink?.classList.add('hidden');
        loginLink?.classList.remove('hidden');
        registerLink?.classList.remove('hidden');
    }
}

function redirectToRoleDashboard(role) {
    const rolePages = {
        'alumni': 'html/alumni-dashboard.html',
        'recruiter': 'html/recruiter-dashboard.html',
        'university_admin': 'html/university-dashboard.html',
        'suparadmin': 'html/superAdmin.html'
    };
    const page = rolePages[String(role).toLowerCase().trim()];
    window.location.href = page || '../index.html';
}

function logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('alumniId');
    window.location.href = '../index.html';
}

async function loadUniversityData() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('Token')}` }
        });
        const data = await res.json();
        const user = data.user;

        document.getElementById('adminName').textContent = user.name;
        document.getElementById('welcomeName').textContent = user.name.split(' ')[0];

        const logoImg = document.getElementById('logo');
        if (data.imageUrl) {
            logoImg.src = data.imageUrl;
        }
        document.getElementById('profileBox')?.classList.remove('hidden');
    } catch (err) {
        console.error('Error loading university data:', err);
    }
}



async function loadPostHtml() {
    try {
        const response = await fetch('../component/post.html');
        const html = await response.text();
        document.getElementById('graduatesGrid').innerHTML = html;
        document.getElementById('dynamic-title').textContent = 'Posts Section';
    } catch (err) {
        console.error('Error loading post.html:', err);
    }
}
