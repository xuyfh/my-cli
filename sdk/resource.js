export default {
  init: callback => {
    const Utils = {
      getResourceData: r => {
        const data = {
          initiatorType: r.initiatorType, // 资源类型
          name: r.name, // 资源URL
          duration: Math.round(r.duration), // 资源加载总耗时

          // 连接过程
          redirect: Math.round(r.redirectEnd - r.redirectStart), // 重定向时间
          dns: Math.round(r.domainLookupEnd - r.domainLookupStart), // DNS解析时间
          connect: Math.round(r.connectEnd - r.connectStart), // TCP建连时间
          network: r.connectEnd === 0 ? 0 : Math.round(r.connectEnd - r.startTime), // 网络总耗时

          // 接收过程
          send: Math.round(r.responseStart - r.requestStart), // 前端发送到接收的时间
          receive: r.responseStart === 0 ? 0 : Math.round(r.responseEnd - r.responseStart), // 接收数据用时
          request: r.requestStart === 0 ? 0 : Math.round(r.responseEnd - r.requestStart), // 请求数据的总耗时

          // 核心指标
          ttfb: Math.round(r.responseStart - r.requestStart), // 首字节时间
        };

        return data;
      },
      initiatorTypeList: [
        'script',
        'link',
        'css',
        'img',
        'other'
      ]
    };

    window.addEventListener('load', () => {
      let timingList = performance.getEntriesByType('resource');
      timingList = timingList.filter(timing => {
        return Utils.initiatorTypeList.includes(timing.initiatorType);
      });

      timingList.forEach(timing => {
        const resourceData = Utils.getResourceData(timing);

        callback(resourceData);
      });
    }, { once: true });
  }
};
