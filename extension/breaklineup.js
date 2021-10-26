function breakLineUp(originalLine, maxLineLength) {
  var linesOfText = [];

  if (originalLine.length <= maxLineLength) {
    linesOfText.push(originalLine);
  }
  else {
    var pieces = originalLine.split('/');
    var line = '';
    pieces.forEach(function assembleLine(piece) {
      if (line.length > 0 || linesOfText.length > 0) {
        line += '/';
      }
      line += piece;
      if (line.length > maxLineLength) {
        linesOfText.push(line);
        line = '';
      }
    });

    if (line.length > 0) {
      linesOfText.push(line);
    }
  }
  
  return linesOfText;
}
