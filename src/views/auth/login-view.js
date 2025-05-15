import { BaseView } from '../shared/base-view.js';

export class LoginView extends BaseView {
  constructor() {
    super();
    this.submitButton = null;
  }

  setSubmitHandler(handler) {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = form.querySelector('#email').value;
      const password = form.querySelector('#password').value;

      try {
        await handler(email, password);
      } catch (error) {
        this.showError(error.message);
      }
    });
  }

  render() {
    this.main.innerHTML = `
      <section class="auth-container">
        <div class="auth-card">
          <h1 class="auth-title">Masuk ke SerlokTakParani</h1>
          <form id="loginForm" class="auth-form">
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

    this.submitButton = document.getElementById('submitButton');
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
          aria-describedby="emailHelp"
          autocomplete="username"
        >
        <small id="emailHelp" class="form-text">Gunakan email yang sudah terdaftar</small>
      </div>
    `;
  }

  getPasswordField() {
    return `
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          placeholder="Minimal 8 karakter" 
          minlength="8"
          required
          autocomplete="current-password"
        >
        <button type="button" id="togglePassword" class="password-toggle">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    `;
  }

  setSubmitHandler(handler) {
    const form = document.getElementById('loginForm');
    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');
    const togglePassword = form.querySelector('#togglePassword');

    togglePassword?.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.innerHTML = type === 'password' 
        ? '<i class="fas fa-eye"></i>' 
        : '<i class="fas fa-eye-slash"></i>';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!emailInput.value || !passwordInput.value) {
        this.showError('Harap isi semua field');
        return;
      }

      if (passwordInput.value.length < 8) {
        this.showError('Password harus minimal 8 karakter');
        return;
      }

      this.setLoadingState(true);
      
      try {
        await handler(emailInput.value, passwordInput.value);
      } catch (error) {
        this.setLoadingState(false);
        this.showError(error.message);
      }
    });
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
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.textContent = message;
    
    const authCard = document.querySelector('.auth-card');
    authCard.prepend(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 3000);
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = message;
    
    const authCard = document.querySelector('.auth-card');
    const existingError = authCard.querySelector('.alert-danger');
    
    if (existingError) {
      existingError.replaceWith(errorDiv);
    } else {
      const form = document.getElementById('loginForm');
      authCard.insertBefore(errorDiv, form);
    }
    
    setTimeout(() => errorDiv.remove(), 5000);
  }

  clearForm() {
    const form = document.getElementById('loginForm');
    if (form) form.reset();
  }

  focusEmailField() {
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.focus();
  }
}