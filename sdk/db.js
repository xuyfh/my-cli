const DBTools = {
  db: null,
  init: () => {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open('performance_db', 1);

      openRequest.onupgradeneeded = event => {
        const thisDB = event.target.result;

        if (!thisDB.objectStoreNames.contains('perf')) {
          const perfOS = thisDB.createObjectStore('perf', { autoIncrement: true });
          const indexList = ['prevPage', 'redirect', 'dns', 'connect', 'network', 'send', 'receive', 'request', 'dom', 'loadEvent', 'frontEnd', 'load', 'domReady', 'interactive', 'ttfb'];
          indexList.forEach(index => {
            perfOS.createIndex(index, index);
          });
        }

        if (!thisDB.objectStoreNames.contains('resource')) {
          const resourceOS = thisDB.createObjectStore('resource', { autoIncrement: true });
          const indexList = ['initiatorType', 'name', 'duration', 'redirect', 'dns', 'connect', 'network', 'send', 'receive', 'request', 'ttfb'];
          indexList.forEach(index => {
            resourceOS.createIndex(index, index);
          });
        }

        if (!thisDB.objectStoreNames.contains('ajax')) {
          const ajaxOS = thisDB.createObjectStore('ajax', { autoIncrement: true });
          const indexList = ['initiatorType', 'name', 'duration', 'redirect', 'dns', 'connect', 'network', 'send', 'receive', 'request', 'ttfb'];
          indexList.forEach(index => {
            ajaxOS.createIndex(index, index);
          });
        }

        if (!thisDB.objectStoreNames.contains('wv')) {
          const wvOS = thisDB.createObjectStore('wv', { autoIncrement: true });
          const indexList = ['LCP'];
          indexList.forEach(index => {
            wvOS.createIndex(index, index);
          });
        }
      };

      openRequest.onsuccess = event => {
        DBTools.db = event.target.result;

        resolve();
      };
    });
  },
  write: async (type, data) => {
    if (!DBTools.db) {
      await DBTools.init();

      DBTools.write(type, data);
    } else {
      const transaction = DBTools.db.transaction([type], 'readwrite');
      const store = transaction.objectStore(type);

      store.add(data);
    }
  }
};

export default DBTools;
