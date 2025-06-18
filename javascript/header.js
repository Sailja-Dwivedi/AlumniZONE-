fetch('../component/header.html')
    .then(res => res.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;

        // Re-attach menu toggles and nav logic after loading header
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.getElementById('nav-links');
        if (mobileMenu && navLinks) {
            mobileMenu.addEventListener('click', () => {
                navLinks.classList.toggle('show');
            });
        }

        // Attach profile redirection
        const profileLink = document.getElementById('profileLink');
        if (profileLink) {
            profileLink.addEventListener('click', function (e) {
                e.preventDefault();
                redirectToRoleDashboard(localStorage.getItem('userRole'));
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutLink');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }

        updateNavbar();
        loadUniversityData();
    });