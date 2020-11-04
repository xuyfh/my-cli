import perf from './perf.js';
import resource from './resource.js';
import ajax from './ajax.js';
import wv from './wv.js';

import db from './db.js';

perf.init(perfData => {
  db.write('perf', perfData);
});

resource.init(resourceData => {
  db.write('resource', resourceData);
});

ajax.init(ajaxData => {
  db.write('ajax', ajaxData);
});

wv.init(wvData => {
  db.write('wv', wvData);
});
