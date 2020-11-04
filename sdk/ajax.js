export default {
  init: callback => {
    const Utils = {
      getAjaxData: a => {
        const data = {
          initiatorType: a.initiatorType, // 请求类型
          name: a.name, // 请求URL
          duration: Math.round(a.duration), // 请求总耗时

          // 连接过程
          redirect: Math.round(a.redirectEnd - a.redirectStart), // 重定向时间
          dns: Math.round(a.domainLookupEnd - a.domainLookupStart), // DNS解析时间
          connect: Math.round(a.connectEnd - a.connectStart), // TCP建连时间
          network: a.connectEnd === 0 ? 0 : Math.round(a.connectEnd - a.startTime), // 网络总耗时

          // 接收过程
          send: Math.round(a.responseStart - a.requestStart), // 前端发送到接收的时间
          receive: a.responseStart === 0 ? 0 : Math.round(a.responseEnd - a.responseStart), // 接收数据用时
          request: a.requestStart === 0 ? 0 : Math.round(a.responseEnd - a.requestStart), // 请求数据的总耗时

          // 核心指标
          ttfb: Math.round(a.responseStart - a.requestStart), // 首字节时间
        };

        return data;
      },
      initiatorTypeList: [
        'xmlhttprequest',
        'fetch'
      ]
    };

    const po = new PerformanceObserver((entryList, observer) => {
      let timingList = entryList.getEntries();
      timingList = timingList.filter(timing => {
        return Utils.initiatorTypeList.includes(timing.initiatorType);
      });

      timingList.forEach(timing => {
        const ajaxData = Utils.getAjaxData(timing);

        callback(ajaxData);
      });
    });

    po.observe({ entryTypes: ['resource'] });
  }
};
