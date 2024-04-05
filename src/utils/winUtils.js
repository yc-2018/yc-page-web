/** 判断是否是移动端 */
export default  function isMobile() {
    // 判断是否是移动端
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // 判断是否是移动窗口
    const isMobileViewport = isMobileDevice || (window?.matchMedia('(max-width: 767px)')?.matches);

    return isMobileDevice || isMobileViewport;
}