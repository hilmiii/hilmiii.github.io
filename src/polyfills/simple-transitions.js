export function simpleTransition(callback) {
  const main = document.querySelector('main');
  main.style.opacity = '0';
  
  setTimeout(() => {
    callback();
    main.style.transition = 'opacity 0.3s ease';
    main.style.opacity = '1';
  }, 50);
}

BaseView.prototype.render = async function(content) {
  simpleTransition(() => {
    this.main.innerHTML = content;
  });
};