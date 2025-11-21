document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const signupForm = document.getElementById('signup-form');
    const paymentForm = document.getElementById('payment-form');
    const skipVerificationBtn = document.getElementById('skip-verification');
    const copyKeyBtn = document.getElementById('copy-key');
    const generatedKey = document.getElementById('generated-key');
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text span');
    const togglePassword = document.querySelector('.toggle-password');
    
    // State
    let currentStep = 1;
    let selectedPlan = 'premium';
    const userData = {};
    
    // Initialize the app
    initApp();
    
    function initApp() {
        // Initialize event listeners
        if (signupForm) signupForm.addEventListener('submit', handleSignup);
        if (paymentForm) paymentForm.addEventListener('submit', handlePayment);
        if (skipVerificationBtn) skipVerificationBtn.addEventListener('click', skipVerification);
        if (copyKeyBtn) copyKeyBtn.addEventListener('click', copyToClipboard);
        if (passwordInput) passwordInput.addEventListener('input', checkPasswordStrength);
        if (togglePassword) togglePassword.addEventListener('click', togglePasswordVisibility);
        
        // Initialize plan selection
        initPlanSelection();
        
        // Show first step
        showStep(1);
        
        // Initialize animations
        initAnimations();
    }
    
    // Form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    function validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }
    
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    // Password strength checker
    function checkPasswordStrength() {
        const password = passwordInput.value;
        let strength = 0;
        
        // Check password length
        if (password.length >= 8) strength += 1;
        
        // Check for uppercase letters
        if (/[A-Z]/.test(password)) strength += 1;
        
        // Check for numbers
        if (/\d/.test(password)) strength += 1;
        
        // Check for special characters
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Update UI
        updateStrengthMeter(strength);
    }
    
    function updateStrengthMeter(strength) {
        const strengthClasses = ['very-weak', 'weak', 'moderate', 'strong', 'very-strong'];
        const strengthTexts = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
        const strengthColors = ['#ff4757', '#ff6b81', '#ffa502', '#2ed573', '#1dd1a1'];
        
        // Ensure strength is within bounds
        strength = Math.min(Math.max(0, strength), 4);
        
        // Update the strength bar
        const percentage = (strength / 4) * 100;
        strengthBar.style.width = `${percentage}%`;
        strengthBar.style.backgroundColor = strengthColors[strength];
        
        // Update the text
        strengthText.textContent = strengthTexts[strength];
        strengthText.style.color = strengthColors[strength];
    }
    
    // Toggle password visibility
    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        const icon = togglePassword.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }
    
    // Handle form submissions
    function handleSignup(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Reset errors
        clearError('email-error');
        clearError('password-error');
        clearError('confirm-password-error');
        
        // Validate email
        if (!validateEmail(email)) {
            showError('email-error', 'Please enter a valid email address');
            return;
        }
        
        // Validate password
        if (!validatePassword(password)) {
            showError('password-error', 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
            return;
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            showError('confirm-password-error', 'Passwords do not match');
            return;
        }
        
        // Save user data
        userData.email = email;
        userData.password = password; // In a real app, you would hash this
        
        // Move to next step
        showStep(2);
    }
    
    function handlePayment(e) {
        e.preventDefault();
        
        // In a real app, you would process the payment here
        // For demo purposes, we'll just generate a key
        showStep(5);
        
        // Simulate key generation with progress
        let progress = 0;
        const progressBar = document.querySelector('.progress');
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => showStep(6), 500);
            }
            progressBar.style.width = `${progress}%`;
        }, 100);
        
        // Generate and display key
        const key = generateKey();
        generatedKey.textContent = key;
        userData.key = key;
    }
    
    function skipVerification() {
        // Skip to plan selection
        showStep(3);
    }
    
    // Generate a random key
    function generateKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let key = '';
        for (let i = 0; i < 16; i++) {
            if (i > 0 && i % 4 === 0) key += '-';
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key;
    }
    
    // Copy key to clipboard
    function copyToClipboard() {
        navigator.clipboard.writeText(generatedKey.textContent).then(() => {
            // Show success feedback
            showNotification('Key copied to clipboard!', 'success');
            
            // Change icon to checkmark temporarily
            const icon = copyKeyBtn.querySelector('i');
            const originalClass = icon.className;
            icon.className = 'fas fa-check';
            
            // Revert after 2 seconds
            setTimeout(() => {
                icon.className = originalClass;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy key: ', err);
            showNotification('Failed to copy key', 'error');
        });
    }
    
    // Plan selection
    function initPlanSelection() {
        const planOptions = document.querySelectorAll('.plan-option');
        
        planOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                planOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Update selected plan
                selectedPlan = option.getAttribute('data-plan');
                userData.plan = selectedPlan;
                
                // Show payment form if not free plan
                if (selectedPlan !== 'free') {
                    showStep(4);
                } else {
                    // For free plan, skip to key generation
                    handlePayment({ preventDefault: () => {} });
                }
            });
        });
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.querySelector('.notifications').appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Show/hide steps
    function showStep(stepNumber) {
        currentStep = stepNumber;
        
        // Hide all steps
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
            step.classList.add('hidden');
        });
        
        // Show current step
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.classList.remove('hidden');
            currentStepElement.classList.add('active');
            
            // Add animation
            currentStepElement.style.animation = 'fadeIn 0.5s ease-out';
            
            // Scroll to top of step
            currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Initialize animations
    function initAnimations() {
        // Add fade-in animation to elements with the 'fade-in' class
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }
});
