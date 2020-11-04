const Url = {
  fast: '/api/fast-list',
  slow: '/api/slow-list'
};

$.ajax(Url.fast);
fetch(Url.slow);

setTimeout(() => {
  fetch(Url.fast);
  $.ajax(Url.slow);
}, 2500);
