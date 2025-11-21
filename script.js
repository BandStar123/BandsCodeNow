// Main Application Controller
class BandsCodeApp {
  constructor() {
    // Initialize the application
    this.init();
  }

  // Initialize the application
  async init() {
    // Initialize state
    this.state = {
      user: null,
      selectedPlan: null,
      key: null,
      keyExpiration: null,
      timers: new Map()
    };

    // Cache DOM elements
    this.cacheElements();
    
    // Bind event listeners
    this.bindEvents();
    
    // Show initial page
    this.navigateTo('welcome');
  }

  // Cache frequently used DOM elements
  cacheElements() {
    this.pages = {
      welcome: document.getElementById('welcome-page'),
      signup: document.getElementById('signup-page'),
      plan: document.getElementById('plan-page'),
      payment: document.getElementById('payment-page'),
      dashboard: document.getElementById('dashboard-page')
    };

    this.elements = {
      // Forms
      signupForm: document.getElementById('signup-form'),
      paymentForm: document.getElementById('payment-form'),
      
      // Buttons
      startBtn: document.getElementById('start-btn'),
      getFreeKeyBtn: document.getElementById('get-free-key'),
      getPremiumKeyBtn: document.getElementById('get-premium-key'),
      copyKeyBtn: document.getElementById('copy-key'),
      
      // Display elements
      keyDisplay: document.getElementById('key-display'),
      generatedKey: document.getElementById('generated-key'),
      timerElement: document.getElementById('timer'),
      notification: document.getElementById('notification')
    };
  }

  // Bind event listeners
  bindEvents() {
    const { startBtn, signupForm, paymentForm, getFreeKeyBtn, getPremiumKeyBtn, copyKeyBtn } = this.elements;
    
    // Navigation
    if (startBtn) startBtn.addEventListener('click', () => this.navigateTo('signup'));
    
    // Form submissions
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }
    
    if (paymentForm) {
      paymentForm.addEventListener('submit', (e) => this.handlePayment(e));
    }
    
    // Key actions
    if (getFreeKeyBtn) {
      getFreeKeyBtn.addEventListener('click', () => this.startKeyGeneration('free'));
    }
    
    if (getPremiumKeyBtn) {
      getPremiumKeyBtn.addEventListener('click', () => this.startKeyGeneration('premium'));
    }
    
    if (copyKeyBtn) {
      copyKeyBtn.addEventListener('click', () => this.copyKeyToClipboard());
    }
    
