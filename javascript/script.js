// API Configuration
    const API_BASE_URL = 'https://alumni-web-api.onrender.com/api/auth';
    
    // Check if user is already logged in
    document.addEventListener('DOMContentLoaded', function() {
      const authToken = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      
      if (authToken && userRole) {
        showDashboard(userRole);
      }
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    
    mobileMenu.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
    
    // Form Functions
    const overlay = document.getElementById('overlay');
    
    // Open Registration Form
    function openForm() {
      document.getElementById("registerForm").style.display = "block";
      overlay.style.display = "block";
      document.body.style.overflow = "hidden";
      resetRegistrationForm();
    }
    
    // Close Registration Form
    function closeForm() {
      document.getElementById("registerForm").style.display = "none";
      overlay.style.display = "none";
      document.body.style.overflow = "auto";
      resetRegistrationForm();
    }
    
    // Reset registration form to initial state
    function resetRegistrationForm() {
      document.getElementById("userType").value = "";
      document.getElementById("universityName").classList.add("hidden");
      document.getElementById("universityName").required = false;
      document.getElementById("registrationForm").reset();
      document.getElementById("registerMessage").classList.add("hidden");
      document.getElementById("otpVerificationSection").classList.add("hidden");
      document.getElementById("registerOtpInput").classList.add("hidden");
      document.getElementById("submitRegisterBtn").classList.remove("hidden");
      document.getElementById("verifyRegisterOtpBtn").classList.add("hidden");
    }
    
    // Show/Hide University Dropdown based on User Type
    function toggleUniversityDropdown() {
      var userType = document.getElementById("userType").value;
      var universityDropdown = document.getElementById("universityName");
    
      if (userType === "alumni") {
        universityDropdown.classList.remove("hidden");
        universityDropdown.required = true;
      } else {
        universityDropdown.classList.add("hidden");
        universityDropdown.required = false;
      }
    }
    
    // Handle Registration Form Submission
    async function submitRegistration() {
      const name = document.getElementById("registerName").value;
      const email = document.getElementById("registerEmail").value;
      const phone = document.getElementById("registerPhone").value;
      const role = document.getElementById("userType").value;
      const university = document.getElementById("universityName").value;
      
      const registerMessage = document.getElementById("registerMessage");
      registerMessage.classList.add("hidden");
      
      // Basic validation
      if (!name || !email || !role) {
        registerMessage.textContent = "Please fill all required fields";
        registerMessage.classList.remove("success");
        registerMessage.classList.add("error");
        registerMessage.classList.remove("hidden");
        return;
      }
      
      if (role === "alumni" && !university) {
        registerMessage.textContent = "Please select your university";
        registerMessage.classList.remove("success");
        registerMessage.classList.add("error");
        registerMessage.classList.remove("hidden");
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            role,
            university: role === 'alumni' ? university : undefined
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Show OTP verification section
          document.getElementById("otpVerificationSection").classList.remove("hidden");
          document.getElementById("registerOtpInput").classList.remove("hidden");
          document.getElementById("submitRegisterBtn").classList.add("hidden");
          document.getElementById("verifyRegisterOtpBtn").classList.remove("hidden");
          
          registerMessage.textContent = data.message || "OTP sent to your email!";
          registerMessage.classList.remove("error");
          registerMessage.classList.add("success");
          registerMessage.classList.remove("hidden");
        } else {
          registerMessage.textContent = data.message || "Registration failed!";
          registerMessage.classList.remove("success");
          registerMessage.classList.add("error");
          registerMessage.classList.remove("hidden");
        }
      } catch (error) {
        registerMessage.textContent = "Network error. Please try again.";
        registerMessage.classList.remove("success");
        registerMessage.classList.add("error");
        registerMessage.classList.remove("hidden");
        console.error("Registration error:", error);
      }
    }
    
    // Verify OTP for registration
    async function verifyRegistrationOTP() {
      const email = document.getElementById("registerEmail").value;
      const otp = document.getElementById("registerOtpInput").value;
      const registerMessage = document.getElementById("registerMessage");
      registerMessage.classList.add("hidden");
      
      if (!otp) {
        registerMessage.textContent = "Please enter the OTP";
        registerMessage.classList.remove("success");
        registerMessage.classList.add("error");
        registerMessage.classList.remove("hidden");
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, otp })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          registerMessage.textContent = data.message || "Registration successful!";
          registerMessage.classList.remove("error");
          registerMessage.classList.add("success");
          registerMessage.classList.remove("hidden");
          
          // Store the token and user role in localStorage
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', data.role);
          }
          
          // Show the appropriate dashboard
          showDashboard(data.role);
          
          // Close the form after a short delay
          setTimeout(() => {
            closeForm();
          }, 1500);
        } else {
          registerMessage.textContent = data.message || "Invalid OTP!";
          registerMessage.classList.remove("success");
          registerMessage.classList.add("error");
          registerMessage.classList.remove("hidden");
        }
      } catch (error) {
        registerMessage.textContent = "Network error. Please try again.";
        registerMessage.classList.remove("success");
        registerMessage.classList.add("error");
        registerMessage.classList.remove("hidden");
        console.error("OTP verification error:", error);
      }
    }
    
    // Login form functions
    function openLoginForm() {
      document.getElementById("loginForm").style.display = "block";
      overlay.style.display = "block";
      document.body.style.overflow = "hidden";
      resetLoginForm();
    }
    
    function closeLoginForm() {
      document.getElementById("loginForm").style.display = "none";
      overlay.style.display = "none";
      document.body.style.overflow = "auto";
      resetLoginForm();
    }
    
    function resetLoginForm() {
      document.getElementById("otpInput").classList.add("hidden");
      document.getElementById("verifyOtpBtn").classList.add("hidden");
      document.getElementById("otpLoginForm").reset();
      document.getElementById("loginMessage").classList.add("hidden");
    }
    
    // Send OTP for login
    async function sendLoginOTP() {
      const email = document.getElementById("loginEmail").value;
      const loginMessage = document.getElementById("loginMessage");
      loginMessage.classList.add("hidden");
      
      if (!email) {
        loginMessage.textContent = "Please enter your email";
        loginMessage.classList.remove("success");
        loginMessage.classList.add("error");
        loginMessage.classList.remove("hidden");
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          loginMessage.textContent = data.message || "OTP sent to your email!";
          loginMessage.classList.remove("error");
          loginMessage.classList.add("success");
          loginMessage.classList.remove("hidden");
          
          document.getElementById("otpInput").classList.remove("hidden");
          document.getElementById("verifyOtpBtn").classList.remove("hidden");
        } else {
          loginMessage.textContent = data.message || "Login failed!";
          loginMessage.classList.remove("success");
          loginMessage.classList.add("error");
          loginMessage.classList.remove("hidden");
        }
      } catch (error) {
        loginMessage.textContent = "Network error. Please try again.";
        loginMessage.classList.remove("success");
        loginMessage.classList.add("error");
        loginMessage.classList.remove("hidden");
        console.error("Login error:", error);
      }
    }
    
    // Verify OTP for login
    async function verifyLoginOTP() {
      const email = document.getElementById("loginEmail").value;
      const otp = document.getElementById("otpInput").value;
      const loginMessage = document.getElementById("loginMessage");
      loginMessage.classList.add("hidden");
      
      if (!otp) {
        loginMessage.textContent = "Please enter the OTP";
        loginMessage.classList.remove("success");
        loginMessage.classList.add("error");
        loginMessage.classList.remove("hidden");
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, otp })
        });
        
        const data = await response.json();
        
        console.log(data)
        if (response.ok) {
          loginMessage.textContent = data.message || "Login successful!";
          loginMessage.classList.remove("error");
          loginMessage.classList.add("success");
          loginMessage.classList.remove("hidden");
          
          // Store the token and user role in localStorage
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', data.role);
          }
          
          // Show the appropriate dashboard
          showDashboard(data.role);
          
          // Close the form after a short delay
          setTimeout(() => {
            closeLoginForm();
            switch(data.role.toLowerCase()) {
              case 'university':
                window.location.href = 'university-dashboard.html';
                break;
              case 'alumni':
                window.location.href = 'alumni-dashboard.html';
                break;
              case 'recruiter':
                window.location.href = 'recruiter-dashboard.html';
                break;
              default:
                showDashboard(data.role);
            }
          }, 1500);
        } else {
          loginMessage.textContent = data.message || "Invalid OTP!";
          loginMessage.classList.remove("success");
          loginMessage.classList.add("error");
          loginMessage.classList.remove("hidden");
        }
      } catch (error) {
        loginMessage.textContent = "Network error. Please try again.";
        loginMessage.classList.remove("success");
        loginMessage.classList.add("error");
        loginMessage.classList.remove("hidden");
        console.error("OTP verification error:", error);
      }
    }
    
    // Show the appropriate dashboard based on user role
    function showDashboard(role) {
      // Hide main content and all dashboards
      document.getElementById('mainContent').style.display = 'none';
      document.getElementById('alumniDashboard').style.display = 'none';
      document.getElementById('recruiterDashboard').style.display = 'none';
      document.getElementById('universityDashboard').style.display = 'none';
      
      // Show the appropriate dashboard
      switch(role.toLowerCase()) {
        case 'alumni':
          document.getElementById('alumniDashboard').style.display = 'block';
          loadAlumniData();
          break;
        case 'recruiter':
          document.getElementById('recruiterDashboard').style.display = 'block';
          loadRecruiterData();
          break;
        case 'university':
          document.getElementById('universityDashboard').style.display = 'block';
          loadUniversityData();
          break;
        default:
          // If role is not recognized, show main content
          document.getElementById('mainContent').style.display = 'block';
      }
    }
    
    // Load alumni data
    async function loadAlumniData() {
      try {
        const response = await fetch('https://alumni-web-api.onrender.com/api/alumni/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          document.getElementById('alumniProfile').innerHTML = `
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>University:</strong> ${data.university}</p>
            <p><strong>Graduation Year:</strong> ${data.graduationYear}</p>
          `;
        }
      } catch (error) {
        console.error('Error loading alumni data:', error);
      }
    }
    
    // Load recruiter data
    async function loadRecruiterData() {
      try {
        const response = await fetch('https://alumni-web-api.onrender.com/api/recruiter/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Display recruiter data as needed
        }
      } catch (error) {
        console.error('Error loading recruiter data:', error);
      }
    }
    
    // Load university data
    async function loadUniversityData() {
      try {
        const response = await fetch('https://alumni-web-api.onrender.com/api/university/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          document.getElementById('universityProfile').innerHTML = `
            <p><strong>University Name:</strong> ${data.name}</p>
            <p><strong>Total Alumni:</strong> ${data.alumniCount}</p>
          `;
        }
      } catch (error) {
        console.error('Error loading university data:', error);
      }
    }
    
    // Logout function
    function logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      
      // Hide all dashboards and show main content
      document.getElementById('alumniDashboard').style.display = 'none';
      document.getElementById('recruiterDashboard').style.display = 'none';
      document.getElementById('universityDashboard').style.display = 'none';
      document.getElementById('mainContent').style.display = 'block';
    }
    
    // Close forms when clicking on overlay
    overlay.addEventListener('click', () => {
      closeForm();
      closeLoginForm();
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      });
    });