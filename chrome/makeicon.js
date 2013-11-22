function makeIcon(text, textColor, bgStyle) {
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.width = 19;
  canvas.height = 19;

  var context = canvas.getContext('2d');

  drawBackground(context, canvas, bgStyle);

  drawText(context, text, canvas.width);

  function drawText(context, text, maxWidth) {
    context.fillStyle = textColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    var fontSize = 18;

    do {
      var fontString = '';

      if (fontSize > 9) {
        fontString = 'bold ';
      }
      fontString += fontSize + 'px futura,sans-serif';
      
      context.font = fontString;
      metrics = context.measureText(text);
      fontSize -= 2;
    }
    while (metrics.width > maxWidth || fontSize < 6);
    
    context.fillText(text, canvas.width/2, canvas.height/2, maxWidth);
  }

  function drawBackground(context, canvas, bgStyle) {
    context.fillStyle = bgStyle;
    context.beginPath();
    var r = 3;
    context.moveTo(0, r);
    // First two args are the control point. The second two are where you want 
    // to end.
    context.arcTo(0, 0, r, 0, r);
    context.lineTo(canvas.width - r, 0);
    context.arcTo(canvas.width, 0, canvas.width, r, r);
    context.lineTo(canvas.width, canvas.height - r);
    context.arcTo(canvas.width, canvas.height, canvas.width - r, canvas.height, r);
    context.lineTo(r, canvas.height);
    context.arcTo(0, canvas.height, 0, canvas.height - r, r);
    context.lineTo(0, r);
    context.fill();
  }

  var imageData = context.getImageData(0, 0, 19, 19);

  setTimeout(function removeCanvas() {
    document.body.removeChild(canvas);
  },
  0);
  
  return imageData;
}
