// Enhanced Project Registration Portal JavaScript

class ProjectRegistrationPortal {
    constructor() {
        this.registeredProjects = JSON.parse(localStorage.getItem('registeredProjects')) || [];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupTheme();
            this.setupProgressBar();
            this.setupFormValidation();
            this.setupAnimations();
            this.setupEventListeners();
            this.updateStats();
            this.createFloatingElements();
        });
    }

    // Theme Management
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return; // Check if the element exists

        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const icon = themeToggle.querySelector('i');
        
        icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        
        themeToggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            localStorage.setItem('theme', this.currentTheme);
            icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        });
    }

    // Progress Bar
    setupProgressBar() {
        const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
        const progressBar = document.getElementById('progressBar');
        
        const updateProgress = () => {
            const filledInputs = Array.from(inputs).filter(input => {
                if (input.type === 'checkbox') return input.checked;
                return input.value.trim() !== '';
            });
            
            const progress = (filledInputs.length / inputs.length) * 100;
            progressBar.style.width = `${progress}%`;
        };
        
        inputs.forEach(input => {
            input.addEventListener('input', updateProgress);
            input.addEventListener('change', updateProgress);
        });
    }

    // Form Validation
    setupFormValidation() {
        const form = document.getElementById('registrationForm');
        if (!form) return; // Check if the form exists

        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
        
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateField(field) {
        const errorDiv = document.getElementById(`${field.id}Error`);
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = `Please enter your ${field.name}`;
        }

        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (field.type === 'url' && field.value) {
            try {
                new URL(field.value);
            } catch {
                isValid = false;
                errorMessage = 'Please enter a valid URL';
            }
        }

        if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
            isValid = false;
            errorMessage = 'Please accept the terms and conditions';
        }

        if (errorDiv) {
            if (!isValid) {
                errorDiv.textContent = errorMessage;
                errorDiv.style.display = 'block';
                field.classList.add('error');
            } else {
                errorDiv.style.display = 'none';
                field.classList.remove('error');
            }
        }

        return isValid;
    }

    clearError(field) {
        const errorDiv = document.getElementById(`${field.id}Error`);
        if (errorDiv) {
            errorDiv.style.display = 'none';
            field.classList.remove('error');
        }
    }

    // Form Submission
    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const loadingText = submitBtn.querySelector('.loading-text');
        const loadingSpinner = submitBtn.querySelector('.loading-spinner');
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.shakeForm(form);
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        loadingText.style.display = 'inline';
        loadingSpinner.style.display = 'inline-block';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Collect form data
        const formData = new FormData(form);
        const projectData = Object.fromEntries(formData);
        projectData.timestamp = new Date().toISOString();
        projectData.id = Date.now().toString();
        
        // Save to localStorage
        this.registeredProjects.push(projectData);
        localStorage.setItem('registeredProjects', JSON.stringify(this.registeredProjects));
        
        // Show success
        this.showSuccessMessage();
        this.updateStats();
        
        // Reset form
        form.reset();
        document.getElementById('progressBar').style.width = '0%';
        
        // Hide loading state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        loadingText.style.display = 'none';
        loadingSpinner.style.display = 'none';
    }

    // Success Message with Animation
    showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        const form = document.getElementById('registrationForm');
        
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Add confetti effect
        this.createConfetti();
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
            form.style.display = 'block';
        }, 5000);
    }

    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                opacity: 1;
                transform: rotate(${Math.random() * 360}deg);
                animation: confetti-fall 3s ease-out forwards;
                z-index: 1000;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    // Stats Management
    updateStats() {
        const totalProjects = this.registeredProjects.length;
        const totalStudents = totalProjects; // Simplified for demo
        
        document.getElementById('totalProjects').textContent = totalProjects;
        document.getElementById('totalStudents').textContent = totalStudents;
    }

    // Animations
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.form-section, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Floating Elements
    createFloatingElements() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
        
        for (let i = 0; i < 5; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.cssText = `
                position: fixed;
                width: ${Math.random() * 100 + 50}px;
                height: ${Math.random() * 100 + 50}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                opacity: 0.1;
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float-${i} ${Math.random() * 10 + 10}s ease-in-out infinite;
                z-index: -1;
            `;
            
            document.body.appendChild(element);
        }
        
        // Add CSS for floating animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .animate-in {
                animation: fadeInUp 0.6s ease-out;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    shakeForm(form) {
        form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }

    // Event Listeners
    setupEventListeners() {
        // Character counter for textarea
        const textarea = document.getElementById('projectDescription');
        const charCount = document.getElementById('charCount');
        
        if (textarea && charCount) {
            textarea.addEventListener('input', (e) => {
                const length = e.target.value.length;
                charCount.textContent = length;
                
                if (length > 450) {
                    charCount.style.color = 'var(--error-color)';
                } else {
                    charCount.style.color = 'var(--text-muted)';
                }
            });
        }
        
        // Date picker restrictions
        const dateInput = document.getElementById('presentationDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }
}

// Dashboard functionality
function showProjectDashboard() {
    const modal = document.getElementById('projectModal');
    const projectDetails = document.getElementById('projectDetails');
    
    // Get latest project
    const projects = JSON.parse(localStorage.getItem('registeredProjects')) || [];
    const latestProject = projects[projects.length - 1];
    
    if (latestProject) {
        projectDetails.innerHTML = `
            <div class="project-card">
                <h3>${latestProject.projectTitle}</h3>
                <p><strong>Name:</strong> ${latestProject.name}</p>
                <p><strong>Email:</strong> ${latestProject.email}</p>
                <p><strong>Department:</strong> ${latestProject.department}</p>
                <p><strong>Type:</strong> ${latestProject.projectType}</p>
                <p><strong>Registered:</strong> ${new Date(latestProject.timestamp).toLocaleDateString()}</p>
            </div>
        `;
    }
    
    modal.style.display = 'block';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ProjectRegistrationPortal();
    
    // Modal close functionality
    const modal = document.getElementById('projectModal');
    const closeBtn = modal.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Export for global access
window.ProjectRegistrationPortal = ProjectRegistrationPortal;
