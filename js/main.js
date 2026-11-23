(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const year = $('#anio');
  if (year) year.textContent = new Date().getFullYear();

  // Menú móvil accesible.
  const burger = $('#burger'), menu = $('#menu');
  const closeMenu = () => {
    if (!menu || !burger) return;
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
  };
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    $$('a', menu).forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('click', e => {
      if (!menu.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  // Navegación activa según la sección visible.
  const links = $$('.menu a[href^="#"]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === `#${entry.target.id}`));
    }), { rootMargin: '-42% 0px -52% 0px' });
    $$('main section[id]').forEach(section => observer.observe(section));
  }

  // Progreso de lectura y botón volver arriba.
  const progress = $('#scroll-progress'), backTop = $('#back-top');
  let ticking = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${pct}%`;
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 500);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(updateScroll); ticking = true; }
  }, { passive: true });
  updateScroll();

  // Animaciones de aparición al desplazarse.
  const revealTargets = $$('.sec, .hero, .srv article, .esp-grid img, .grid figure, .quotes article');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealTargets.forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });
  }

  // Filtros y búsqueda combinados.
  const filterButtons = $$('.filters .chip'), figures = $$('#grid figure');
  const search = $('#buscar-proyecto'), count = $('#contador-proyectos');
  let activeFilter = 'todos';
  const filterProjects = () => {
    const query = (search?.value || '').trim().toLocaleLowerCase('es');
    let visible = 0;
    figures.forEach(fig => {
      const categoryMatch = activeFilter === 'todos' || fig.dataset.cat === activeFilter;
      const textMatch = !query || fig.textContent.toLocaleLowerCase('es').includes(query);
      const show = categoryMatch && textMatch;
      fig.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = `${visible} ${visible === 1 ? 'proyecto' : 'proyectos'}`;
  };
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-on', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    filterProjects();
  }));
  search?.addEventListener('input', filterProjects);
  filterProjects();

  // Galería ampliable.
  const lightbox = $('#lightbox'), lbimg = $('#lbimg'), lbcap = $('#lbcap');
  $$('.thumb').forEach(button => button.addEventListener('click', () => {
    const image = $('img', button);
    lbimg.src = button.dataset.full;
    lbimg.alt = image.alt;
    lbcap.textContent = $('strong', button.closest('figure'))?.textContent || image.alt;
    lightbox.showModal();
  }));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });

  // Fichas con tecnologías y enlaces configurables.
  const projectDialog = $('#project-dialog'), projectTitle = $('#project-title');
  const projectDescription = $('#project-description'), projectTech = $('#project-tech');
  const demoLink = $('#project-demo'), repoLink = $('#project-repo'), linkNote = $('#project-link-note');
  const projects = window.PORTFOLIO_PROJECTS || {};
  $$('.project-open').forEach(button => button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project || !projectDialog) return;
    projectTitle.textContent = project.title;
    projectDescription.textContent = project.description;
    projectTech.replaceChildren(...project.tech.map(tech => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = tech;
      return tag;
    }));
    const setLink = (element, url) => {
      if (url && /^https?:\/\//i.test(url)) {
        element.href = url;
        element.hidden = false;
      } else {
        element.removeAttribute('href');
        element.hidden = true;
      }
    };
    setLink(demoLink, project.demo);
    setLink(repoLink, project.repo);
    linkNote.textContent = project.demo || project.repo
      ? 'Los enlaces se abrirán en una pestaña nueva.'
      : 'Agrega las URLs reales de demostración y GitHub en js/projects.js para activar estos enlaces.';
    projectDialog.showModal();
  }));
  projectDialog?.addEventListener('click', e => { if (e.target === projectDialog) projectDialog.close(); });

  // Formulario con validación y envío al PHP ya existente.
  const form = $('#form'), status = $('#estado'), sendButton = $('#enviar');
  const setStatus = (message, type = '') => {
    if (!status) return;
    status.textContent = message;
    status.className = type;
  };
  if (form) {
    const fields = $$('input:not([name=sitio_web]), textarea', form);
    fields.forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('bad');
        field.removeAttribute('aria-invalid');
      });
      field.addEventListener('blur', () => {
        if (field.required && !field.checkValidity()) {
          field.classList.add('bad');
          field.setAttribute('aria-invalid', 'true');
        }
      });
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const invalid = fields.find(field => !field.checkValidity());
      fields.forEach(field => {
        const bad = !field.checkValidity();
        field.classList.toggle('bad', bad);
        if (bad) field.setAttribute('aria-invalid', 'true');
        else field.removeAttribute('aria-invalid');
      });
      if (invalid) {
        setStatus('Revisa los campos marcados antes de enviar.', 'err');
        invalid.focus();
        return;
      }
      sendButton.disabled = true;
      sendButton.textContent = 'Enviando…';
      setStatus('Estamos enviando tu mensaje…');
      try {
        const response = await fetch(form.action, {
          method: 'POST', body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.mensaje || 'No se pudo enviar');
        setStatus(data.mensaje || '¡Mensaje enviado correctamente!', 'ok');
        form.reset();
        fields.forEach(field => field.classList.remove('bad'));
      } catch (error) {
        setStatus('No se pudo enviar. Verifica que el sitio esté en un servidor con PHP o intenta nuevamente.', 'err');
      } finally {
        sendButton.disabled = false;
        sendButton.textContent = 'Enviar';
      }
    });
  }
})();
