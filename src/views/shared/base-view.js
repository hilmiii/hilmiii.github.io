export class BaseView {
  constructor() {
    this.main = document.querySelector('main');
    this.main.style.viewTransitionName = 'content';
  }

  async showLoading() {
    if (!document.startViewTransition) {
      this.main.innerHTML = this.loadingTemplate();
      return;
    }

    const transition = document.startViewTransition(() => {
      this.main.innerHTML = this.loadingTemplate();
    });

    await transition.finished;
  }

  loadingTemplate() {
    return `
      <div class="loading" aria-live="polite">
        <div class="loading-spinner"></div>
        <p>Memuat...</p>
      </div>
    `;
  }

  async render(content) {
    if (!document.startViewTransition) {
      this.main.innerHTML = content;
      return;
    }

    const transition = document.startViewTransition(() => {
      this.main.innerHTML = content;
    });

    await transition.finished;
  }
}

