const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/9MJ4ZVXQWJ';
const TG_LINK = 'https://t.me/artamonova_kristina58'; // заглушка: бот-тест переносится на аккаунт клиента, пока ведём в личный Telegram
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const safe = fn => { try { fn(); } catch (e) { console.error(e); } };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // entrance + sticky bar
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('ready')));
  setTimeout(() => root.classList.add('ready'), 1200);
  safe(() => {
    const bar = $('#bar');
    const f = () => bar.classList.toggle('show', scrollY > 30);
    addEventListener('scroll', f, { passive: true }); f();
  });

  // smooth anchors
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const h = a.getAttribute('href'); if (h.length < 2) return;
    const t = $(h); if (!t) return;
    e.preventDefault();
    scrollTo({ top: t.getBoundingClientRect().top + scrollY - 56, behavior: reduce ? 'auto' : 'smooth' });
  }));

  // ===== scroll scene: Flomik edits the campaign =====
  safe(() => {
    const scene = $('#scene'); if (!scene) return;
    const junk = $$('.q__t.is-junk', scene), good = $$('.q__t.is-good', scene);
    const leads = $$('.lead', scene), steps = $$('#steps li'), imgs = $$('#shot img'), cnt = $('#junkN');
    let lastStep = -1;
    const apply = p => {
      let done = 0;
      junk.forEach((el, i) => {
        const s = clamp((p - (0.05 + i * 0.09)) / 0.08);
        el.style.setProperty('--s', s); el.classList.toggle('done', s >= 1); if (s >= 1) done++;
      });
      good.forEach((el, i) => el.style.setProperty('--a', (clamp((p - (0.45 + i * 0.07)) / 0.09) * 360) + 'deg'));
      cnt.textContent = junk.length - done;
      leads.forEach((el, i) => el.classList.toggle('on', p > 0.8 + i * 0.06));
      const st = p < 0.43 ? 0 : p < 0.76 ? 1 : p < 0.88 ? 2 : 3;
      if (st !== lastStep) {
        lastStep = st;
        steps.forEach((l, i) => l.classList.toggle('on', i === st));
        imgs.forEach((im, i) => im.classList.toggle('on', i === st));
      }
    };
    if (reduce) { root.classList.add('static'); scene.classList.add('static'); apply(1); steps.forEach(l => l.classList.add('on')); return; }
    let tick = false;
    const upd = () => {
      tick = false;
      const r = scene.getBoundingClientRect();
      apply(clamp(-r.top / Math.max(1, r.height - innerHeight)));
    };
    const on = () => { if (!tick) { tick = true; requestAnimationFrame(upd); } };
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); upd();
  });

  // hero photo parallax + collage drift
  safe(() => {
    if (reduce) return;
    const fr = $('#heroFrame');
    if (fr && matchMedia('(pointer:fine)').matches) {
      addEventListener('pointermove', e => {
        const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
        fr.style.transform = `rotate(${1.6 + x * 2}deg) translate3d(${x * -14}px,${y * -10}px,0)`;
      }, { passive: true });
    }
    const figs = $$('#collage figure'), sp = [0.05, -0.04, 0.07, -0.03, 0.05];
    let t = false;
    const f = () => {
      t = false;
      figs.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > innerHeight + 100) return;
        el.style.transform = `translate3d(0,${(r.top + r.height / 2 - innerHeight / 2) * sp[i % sp.length]}px,0)`;
      });
    };
    addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(f); } }, { passive: true }); f();
  });

  // ===== picker =====
  safe(() => {
    const data = {
      none: ['Нет заявок', 'Начните с аудита Директа', 'от 15 000 ₽', 'Если реклама уже идёт, но заявок нет, сначала разберём кампании и Метрику: часто причина в запросах, целях или странице. Если рекламы ещё нет, запустим Директ от 25 000 ₽.', 'Аудит Директа'],
      dear: ['Дорогие заявки', 'Аудит, потом ведение', 'от 15 000 ₽', 'Дорогая заявка обычно значит, что часть бюджета уходит на лишние запросы и показы. Аудит покажет где, а ведение от 25 000 ₽ закрепит правки.', 'Аудит Директа'],
      site: ['Нужен сайт', 'Сайт или интернет-магазин', 'от 20 000 ₽', 'Соберём страницу или магазин, который ведёт к заявке. Если планируется реклама, сразу заложим цели в Метрике.', 'Сайт или интернет-магазин'],
      promo: ['Нужно продвижение', 'Директ для быстрого старта', 'от 25 000 ₽', 'Реклама в Директе даёт обращения быстрее. SEO работает дольше, от 40 000 ₽ без верстки и бюджета на ссылки. Выберем связку под вашу нишу.', 'Яндекс Директ: настройка и ведение'],
      plan: ['Нужна стратегия', 'Маркетолог', 'от 65 000 ₽', 'Консультация, маркетинговый план на месяц, стратегия бизнеса или запуск бренда под ключ. Подходит, когда непонятно, куда вкладывать бюджет.', 'Услуги маркетолога']
    };
    const box = $('#answer'), chips = $$('#chips .chip');
    chips.forEach(c => c.addEventListener('click', () => {
      chips.forEach(x => x.setAttribute('aria-pressed', x === c ? 'true' : 'false'));
      const [, h, price, txt, svc] = data[c.dataset.k];
      box.textContent = '';
      const mk = (tag, cls, t) => { const e = document.createElement(tag); if (cls) e.className = cls; e.textContent = t; return e; };
      const a = mk('a', 'btn', 'Обсудить это'); a.href = '#form'; a.dataset.svc = svc;
      a.addEventListener('click', () => { const s = $('#svc'); if (s) s.value = svc; });
      box.append(mk('span', 'hand', 'Фломик советует: ' + price), mk('h3', '', h), mk('p', '', txt), a);
      box.classList.remove('swap'); void box.offsetWidth; box.classList.add('swap');
      a.addEventListener('click', e => { e.preventDefault(); scrollTo({ top: $('#form').getBoundingClientRect().top + scrollY - 56, behavior: reduce ? 'auto' : 'smooth' }); });
    }));
  });

  // ===== quiz =====
  safe(() => {
    const Q = [
      ['Реклама ведёт на главную страницу сайта, а не на страницу под конкретный запрос', 'объявления ведут на главную, а не на страницу под запрос'],
      ['Минус-слов нет или их не обновляли больше месяца', 'нет свежих минус-слов, и показы идут по лишним запросам'],
      ['В Метрике не настроены цели, и непонятно, какое объявление принесло заявку', 'нет целей в Метрике, поэтому нельзя понять, что работает'],
      ['Поиск и рекламная сеть сидят в одной кампании с общим бюджетом', 'поиск и сети смешаны, бюджет делится вслепую'],
      ['Вы платите за клики, но не смотрите, по каким именно запросам показывается реклама', 'не просматриваются поисковые запросы, по которым идут показы'],
      ['Автоматические ставки включили сразу, без целей и накопленных данных', 'автоматика включена без целей и данных, учится на вашем бюджете']
    ];
    const qq = $('#qq'), qa = $('#qa'), dots = $('#dots'), quiz = $('#quiz');
    let i = 0, traps = [];
    const mk = (tag, cls, t) => { const e = document.createElement(tag); if (cls) e.className = cls; if (t) e.textContent = t; return e; };
    const reset = () => { i = 0; traps = []; dots.textContent = ''; Q.forEach(() => dots.append(mk('i'))); quiz.classList.remove('res'); dots.style.display = ''; show(); };
    const show = () => {
      $$('i', dots).forEach((d, k) => d.classList.toggle('on', k <= i));
      qq.textContent = (i + 1) + ' из ' + Q.length + '. Бывает так: ' + Q[i][0].charAt(0).toLowerCase() + Q[i][0].slice(1) + '?';
      qa.textContent = '';
      [['Да', 1], ['Нет', 0], ['Не знаю', 1]].forEach(([t, bad]) => {
        const b = mk('button', '', t); b.type = 'button';
        b.addEventListener('click', () => { if (bad) traps.push(Q[i][1]); i++; i < Q.length ? show() : finish(); });
        qa.append(b);
      });
    };
    const finish = () => {
      const n = traps.length;
      dots.style.display = 'none'; quiz.classList.add('res');
      const title = n <= 1 ? 'Почти чисто' : n <= 3 ? 'Есть что вычёркивать' : 'Фломику понадобится второй маркер';
      qq.textContent = ''; qq.style.minHeight = '0'; qa.textContent = '';
      const wrap = mk('div', 'res');
      wrap.append(mk('span', 'hand', 'Ловушек отмечено: ' + n + ' из ' + Q.length), mk('h3', '', title));
      if (n) { const ul = mk('ul'); traps.forEach(t => { const li = mk('li'); li.append(mk('s', '', t)); ul.append(li); }); wrap.append(ul); }
      else wrap.append(mk('p', '', 'Основные ловушки обойдены. Аудит всё равно может найти тонкие места, но срочных дыр не видно.'));
      const cta = mk('div', 'res__cta');
      const g = mk('a', 'btn', 'Получить гайд в Telegram'); g.href = TG_LINK + '?text=' + encodeURIComponent('Здравствуйте! Прошёл тест про ловушки рекламы в Директе (' + n + ' из ' + Q.length + '). Хочу гайд.'); g.target = '_blank'; g.rel = 'noopener';
      const a = mk('a', 'btn btn--ghost', 'Разобрать мой кабинет'); a.href = '#form';
      a.addEventListener('click', e => { e.preventDefault(); const s = $('#svc'); if (s) s.value = 'Аудит Директа'; scrollTo({ top: $('#form').getBoundingClientRect().top + scrollY - 56, behavior: reduce ? 'auto' : 'smooth' }); });
      const again = mk('button', 'btn btn--ghost', 'Пройти заново'); again.type = 'button'; again.addEventListener('click', () => { qq.style.minHeight = ''; wrap.remove(); reset(); });
      cta.append(g, a, again); wrap.append(cta); quiz.append(wrap);
    };
    reset();
  });

  // ===== form =====
  const form = $('#leadForm');
  form && form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]'), orig = btn.textContent, msg = $('#msg');
    const payload = {}; new FormData(form).forEach((v, k) => { payload[k] = v; });
    if (payload._gotcha) return;
    msg.textContent = '';
    if (!payload.name.trim() || !payload.contact.trim()) { msg.textContent = 'Укажите имя и телефон или Telegram.'; return; }
    if (!form.consent.checked) { msg.textContent = 'Отметьте согласие на обработку персональных данных.'; return; }
    payload.phone = payload.contact;
    payload.comment = 'Услуга: ' + payload.service + (payload.comment ? '. ' + payload.comment : '');
    delete payload.consent;
    const tgText = 'Заявка с сайта. Имя: ' + payload.name + '. Контакт: ' + payload.contact + '. ' + payload.comment;
    const tgLink = TG_LINK + '?text=' + encodeURIComponent(tgText);
    btn.disabled = true; btn.textContent = 'Отправляем...';
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await fetch(LEAD_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctrl.signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      msg.textContent = 'Заявка отправлена. Скоро свяжемся.'; form.reset();
    } catch (err) {
      console.error(err);
      msg.textContent = 'Заявка не ушла автоматически. Отправьте её одним касанием в Telegram: ';
      const a = document.createElement('a'); a.href = tgLink; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'отправить в Telegram';
      msg.append(a, '. Текст уже готов, останется нажать «Отправить».');
    } finally {
      clearTimeout(timer); btn.disabled = false; btn.textContent = orig;
    }
  });
})();
