const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/9MJ4ZVXQWJ';
// Ссылка на бота-тест (с меткой источника ?start=...). Пока пусто: кнопка ведёт к форме заявки.
const BOT_LINK = '';
const TG_LINK = 'https://t.me/artamonova_kristina58'; // резерв только для отправки заявки, если форма недоступна
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
      launch: ['Подготовим первый запуск', 'Посмотрим, что вы продаёте, кто ваши клиенты и куда вести людей из объявления. Предложим, с какого канала начать, что рекламировать в первую очередь и как считать заявки после запуска.', 'Настройка и ведение Яндекс Директа · от 25 000 ₽', 'Обсудить запуск', 'Яндекс Директ: настройка и ведение'],
      audit: ['Разберём, куда уходит рекламный бюджет', 'Если заявки редкие, дорогие или приходят от людей, которым не подходит ваше предложение, проверим кампании, Метрику и страницу, на которую ведёт реклама. После аудита у вас будет список правок в порядке приоритета. Его можно передать своему специалисту.', 'Аудит Директа · от 15 000 ₽', 'Обсудить аудит', 'Аудит Директа'],
      site: ['Сделаем сайт под вашу задачу', 'Если вы запускаете рекламу на одну услугу, сделаем страницу, где клиент сможет разобраться в предложении и оставить заявку. Если продаёте товары, соберём магазин с каталогом, карточками и оформлением заказа.', 'Разработка сайта · от 20 000 ₽', 'Обсудить сайт', 'Сайт или интернет-магазин'],
      seo: ['Продвинем сайт по запросам ваших клиентов', 'Проверим, по каким запросам покупатели ищут ваши товары и услуги. Доработаем тексты и страницы, чтобы сайт чаще находили в Яндексе и Google, а посетителям было проще оставить заявку. Подготовим контент для нейроответов.', 'SEO-продвижение · от 40 000 ₽', 'Обсудить SEO', 'SEO-продвижение'],
      plan: ['Разберёмся, что стоит делать в первую очередь', 'Маркетолог посмотрит, откуда к вам сейчас приходят клиенты, что вы уже пробовали и как ваше предложение выглядит рядом с конкурентами. По итогам можно составить план на ближайший месяц с конкретными задачами, бюджетом и показателями для проверки.', 'Услуги маркетолога · от 65 000 ₽', 'Обсудить план продвижения', 'Услуги маркетолога']
    };
    const box = $('#answer'), chips = $$('#chips .chip');
    chips.forEach(c => c.addEventListener('click', () => {
      chips.forEach(x => x.setAttribute('aria-pressed', x === c ? 'true' : 'false'));
      const [h, txt, svcLine, btn, svc] = data[c.dataset.k];
      box.textContent = '';
      const mk = (tag, cls, t) => { const e = document.createElement(tag); if (cls) e.className = cls; e.textContent = t; return e; };
      const a = mk('a', 'btn', btn); a.href = '#form'; a.dataset.svc = svc;
      a.addEventListener('click', e => {
        e.preventDefault();
        const s = $('#svc'); if (s) s.value = svc;
        scrollTo({ top: $('#form').getBoundingClientRect().top + scrollY - 56, behavior: reduce ? 'auto' : 'smooth' });
      });
      box.append(mk('h3', '', h), mk('p', '', txt), mk('div', 'svcline', svcLine), a);
      box.classList.remove('swap'); void box.offsetWidth; box.classList.add('swap');
    }));
  });

  // ===== bot button =====
  safe(() => {
    const b = $('#botBtn'); if (!b) return;
    if (BOT_LINK) { b.href = BOT_LINK; b.target = '_blank'; b.rel = 'noopener'; return; }
    b.addEventListener('click', e => { e.preventDefault(); const s = $('#svc'); if (s) s.value = 'Аудит Директа'; scrollTo({ top: $('#form').getBoundingClientRect().top + scrollY - 56, behavior: reduce ? 'auto' : 'smooth' }); });
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
