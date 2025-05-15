import { BaseView } from '../shared/base-view.js';

export class RegisterView extends BaseView {
constructor() {
    super();
    console.log('RegisterView initialized');
    this.submitButton = null;
    this.passwordInput = null;
    this.confirmPasswordInput = null;
  }

   getNameField() {
    return `
      <div class="form-group">
        <label for="name">Nama Lengkap</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          placeholder="Nama kamu" 
          required
          minlength="3"
          autocomplete="name"
        >
      </div>
    `;
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
          autocomplete="email"
        >
        <small id="emailHelp" class="form-text">Email harus unik dan valid</small>
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
          aria-describedby="passwordHelp"
          autocomplete="new-password"
        >
        <small id="passwordHelp" class="form-text">Minimal 8 karakter</small>
        <button type="button" id="togglePassword" class="password-toggle">
          <i class="fas fa-eye"></i>
        </button>
        <div class="password-strength">
          <div class="strength-meter">
            <div class="strength-bar"></div>
          </div>
          <small class="strength-feedback"></small>
        </div>
      </div>
    `;
  }

  getConfirmPasswordField() {
    return `
      <div class="form-group">
        <label for="confirmPassword">Konfirmasi Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          name="confirmPassword" 
          placeholder="Ketik ulang password" 
          required
          autocomplete="new-password"
        >
        <button type="button" id="toggleConfirmPassword" class="password-toggle">
          <i class="fas fa-eye"></i>
        </button>
        <small id="confirmPasswordError" class="text-danger" style="display:none;">
          Password tidak cocok
        </small>
      </div>
    `;
  }

  render() {
    this.main.innerHTML = `
      <section class="auth-container">
        <div class="auth-card">
          <h1 class="auth-title">Daftar ke SerlokTakParani</h1>
          <form id="registerForm" class="auth-form">
            ${this.getNameField()}
            ${this.getEmailField()}
            ${this.getPasswordField()}
            ${this.getConfirmPasswordField()}
            <button type="submit" class="btn btn-primary btn-block" id="submitButton">
              Daftar
            </button>
            <div class="auth-footer">
              <p>Sudah punya akun? <a href="#/login" class="auth-link">Masuk disini</a></p>
            </div>
          </form>
        </div>
      </section>
    `;

    this.submitButton = document.getElementById('submitButton');
    this.passwordInput = document.getElementById('password');
    this.confirmPasswordInput = document.getElementById('confirmPassword');
  }

  setSubmitHandler(handler) {
    const form = document.getElementById('registerForm');
    if (!form) {
      console.error('Register form not found');
      return;
    }

    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const togglePassword = form.querySelector('#togglePassword');
    const toggleConfirmPassword = form.querySelector('#toggleConfirmPassword');

    if (!nameInput || !emailInput || !this.passwordInput || !this.confirmPasswordInput) {
      console.error('Required form fields not found');
      return;
    }

    if (togglePassword) {
      togglePassword.addEventListener('click', () => {
        const type = this.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        this.passwordInput.setAttribute('type', type);
        togglePassword.innerHTML = type === 'password' 
          ? '<i class="fas fa-eye"></i>' 
          : '<i class="fas fa-eye-slash"></i>';
      });
    }

    if (toggleConfirmPassword) {
      toggleConfirmPassword.addEventListener('click', () => {
        const type = this.confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        this.confirmPasswordInput.setAttribute('type', type);
        toggleConfirmPassword.innerHTML = type === 'password' 
          ? '<i class="fas fa-eye"></i>' 
          : '<i class="fas fa-eye-slash"></i>';
      });
    }

    this.passwordInput?.addEventListener('input', () => {
      this.updatePasswordStrength();
      this.validatePasswordMatch();
    });

    this.confirmPasswordInput?.addEventListener('input', () => {
      this.validatePasswordMatch();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = this.passwordInput.value;
      const confirmPassword = this.confirmPasswordInput.value;

      if (!name || !email || !password || !confirmPassword) {
        this.showError('Harap isi semua field');
        return;
      }

      if (name.length < 3) {
        this.showError('Nama harus minimal 3 karakter');
        return;
      }

      if (password.length < 8) {
        this.showError('Password harus minimal 8 karakter');
        return;
      }

      if (password !== confirmPassword) {
        this.showError('Password dan konfirmasi password tidak cocok');
        return;
      }

      this.setLoadingState(true);
      
      try {
        await handler(name, email, password);
      } catch (error) {
        this.setLoadingState(false);
        this.showError(error.message);
      }
    });
  }

  updatePasswordStrength() {
    const password = this.passwordInput.value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthFeedback = document.querySelector('.strength-feedback');

    if (!password) {
      strengthBar.style.width = '0%';
      strengthBar.style.backgroundColor = 'transparent';
      strengthFeedback.textContent = '';
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const width = (strength / 4) * 100;
    strengthBar.style.width = `${width}%`;

    let color, message;
    switch (strength) {
      case 0:
      case 1:
        color = '#dc3545'; 
        message = 'Lemah';
        break;
      case 2:
        color = '#fd7e14'; 
        message = 'Sedang';
        break;
      case 3:
        color = '#ffc107';
        message = 'Kuat';
        break;
      case 4:
        color = '#28a745'; 
        message = 'Sangat Kuat';
        break;
      default:
        color = '#dc3545';
        message = '';
    }

    strengthBar.style.backgroundColor = color;
    strengthFeedback.textContent = message;
    strengthFeedback.style.color = color;
  }

  validatePasswordMatch() {
    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;
    const errorElement = document.getElementById('confirmPasswordError');

    if (password && confirmPassword && password !== confirmPassword) {
      errorElement.style.display = 'block';
      this.confirmPasswordInput.classList.add('is-invalid');
    } else {
      errorElement.style.display = 'none';
      this.confirmPasswordInput.classList.remove('is-invalid');
    }
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
      this.submitButton.textContent = 'Daftar';
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
      const form = document.getElementById('registerForm');
      authCard.insertBefore(errorDiv, form);
    }
    
    setTimeout(() => errorDiv.remove(), 5000);
  }

  clearForm() {
    const form = document.getElementById('registerForm');
    if (form) form.reset();
    document.querySelector('.strength-bar').style.width = '0%';
    document.querySelector('.strength-feedback').textContent = '';
  }

  focusNameField() {
    const nameInput = document.getElementById('name');
    if (nameInput) nameInput.focus();
  }
}