// opts should contain:
// svg (d3 selection)
// orientation ('horizontal' or 'vertical')
// thickness
// maxLength
// x
// y

function createScopeSlider(opts) {

var scopeSlider = {
  slider: null
};

for (var prop in opts) {
  if (opts.hasOwnProperty(prop)) {
    scopeSlider[prop] = opts[prop];
  }
}

scopeSlider.setUpElements = function setUpElements() {
  this.slider = this.svg.select('.scope-slider');

  if (this.slider.empty()) {
    this.slider = this.svg.append('g').classed('scope-slider', true);
    this.slider.attr('transform', 'translate(' + this.x + ', ' + this.y + ')');

    this.slider.append('rect').classed('slider-backing', true)
    .attr({
      width: (this.orientation === 'vertical') ? this.thickness : this.maxLength,
      height: (this.orientation === 'vertical') ? this.maxLength : this.thickness,
      fill: 'blue',
      x: 0,
      y: 0
    });
  }

  // var drag = d3.behavior.drag();
  // drag.on('drag', dragScaler);

  // scaler.call(drag);

  // function dragScaler(d) {
  //   console.log('dragging:', d3.event.dy);
  //   scaler.attr('fill', graph.colorDesignator.getHSLAForVisitCount(d3.event.dy));
  // }
  return this.slider;
};

return scopeSlider;
}