    // Plan selection
    document.querySelectorAll('.plan-card').forEach(card => {
      card.addEventListener('click', () => this.selectPlan(card));
    });
  }

  // Navigation
  navigateTo(pageName) {
    // Hide all pages
    Object.values(this.pages).forEach(page => {
      if (page) page.classList.remove('active');
    });
    
    // Show target page
    if (this.pages[pageName]) {
      this.pages[pageName].classList.add('active');
      window.scrollTo(0, 0);
    }
    
    // Additional page-specific logic
    this.onPageChange(pageName);
  }

  // Handle page-specific logic
  onPageChange(pageName) {
    switch (pageName) {
      case 'dashboard':
        this.updateDashboard();
        break;
      // Add other page-specific logic here
    }
  }

  // Form Handlers
  async handleSignup(e) {
    e.preventDefault();
    
    const email = document.getElementById('email')?.value?.trim();
    const password = document.getElementById('password')?.value;
    
    // Validate inputs
    if (!this.validateEmail(email)) {
      this.showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    if (!this.validatePassword(password)) {
      this.showNotification('Password must be at least 8 characters long', 'error');
      return;
    }
    
    // Save user data
    this.state.user = { email, password };
    
    // Show plan selection
    this.navigateTo('plan');
  }

  async handlePayment(e) {
    e.preventDefault();
    
    // Simulate payment processing
    this.showNotification('Processing payment...', 'info');
    
    try {
      // In a real app, you would process the payment here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.showNotification('Payment successful!', 'success');
      this.navigateTo('dashboard');
    } catch (error) {
      this.showNotification('Payment failed. Please try again.', 'error');
      console.error('Payment error:', error);
    }
  }

  // Plan Selection
  selectPlan(card) {
    // Update UI
    document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    
    // Update state
    this.state.selectedPlan = card.dataset.plan;
    
    // Navigate based on plan
    if (this.state.selectedPlan === 'free') {
      this.navigateTo('dashboard');
    } else {
      this.navigateTo('payment');
    }
  }

  // Key Generation
  async startKeyGeneration(keyType) {
    const { getFreeKeyBtn, getPremiumKeyBtn, keyDisplay, generatedKey } = this.elements;
    const buttons = [getFreeKeyBtn, getPremiumKeyBtn];
    
    // Disable buttons during generation
    buttons.forEach(btn => { if (btn) btn.disabled = true; });
    
    try {
      const waitTime = keyType === 'free' ? 20 : 25; // minutes
      const keyDuration = keyType === 'free' ? 10 * 3600 : 24 * 3600; // seconds
      
      this.showNotification(`Generating ${keyType} key. Please wait ${waitTime} minutes...`, 'info');
      
      // Simulate key generation delay
      await new Promise(resolve => setTimeout(resolve, waitTime * 60 * 1000));
      
      // Generate and store key
      const key = this.generateKey();
      this.state.key = key;
      this.state.keyExpiration = Date.now() + (keyDuration * 1000);
      
      // Update UI
      if (generatedKey) generatedKey.textContent = key;
      if (keyDisplay) keyDisplay.classList.remove('hidden');
      
      // Start countdown
      this.startCountdown(keyDuration);
      
      this.showNotification(`${keyType === 'free' ? 'Free' : 'Premium'} key generated!`, 'success');
    } catch (error) {
      console.error('Key generation error:', error);
      this.showNotification('Failed to generate key. Please try again.', 'error');
    } finally {
      // Re-enable buttons
      buttons.forEach(btn => { if (btn) btn.disabled = false; });
    }
  }

  // Countdown Timer
  startCountdown(duration) {
    const { timerElement, keyDisplay } = this.elements;
    if (!timerElement) return;
    
    // Clear any existing timer
    this.clearTimer('countdown');
    
    let remaining = duration;
    this.updateTimerDisplay(remaining);
    
    // Update timer every second
    const timerId = setInterval(() => {
      remaining--;
      this.updateTimerDisplay(remaining);
      
      if (remaining <= 0) {
        this.clearTimer('countdown');
        this.showNotification('Your key has expired!', 'warning');
        if (keyDisplay) keyDisplay.classList.add('hidden');
      }
    }, 1000);
    
    // Store timer reference
    this.state.timers.set('countdown', timerId);
  }

  updateTimerDisplay(seconds) {
    const { timerElement } = this.elements;
    if (!timerElement) return;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    timerElement.textContent = `Expires in: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Helper Methods
  generateKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length: 20 },
      (_, i) => (i > 0 && i % 4 === 0 ? '-' : '') + chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  async copyKeyToClipboard() {
    const { generatedKey } = this.elements;
    if (!generatedKey || !generatedKey.textContent) return;
    
    try {
      await navigator.clipboard.writeText(generatedKey.textContent);
      this.showNotification('Key copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy key:', err);
      this.showNotification('Failed to copy key', 'error');
    }
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validatePassword(password) {
    return password && password.length >= 8;
  }

  showNotification(message, type = 'info') {
    const { notification } = this.elements;
    if (!notification) return;
    
    notification.className = 'notification';
    notification.textContent = message;
    notification.classList.add(type, 'show');
    
    // Auto-hide after delay
    this.clearTimer('notification');
    const timerId = setTimeout(() => {
      notification.classList.remove('show');
    }, 5000);
    
    this.state.timers.set('notification', timerId);
  }

  clearTimer(timerName) {
    if (this.state.timers.has(timerName)) {
      clearTimeout(this.state.timers.get(timerName));
      this.state.timers.delete(timerName);
    }
  }

  // Cleanup
  destroy() {
    // Clear all timers
    this.state.timers.forEach(timer => clearTimeout(timer));
    this.state.timers.clear();
    
    // Remove event listeners
    // (In a real app, you'd want to properly clean up all event listeners)
  }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new BandsCodeApp();
});