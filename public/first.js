document.getElementById('acceptCookies').addEventListener('click', function() {
    document.getElementById('gdprBanner').style.display = 'none';
    localStorage.setItem('cookiesAccepted', 'true');
  });
  
  window.onload = function() {
    if (!localStorage.getItem('cookiesAccepted')) {
      document.getElementById('gdprBanner').style.display = 'flex';
    }
  };
