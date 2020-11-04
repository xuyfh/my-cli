export default {
  init: callback => {
    const Utils = {
      // performance.timing
      getPerfDataV1: p => {
        const data = {
          // 网络建连
          prevPage: p.fetchStart - p.navigationStart, // 上一个页面的时间
          redirect: p.redirectEnd - p.redirectStart, // 重定向时间
          dns: p.domainLookupEnd - p.domainLookupStart, // DNS解析时间
          connect: p.connectEnd - p.connectStart, // TCP建连时间
          network: p.connectEnd - p.navigationStart, // 网络总耗时

          // 网络接收
          send: p.responseStart - p.requestStart, // 前端发送到接收的时间
          receive: p.responseEnd - p.responseStart, // 接收数据用时
          request: p.responseEnd - p.requestStart, // 请求页面的总耗时

          // 前端渲染
          dom: p.domComplete - p.domLoading, // DOM解析时间
          loadEvent: p.loadEventEnd - p.loadEventStart, // loadEvent时间
          frontEnd: p.loadEventEnd - p.domLoading, // 前端总时间

          // 关键阶段
          load: p.loadEventEnd - p.navigationStart, // 页面完全加载的时间
          domReady: p.domContentLoadedEventStart - p.navigationStart, // DOM准备时间
          interactive: p.domInteractive - p.navigationStart, // 可操作时间
          ttfb: p.responseStart - p.navigationStart, // 首字节时间
        };

        return data;
      },
      // PerformanceNavigationTiming
      getPerfDataV2: p => {
        const data = {
          // 网络建连
          prevPage: Math.round(p.fetchStart - p.startTime), // 上一个页面的时间
          redirect: Math.round(p.redirectEnd - p.redirectStart), // 重定向时间
          dns: Math.round(p.domainLookupEnd - p.domainLookupStart), // DNS解析时间
          connect: Math.round(p.connectEnd - p.connectStart), // TCP建连时间
          network: Math.round(p.connectEnd - p.startTime), // 网络总耗时

          // 网络接收
          send: Math.round(p.responseStart - p.requestStart), // 前端发送到接收的时间
          receive: Math.round(p.responseEnd - p.responseStart), // 接收数据用时
          request: Math.round(p.responseEnd - p.requestStart), // 请求页面的总耗时

          // 前端渲染
          dom: Math.round(p.domComplete - p.domInteractive), // DOM解析时间
          loadEvent: Math.round(p.loadEventEnd - p.loadEventStart), // loadEvent时间
          frontEnd: Math.round(p.loadEventEnd - p.domInteractive), // 前端总时间

          // 关键阶段
          load: Math.round(p.loadEventEnd - p.startTime), // 页面完全加载的时间
          domReady: Math.round(p.domContentLoadedEventStart - p.startTime), // DOM准备时间
          interactive: Math.round(p.domInteractive - p.startTime), // 可操作时间
          ttfb: Math.round(p.responseStart - p.startTime), // 首字节时间
        };

        return data;
      }
    };

    const po = new PerformanceObserver((entryList, observer) => {
      const timingList = entryList.getEntries();

      timingList.forEach(timing => {
        const perfDataV2 = Utils.getPerfDataV2(timing);

        callback(perfDataV2);
      });

      observer.disconnect();
    });

    po.observe({ entryTypes: ['navigation'] });
  }
};
