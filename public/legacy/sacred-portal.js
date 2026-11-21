export function createSacredPortal(stage, returnToYurt) {
  const display = document.createElement('div');
  const frame = document.createElement('iframe');
  display.className = 'sacred-portal';
  frame.title = 'Сакральные места Кыргызстана';
  frame.inert = true;
  display.append(frame);
  stage.append(display);

  let ready;
  const send = (type, detail = {}) => frame.contentWindow?.postMessage({ type, ...detail }, location.origin);
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
    if (event.data?.type === 'aigine:sacred-return') returnToYurt();
  });

  function prepare() {
    ready ??= new Promise(resolve => {
      const timeout = setTimeout(() => finish(false), 10000);
      function finish(loaded) {
        clearTimeout(timeout);
        window.removeEventListener('message', onReady);
        if (!loaded) frame.removeAttribute('src');
        resolve(loaded);
      }
      function onReady(event) {
        if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
        if (event.data?.type === 'aigine:sacred-ready') finish(true);
        if (event.data?.type === 'aigine:sacred-error') finish(false);
      }
      window.addEventListener('message', onReady);
      frame.src = new URL('./sacred-sites/index.html', import.meta.url);
    });
    return ready;
  }

  return {
    prepare,
    reveal(lift) {
      display.dataset.visible = 'true';
      display.style.setProperty('--sacred-mix', Math.min(1, lift * 3.2));
      send('aigine:sacred-lift', { lift });
    },
    open(focus) {
      display.dataset.active = 'true';
      frame.inert = false;
      send('aigine:sacred-play');
      if (focus) send('aigine:sacred-focus');
    },
    close() {
      if (!display.dataset.visible) return;
      delete display.dataset.active;
      delete display.dataset.visible;
      frame.inert = true;
      send('aigine:sacred-pause');
    },
  };
}
