/* Демо-макет Activat VC: панель изменений, переключатель пометок, показ событий аналитики. */
(function () {
  var CHANGES = window.DEMO_CHANGES || [
    ['1', 'Кнопка «Подать заявку на инвестиции» в шапке всех страниц, под ней — стадия и чек. При прокрутке шапка закрепляется, на телефоне кнопка — внизу экрана.', 'index.html'],
    ['2', 'Первый экран: «Инвестируем в IT-стартапы», кнопки «Подать заявку» и «Как это работает».', 'index.html'],
    ['3', 'Блок доверия сразу под первым экраном: цифры и логотипы компаний портфеля с работающими сайтами.', 'index.html#demo-trust'],
    ['4', '«Что получает стартап»: инвестиции, экспертиза, партнёрства — вместо прежнего абзаца про smart money.', 'index.html#demo-get'],
    ['5', '«Как это работает»: три шага, кому подходит, кнопка «Спросить ассистента» (открывает чат) и строка для ИИ-агентов. Отдельной страницы нет — подробности даёт ассистент.', 'index.html#how'],
    ['6', '«Истории основателей»: место под 2–3 цитаты из портфеля.', 'index.html#demo-stories'],
    ['7', 'Инвесторам и скаутам — компактно, двумя карточками.', 'index.html#demo-audiences'],
    ['8', '«Учимся и делимся опытом»: подкаст, два курса, календарь событий.', 'index.html#demo-media'],
    ['9', 'Резюме — форма вместо ссылки на почту: согласие на обработку данных, автоответ кандидату, карточка в воронке «Подбор» Bitrix24.', 'karera.html'],
    ['10', 'Невидимое посетителю: события аналитики на кнопках (в демо — всплывающая подсказка), файл llms.txt для ИИ-агентов, разметка Schema.org для поисковиков.', 'llms.txt']
  ];
  var NEEDS = window.DEMO_NEEDS || [
    'Цифры для блока доверия: сколько стран в портфеле и сколько инвесторов в клубе. На сайте «20+ стартапов», а в слайдере портфеля 30 компаний — какую цифру показываем?',
    'Тексты «Экспертизы» и «Партнёрств» в блоке «Что получает стартап» — собраны из формулировок сайта, подтвердите.',
    'Кому подходит: декларация исключает DeepTech и не упоминает Украину, Молдову, Россию и Беларусь; внутренние правила отличаются. Какую формулировку публикуем?',
    '2–3 цитаты основателей портфеля с именами и фото.',
    'Этапы отбора на странице «Стартаперам»: первые два устарели — сейчас это одна форма.',
    'Текст согласия на обработку персональных данных (черновик на странице резюме) — согласовать с юристом; там же вопрос о хранении данных в Bitrix24.',
    'Bitrix24: создать воронку «Подбор» с этапами со страницы резюме и дать CTO доступ к вебхуку.'
  ];


  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in (attrs || {})) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (store('demo-clean') === '1') document.body.classList.add('demo-clean');

    var list = CHANGES.map(function (c) {
      var link = c[2] ? ' <a href="' + c[2] + '">показать</a>' : '';
      return '<li value="' + c[0] + '">' + c[1] + link + '</li>';
    }).join('');
    var needs = NEEDS.map(function (n) { return '<li>' + n + '</li>'; }).join('');
    var panel = el('div', { 'class': 'demo-panel' });
    panel.innerHTML =
      '<div class="demo-panel_body" role="dialog" aria-label="Что изменено в демо">' +
      '<h3>Демо новой версии сайта</h3>' +
      '<p class="sub">' + (window.DEMO_INTRO || '') + 'Локальный макет для обсуждения. Синие номера на странице — изменения, жёлтые плашки — чего ещё не хватает. Остальные ссылки ведут на рабочий сайт activat.vc.</p>' +
      '<ol>' + list + '</ol>' +
      '<h4>Что нужно от вас</h4><ul>' + needs + '</ul>' +
      '<label><input type="checkbox" id="demo-clean-toggle"> Скрыть пометки (посмотреть «как у посетителя»)</label>' +
      '</div>' +
      '<button type="button" class="demo-panel_toggle" aria-expanded="false">Что изменено · ' + CHANGES.length + '</button>';
    document.body.appendChild(panel);

    var btn = panel.querySelector('.demo-panel_toggle');
    btn.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    var tog = panel.querySelector('#demo-clean-toggle');
    tog.checked = document.body.classList.contains('demo-clean');
    tog.addEventListener('change', function () {
      document.body.classList.toggle('demo-clean', tog.checked);
      store('demo-clean', tog.checked ? '1' : '0');
    });

    // События аналитики: в рабочей версии — gtag/ym; в демо — подсказка.
    var toast = el('div', { style: 'position:fixed;left:50%;top:96px;transform:translateX(-50%);z-index:2100;background:#001635;color:#fff;padding:10px 16px;border-radius:10px;font:500 14px Gilroy,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.25);display:none' });
    document.body.appendChild(toast);
    var timer;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-event]');
      if (!a) return;
      var name = a.getAttribute('data-event'), place = a.getAttribute('data-place') || '';
      if (window.console) console.log('[demo analytics]', name, place);
      if (document.body.classList.contains('demo-clean')) return;
      var href = a.getAttribute('href') || '';
      var external = /^https?:/.test(href);
      toast.textContent = 'Событие аналитики: ' + name + (place ? ' · ' + place : '') + (external ? ' → открываем форму' : '');
      toast.style.display = 'block';
      clearTimeout(timer);
      if (external) {
        e.preventDefault();
        timer = setTimeout(function () { toast.style.display = 'none'; window.open(href, '_blank', 'noopener'); }, 900);
      } else {
        timer = setTimeout(function () { toast.style.display = 'none'; }, 1800);
      }
    });

    // Форма резюме (только на karera.html)
    var form = document.getElementById('demo-resume-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        form.querySelectorAll('[required]').forEach(function (f) {
          var bad = f.type === 'checkbox' ? !f.checked : !f.value.trim();
          var err = form.querySelector('[data-err-for="' + f.name + '"]');
          if (err) err.style.display = bad ? 'block' : 'none';
          if (bad) ok = false;
        });
        var link = form.querySelector('[name=resume_link]'), file = form.querySelector('[name=resume_file]');
        var errR = form.querySelector('[data-err-for="resume"]');
        var noResume = !link.value.trim() && !(file.files && file.files.length);
        errR.style.display = noResume ? 'block' : 'none';
        if (noResume) ok = false;
        if (!ok) return;
        var name = form.querySelector('[name=name]').value.trim();
        var email = form.querySelector('[name=email]').value.trim();
        var dir = form.querySelector('[name=direction]');
        document.getElementById('demo-mail-to').textContent = email;
        document.getElementById('demo-mail-name').textContent = name;
        document.getElementById('demo-b24-name').textContent = name;
        document.getElementById('demo-b24-dir').textContent = dir.options[dir.selectedIndex].text;
        form.style.display = 'none';
        document.getElementById('demo-success').style.display = 'block';
        window.scrollTo({ top: document.getElementById('demo-success').offsetTop - 120, behavior: 'smooth' });
      });
    }
  });
})();
