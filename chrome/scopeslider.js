// opts should contain:
// svg: d3 selection
// isVertical: bool, is assumed to be horizontal if false
// thickness
// minLength: The minimum length of the bar.
// maxLength: The maximum length of the bar.
// x: x position of the entire thing.
// y: y position of the entire thing.
// onScopeChange (function([start, end]): Callback. Current start and end of 
// bar.

function createScopeSlider(opts) {

var scopeSlider = {
  slider: null,
  sliderBar: null,
  barBody: null,
  barHandleMax: null,
  barHandleMin: null,
  dragTarget: null
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

    this.slider.append('rect').classed('slider-frame', true).attr({
      width: this.isVertical ? this.thickness : this.maxLength,
      height: this.isVertical ? this.maxLength : this.thickness,
      fill: 'blue',
      x: 0,
      y: 0
    });

    this.sliderBar = this.slider.append('g').classed('slider-bar', true);

    this.barBody = this.sliderBar.append('rect').classed('slider-bar-body', true)
      .attr({
        width: this.isVertical ? this.thickness : this.barEnd,
        height: this.isVertical ? this.barEnd : this.thickness,
        fill: 'red',
        x: 0,
        y: this.barStart
      });

    this.barHandleMin = this.sliderBar.append('rect')
      .classed('slider-handle-min', true)
      .attr({
        width: this.thickness,
        height: this.thickness,
        fill: 'yellow',
        'fill-opacity': 0.5,        
        x: 0,
        y: this.barStart
      });

    this.barHandleMax = this.sliderBar.append('rect')
      .classed('slider-handle-max', true)
      .attr({
        width: this.thickness,
        height: this.thickness,
        fill: 'green',
        'fill-opacity': 0.5,        
        x: 0,
        y: this.barEnd - this.thickness
      });
  }

  this.setUpDragBehaviors();

  return this.slider;
};

scopeSlider.setUpDragBehaviors = function setUpDragBehaviors() {
  var dragBar = d3.behavior.drag().on('drag', this.dragTheBar.bind(this))
    .on('dragend', function stoppedDrag() {
      setTimeout(function resetDragTarget() {
        this.dragTarget = null;
      }.bind(this),
      0);
    }
    .bind(this));

  var dragMax = d3.behavior.drag()
    .on('dragstart', function startedDrag() {
      this.dragTarget = 'maxHandle';
    }
    .bind(this));

  var dragMin = d3.behavior.drag()
    .on('dragstart', function startedDrag() {
      this.dragTarget = 'minHandle';
    }
    .bind(this));

  this.sliderBar.call(dragBar);
  this.barHandleMax.call(dragMax);
  this.barHandleMin.call(dragMin);  
};

scopeSlider.dragTheBar = function dragTheBar() {
  console.log('this.dragTarget', this.dragTarget);
  if (this.dragTarget === 'maxHandle') {
    this.dragMaxHandle();
  }
  else if (this.dragTarget === 'minHandle') {
    this.dragMinHandle();
  }
  else {
    console.log('Translating.');
    this.barStart += this.isVertical ? d3.event.dy : d3.event.dx;
    if (this.isVertical) {
      this.sliderBar.attr('transform', translate(0, this.barStart));
    }
    else {
      this.sliderBar.attr('transform', translate(this.barStart, 0));
    }    
  }
};

scopeSlider.dragMaxHandle = function dragMaxHandle() {
  d3.event.sourceEvent.stopPropagation();

  this.barEnd += this.isVertical ? d3.event.dy : d3.event.dx;
  this.barBody.attr({
    width: this.isVertical ? this.thickness : this.barEnd,
    height: this.isVertical ? this.barEnd : this.thickness,
  });
  
  this.barHandleMax.attr(this.isVertical ? 'y' : 'x', 
    this.barEnd - this.thickness);
};

scopeSlider.dragMinHandle = function dragMinHandle() {
  this.barStart += this.isVertical ? d3.event.dy : d3.event.dx;
  var barLength = this.barEnd - this.barStart;
  if (barLength < this.minLength) {
    barLength = this.minLength;
    this.barStart = this.barEnd - barLength;
  }
  this.barBody.attr({
    x: this.isVertical ? 0 : this.barStart,
    y: this.isVertical ? this.barStart : 0,
    width: this.isVertical ? this.thickness : barLength,
    height: this.isVertical ? barLength : this.thickness
  });
  
  this.barHandleMin.attr(this.isVertical ? 'y' : 'x', this.barStart);
};

function translate(x, y) {
  return 'translate(' + x + ', ' + y + ')';
}

return scopeSlider;
}

