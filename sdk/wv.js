export default {
  init: callback => {
    const Utils = {
      getWvData: w => {
        const data = {
          LCP: w.startTime
        };

        return data;
      }
    };

    const po = new PerformanceObserver((entryList, observer) => {
      const timingList = entryList.getEntries();

      timingList.forEach(timing => {
        const wvData = Utils.getWvData(timing);

        callback(wvData);
      });
    });

    po.observe({ entryTypes: ['largest-contentful-paint'] });
  }
};
