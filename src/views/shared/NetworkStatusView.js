class NetworkStatusView extends BaseView {
  constructor() {
    super();
    this.element = document.createElement('div');
    this.element.className = 'network-status';
    this.element.setAttribute('aria-live', 'polite');
    document.body.appendChild(this.element);
    
    window.addEventListener('online', this.updateStatus.bind(this));
    window.addEventListener('offline', this.updateStatus.bind(this));
    this.updateStatus();
  }

  updateStatus() {
    if (navigator.onLine) {
      this.element.textContent = 'Anda kembali online';
      this.element.className = 'network-status online';
      setTimeout(() => this.element.textContent = '', 3000);
    } else {
      this.element.textContent = 'Anda sedang offline';
      this.element.className = 'network-status offline';
    }
  }
}