/**
 * ============================================================================
 * Tabla de Contenidos Desplegable (Accordion TOC)
 * Comprime por defecto los subniveles (H3, H4...) manteniendo visible
 * únicamente el primer nivel en la barra derecha, con despliegue interactivo.
 * ============================================================================
 */
(function () {
  'use strict';

  const CHEVRON_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>';

  /**
   * Crea el botón accesible con flecha para alternar un ítem del TOC.
   */
  function createToggleButton(labelText) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'toc-toggle';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', `Desplegar subsecciones de ${labelText}`);
    button.title = 'Desplegar / Contraer subniveles';
    button.innerHTML = CHEVRON_SVG;
    return button;
  }

  /**
   * Actualiza el estado expandido/comprimido de un ítem del TOC.
   */
  function setExpandedState(listItem, button, expanded) {
    listItem.classList.toggle('toc-expanded', expanded);
    if (button) {
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
  }

  /**
   * Expande toda la cadena de ítems padre de un enlace específico (ej: hash URL).
   */
  function expandAncestors(tocNav, targetLink) {
    let currentItem = targetLink.closest('li.md-nav__item');
    while (currentItem && tocNav.contains(currentItem)) {
      if (currentItem.classList.contains('toc-has-children')) {
        const btn = currentItem.querySelector(':scope > .toc-item-row > .toc-toggle');
        setExpandedState(currentItem, btn, true);
      }
      currentItem = currentItem.parentElement
        ? currentItem.parentElement.closest('li.md-nav__item')
        : null;
    }
  }

  /**
   * Añade el control global "Expandir / Comprimir" en el título del TOC.
   */
  function attachGlobalToggle(tocNav) {
    const titleLabel = tocNav.querySelector('.md-nav__title[for="__toc"]');
    if (!titleLabel || titleLabel.querySelector('.toc-global-toggle')) {
      return;
    }

    const collapsibleItems = tocNav.querySelectorAll('li.toc-has-children');
    if (collapsibleItems.length === 0) {
      return;
    }

    const globalBtn = document.createElement('button');
    globalBtn.type = 'button';
    globalBtn.className = 'toc-global-toggle';
    globalBtn.textContent = 'Expandir';
    globalBtn.title = 'Expandir o comprimir todos los subniveles';

    globalBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const currentlyAllExpanded = globalBtn.dataset.allExpanded === 'true';
      const nextState = !currentlyAllExpanded;

      tocNav.querySelectorAll('li.toc-has-children').forEach((item) => {
        const btn = item.querySelector(':scope > .toc-item-row > .toc-toggle');
        setExpandedState(item, btn, nextState);
      });

      globalBtn.dataset.allExpanded = nextState ? 'true' : 'false';
      globalBtn.textContent = nextState ? 'Comprimir' : 'Expandir';
    });

    titleLabel.appendChild(globalBtn);
  }

  /**
   * Convierte un ítem con hijos del TOC en un nodo desplegable.
   */
  function enhanceTocItem(listItem) {
    if (listItem.classList.contains('toc-has-children')) {
      return;
    }

    const directLink = listItem.querySelector(':scope > a.md-nav__link');
    const nestedNav = listItem.querySelector(':scope > nav.md-nav');
    if (!directLink || !nestedNav) {
      return;
    }

    listItem.classList.add('toc-has-children');

    const row = document.createElement('div');
    row.className = 'toc-item-row';

    const labelText = (directLink.textContent || '').trim();
    const toggleBtn = createToggleButton(labelText);

    listItem.insertBefore(row, directLink);
    row.appendChild(directLink);
    row.appendChild(toggleBtn);

    // Clic en la flecha: alternar subniveles sin cambiar el scroll
    toggleBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isExpanded = listItem.classList.contains('toc-expanded');
      setExpandedState(listItem, toggleBtn, !isExpanded);
    });

    // Clic en el título de sección: navegar y mostrar sus subniveles
    directLink.addEventListener('click', () => {
      setExpandedState(listItem, toggleBtn, true);
    });
  }

  /**
   * Inicializa el acordeón en todas las tablas de contenidos secundarias presentes.
   */
  function initCollapsibleToc() {
    const tocNavs = document.querySelectorAll('nav.md-nav--secondary');
    tocNavs.forEach((tocNav) => {
      if (tocNav.dataset.tocCollapsibleReady === 'true') {
        return;
      }

      const items = tocNav.querySelectorAll('li.md-nav__item');
      if (items.length === 0) {
        return;
      }

      tocNav.dataset.tocCollapsibleReady = 'true';
      tocNav.classList.add('toc-collapsible-enabled');

      items.forEach(enhanceTocItem);
      attachGlobalToggle(tocNav);

      if (window.location.hash) {
        const targetLink = Array.from(tocNav.querySelectorAll('a.md-nav__link')).find(
          (link) => link.getAttribute('href') === window.location.hash
        );
        if (targetLink) {
          expandAncestors(tocNav, targetLink);
        }
      }
    });
  }

  if (typeof window.document$ !== 'undefined' && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(() => {
      initCollapsibleToc();
    });
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCollapsibleToc);
  } else {
    initCollapsibleToc();
  }
})();
