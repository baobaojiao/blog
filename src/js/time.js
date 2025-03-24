export  function sysTime() {
    const now = new Date();
    // 获取年、月、日、小时、分钟和秒
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    // 格式化日期时间为 yyyyMMddHHmm
    const formattedDateTime = `${year}${month}${day}${hours}${minutes}`;
    return formattedDateTime;
  }