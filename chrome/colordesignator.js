function createColorDesignator(highVisitCountThreshold, bluestHue, 
  darkest, lightest, minAlpha, maxAlpha) {

var ColorDesignator = {
  highVisitCountThreshold: highVisitCountThreshold, 
  bluestHue: bluestHue,
  darkest: darkest,
  lightest: lightest,
  minAlpha: minAlpha,
  maxAlpha: maxAlpha
};

ColorDesignator.bgAlphaForVisitCount = function bgAlphaForVisitCount(count) {
  var alpha = this.minAlpha;
  if (typeof count === 'number') {
    var proportionOfHighVisitCount = 1.0 * count/this.highVisitCountThreshold;
    alpha += proportionOfHighVisitCount * (this.maxAlpha - this.minAlpha);
    if (alpha > this.maxAlpha) {
      alpha = this.maxAlpha;
    }
  }
  // return 1.0;
  return alpha;
};

ColorDesignator.bgHueForVisitCount = function bgHueForVisitCount(count) {
  var h = bluestHue;
  if (typeof count === 'number' && count > 0) {
    var proportionOfHighVisitCount = 1.0 * count/this.highVisitCountThreshold;
    h = this.bluestHue - proportionOfHighVisitCount * this.bluestHue;
    if (h < 0) {
      h = 0;
    }
  }
  return h;
};

ColorDesignator.bgSaturationForVisitCount = 
function bgSaturationForVisitCount(count) {
  var s = 50.0;
  if (typeof count === 'number') {
    s += 50.0 * count/this.highVisitCountThreshold;
    if (s > 100) {
      s = 100;
    }
  }
  return s;
};

ColorDesignator.bgLightnessForVisitCount = 
function bgLightnessForVisitCount(count) {
  var l = this.lightest;
  if (typeof count === 'number') {
    l -= (this.lightest - this.darkest) * count/this.highVisitCountThreshold;
    if (l < this.darkest) {
      l = this.darkest;
    }
  }
  return l;
};

ColorDesignator.getHSLAForVisitCount = function getHSLAForVisitCount(visits) {
  return 'hsla(' + 
    this.bgHueForVisitCount(visits) + ', ' + 
    this.bgSaturationForVisitCount(visits) + '%, ' + 
    this.bgLightnessForVisitCount(visits) + '%, ' + 
    this.bgAlphaForVisitCount(visits) + 
  ')';
};

return ColorDesignator;
}
