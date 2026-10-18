(() => {
  if (location.protocol === 'file:') return;

  // Warm the document cache without embedding another page in the homepage.
  // app.js creates the visible Support iframe only when the visitor opens it;
  // the console and its music remain mounted throughout that transition.
  const hint = document.createElement('link');
  hint.rel = 'prefetch';
  hint.as = 'document';
  hint.href = '/Support/';
  document.head.appendChild(hint);
})();
