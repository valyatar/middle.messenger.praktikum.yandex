import './footer.pcss';

// временный компонент, чтобы вывести весь список доступных страниц
export default `<footer class="footer">
  <nav class="footer__nav" aria-label="Навигация по сайту">
    <ul class="footer__list">
      <li class="footer__item">
        {{> Link href="#" class="footer-link" data-page="authorization" text="Авторизация"}}
      </li>
      <li class="footer__item">
        {{> Link href="#" class="footer-link" data-page="registration" text="Регистрация"}}
      </li>
      <li class="footer__item">
        {{> Link href="#" class="footer-link" data-page="chatList" text="Список чатов"}}
      </li>
      <li class="footer__item">
        {{> Link href="#" class="footer-link" data-page="profileSettings" text="Настройки пользователя"}}
      </li>
      <li class="footer__item">
        {{> Link href="#" class="footer-link" data-page="error404" text="404"}}
      </li>
      <li class="footer__item">
        {{> Link href="#" class="footer-link" data-page="error500" text="500"}}
      </li>
    </ul>
  </nav>
</footer>`;
