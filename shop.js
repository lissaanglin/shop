/* lissaanglin.com/shop renderer — reads shop.json from the same folder
   and draws it into <div id="ll-shop">. Edit shop.json, not this file. */
(function () {
  var mount = document.getElementById('ll-shop');
  if (!mount) return;
  var base = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');
  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  fetch(base + 'shop.json?v=' + Date.now())
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var h = '';
      if (d.intro) h += '<div class="ll-intro"><p>' + esc(d.intro) + '</p></div>';
      if (d.posts.length > 1) {
        h += '<div class="ll-jump">';
        d.posts.forEach(function (p) { h += '<a href="#' + esc(p.id) + '">' + esc(p.title) + '</a>'; });
        h += '</div>';
      }
      d.posts.forEach(function (p) {
        h += '<section class="ll-post" id="' + esc(p.id) + '"><h2>' + esc(p.title) + '</h2>';
        if (p.intro) h += '<p class="ll-small">' + esc(p.intro) + '</p>';
        if (p.video) h += '<p class="ll-small"><a href="' + esc(p.video) + '" target="_blank" rel="noopener">Watch the video →</a></p>';
        p.groups.forEach(function (g, i) {
          h += '<div class="ll-group"><h3>' + esc(g.heading) + '</h3>';
          g.items.forEach(function (it) {
            h += '<a class="ll-btn' + (i % 2 ? ' pink' : '') + '" href="' + esc(it.url) + '" target="_blank" rel="noopener">' +
                 esc(it.name) + (it.detail ? '<span>' + esc(it.detail) + '</span>' : '') + '</a>';
          });
          h += '</div>';
        });
        h += '</section>';
      });
      mount.innerHTML = h;
      if (location.hash) { var t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }
    })
    .catch(function () {
      mount.innerHTML = '<p class="ll-small">Links are loading slowly. Refresh in a sec!</p>';
    });
})();
