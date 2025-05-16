import { BaseView } from '../shared/base-view.js';

export class LoginView extends BaseView {
  constructor() {
    super();
    this.submitButton = null;
    this.errorTimeout = null;
  }

  render() {
    this.main.innerHTML = `
      <section class="auth-container" aria-labelledby="loginTitle">
        <div class="auth-card">
          <h1 id="loginTitle" class="auth-title">Masuk ke SerlokTakParani</h1>
          <form id="loginForm" class="auth-form" aria-label="Formulir login">
            ${this.getEmailField()}
            ${this.getPasswordField()}
            <button type="submit" class="btn btn-primary btn-block" id="submitButton">
              Masuk
            </button>
            <div class="auth-footer">
              <p>Belum punya akun? <a href="#/register" class="auth-link">Daftar disini</a></p>
            </div>
          </form>
        </div>
      </section>
    `;

    this.initializeForm();
  }

  getEmailField() {
    return `
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="email@contoh.com" 
          required
          aria-required="true"
          aria-describedby="emailHelp"
          autocomplete="username"
          autocapitalize="off"
          spellcheck="false"
        >
        <small id="emailHelp" class="form-text">Gunakan email yang sudah terdaftar</small>
      </div>
    `;
  }

  getPasswordField() {
    return `
      <div class="form-group password-group">
        <label for="password">Password</label>
        <div class="password-input-container">
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Minimal 8 karakter" 
            minlength="8"
            required
            aria-required="true"
            autocomplete="current-password"
          >
          <button 
            type="button" 
            id="togglePassword" 
            class="password-toggle"
            aria-label="Toggle password visibility"
          >
            <i class="fas fa-eye" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `;
  }

  initializeForm() {
    this.submitButton = document.getElementById('submitButton');
    const form = document.getElementById('loginForm');
    const passwordInput = form.querySelector('#password');
    const togglePassword = form.querySelector('#togglePassword');

    togglePassword?.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassword.innerHTML = isPassword 
        ? '<i class="fas fa-eye-slash" aria-hidden="true"></i>' 
        : '<i class="fas fa-eye" aria-hidden="true"></i>';
      togglePassword.setAttribute('aria-label', 
        isPassword ? 'Sembunyikan password' : 'Tampilkan password');
    });

    form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    this.clearError();

    if (!email || !password) {
      this.showError('Harap isi semua field');
      return;
    }

    if (password.length < 8) {
      this.showError('Password harus minimal 8 karakter');
      return;
    }

    this.setLoadingState(true);

    try {
      await this.submitHandler(email, password);
      this.clearForm();
    } catch (error) {
      this.showError(error.message || 'Terjadi kesalahan saat login');
    } finally {
      this.setLoadingState(false);
    }
  }

  setSubmitHandler(handler) {
    this.submitHandler = async (email, password) => {
      try {
        await handler(email, password);
        this.showSuccess('Login berhasil!');
        location.reload();
      } catch (error) {
        throw error; 
      }
    };
  }

  setLoadingState(isLoading) {
    if (!this.submitButton) return;

    if (isLoading) {
      this.submitButton.disabled = true;
      this.submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Memproses...
      `;
    } else {
      this.submitButton.disabled = false;
      this.submitButton.textContent = 'Masuk';
    }
  }

  showSuccess(message) {
    this.clearError();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.setAttribute('role', 'alert');
    successDiv.innerHTML = `
      <span class="fas fa-check-circle" aria-hidden="true"></span>
      <span>${message}</span>
    `;
    
    const authCard = document.querySelector('.auth-card');
    authCard.prepend(successDiv);
    
    setTimeout(() => {
      successDiv.classList.add('fade-out');
      setTimeout(() => successDiv.remove(), 300);
    }, 3000);
  }

  showError(message) {
    this.clearError();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `
      <span class="fas fa-exclamation-circle" aria-hidden="true"></span>
      <span>${message}</span>
    `;
    
    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(errorDiv, form);
    
    this.errorTimeout = setTimeout(() => {
      errorDiv.classList.add('fade-out');
      setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
  }

  clearError() {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
      this.errorTimeout = null;
    }
    const existingError = document.querySelector('.alert-danger');
    if (existingError) existingError.remove();
  }

  clearForm() {
    const form = document.getElementById('loginForm');
    if (form) form.reset();
  }

  focusEmailField() {
    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.focus();
      emailInput.select();
    }
  }

  cleanup() {
    this.clearError();
    const form = document.getElementById('loginForm');
    if (form) {
      form.removeEventListener('submit', this.handleSubmit);
    }
  }
}