import './styles/main.pcss';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  void app.init()
    .then(() => app.render())
    .catch(console.error);
});
