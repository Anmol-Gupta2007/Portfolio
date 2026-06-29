// Dynamically crop the square favicon into a circle
window.addEventListener('load', function() {
  const img = new Image();
  img.crossOrigin = "anonymous"; 
  
  // Update this path if your HTML files are in different folders
  img.src = 'Image/photo.png'; 
  
  img.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    ctx.drawImage(img, 0, 0, 64, 64);
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = canvas.toDataURL('image/png');
  };
});
