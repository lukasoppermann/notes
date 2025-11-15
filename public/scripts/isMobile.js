const isMobile = (mobileBreakpoint = '700px') =>{
  const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint})`);
  
  function handleMobileChange(e) {
    if (e.matches) {
      document.body.setAttribute('data-isMobile', '');
    } else {
      document.body.removeAttribute('data-isMobile');
    }
  }
  
  // Initial check
  handleMobileChange(mediaQuery);
  
  // Listen for changes
  mediaQuery.addEventListener('change', handleMobileChange);
}
window.isMobile = isMobile;