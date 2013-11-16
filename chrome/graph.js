function createGraph(titleText) {
  
var graph = {
  height: 440,
  width: 450,
  leftLabelWidth: 60,
  paddingLeft: 44,
  paddingRight: 0,
  titleText: titleText,
  titleHeight: 40,
  titleLineHeight: 20,
  maxTitleLineLength: 60,
  colorDesignator: createColorDesignator(36, 220, 40, 80, 0.5, 1.0),
  scopeSlider: null
};

graph.setUpContainers = function setUpContainers(bodyEl, targetSvgId) {
  var body = d3.select(bodyEl);
  // body.on('click', function closePopup() {
  //   window.close();
  // });

  var svg = body.select('#' + targetSvgId);
  if (svg.empty()) {      
    svg = body.append('svg').attr({
      id: targetSvgId,
      width: this.width,
      height: this.height
    });
  }

  var graphContent = svg.select('#graphContent');
  if (graphContent.empty()) {
    graphContent = svg.append('g').attr('id', 'graphContent');
    graphContent.attr('transform', 'translate(' + this.paddingLeft + ', 0)');
  }

  this.scopeSlider = createScopeSlider({
    svg: svg,
    orientation: 'vertical',
    thickness: 44,
    lengthToScopeScale: d3.scale.linear().domain([0, this.height]).range([0, 100]),
    x: 0,
    y: 0
  });
  this.scopeSlider.setUpElements();

  return graphContent;
};

graph.setUpTitle = function setUpTitle(graphContent) {
  var title = graphContent.select('.graph-title');
  if (title.empty()) {
    title = graphContent.append('g').classed('graph-title', true);
  }

  var x = (this.width + this.leftLabelWidth + this.paddingRight)/2;
  var y = this.height - this.titleHeight;
  title.attr('transform', 'translate(' + x + ', ' + y + ')');

  var linesOfText = breakLineUp(this.titleText, this.maxTitleLineLength);
  var lines = title.selectAll('text').data(linesOfText);
  lines.enter().append('text');
  lines.text(function echoText(d) { return d; })
  .attr('y', function getY(d, i) {
    if (linesOfText.length === 1) {
      return this.titleLineHeight * 0.666;
    }
    else {
      return i * this.titleLineHeight;
    }
  }
  .bind(this));
};


// dailyVisits should be an array of objects, each with a date and a 
// visitCount.
graph.render = function render(bodyEl, targetSvgId, dailyVisits) {
  var graphContent = this.setUpContainers(bodyEl, targetSvgId);
  this.setUpTitle(graphContent);

  var visitLabelWidthGuess = guessAtMaxLabelWidth(dailyVisits);
  var xScale = d3.scale.linear()
    .domain([0, d3.max(dailyVisits, function getCount(d) {
      return d.visitCount;
    })])
    .range([0, this.width - visitLabelWidthGuess]);

  var yScale = d3.scale.ordinal()
    .domain(d3.range(dailyVisits.length))
    .rangeRoundBands([0, this.height - this.titleHeight], 0.22);

  var visitBars = graphContent.selectAll('.visit-bar').data(dailyVisits, 
    identifyByDate);

  visitBars.enter().append('rect').attr({
    class: 'visit-bar',
    y: function getY(d, i) {
      return yScale(i);
    },
    x: this.leftLabelWidth,
    width: 0,
    height: yScale.rangeBand(),
    fill: 'hsla(36, 0, 100, 0.5)'
  });

  // Update.
  visitBars.attr('width', function getWidth(d, i) {
    return xScale(d.visitCount);
  });
  visitBars.transition().duration(250).ease('quad')
    .attr('fill', function getColor(d) {
      return this.colorDesignator.getHSLAForVisitCount(d.visitCount);
    }
    .bind(this));

  visitBars.exit().remove();


  var visitLabels = graphContent.selectAll('.visit-label').data(dailyVisits,
    identifyByDate);

  visitLabels.enter().append('text').attr({
    class: 'visit-label',
    x: function getLabelX(d) {
      return xScale(d.visitCount) + this.leftLabelWidth + 6;
    }
    .bind(this),
    y: function getLabelY(d, i) {
      return yScale(i) + yScale.rangeBand()/2 - 2;
    },
    'fill-opacity': 0
  });

  // Update.
  visitLabels.text(function getText(d) {
    return d.visitCount ? d.visitCount : '';
  });
  visitLabels.transition().delay(250).duration(250).ease('exp')
    .attr('fill-opacity', 1);

  visitLabels.exit().remove();


  var yAxis = d3.svg.axis()
    .scale(yScale)
    .tickSize(0)
    .orient('left')
    .tickFormat(d3.time.format('%a'))
    .tickValues(_.pluck(dailyVisits, 'date'));

  var axisGroup = graphContent.select('.y.axis');
  if (axisGroup.empty()) {
    axisGroup = graphContent.append('g').attr('class', 'y axis')
    .attr('transform', 'translate(' + (this.leftLabelWidth - 5) + ', 0)');
    axisGroup.call(yAxis);
  }

};

function identifyByDate(d) {
  return d.date;
}

function guessAtMaxLabelWidth(dailyVisits) {
  var mostVisited = _.max(dailyVisits, 
    function getCount(d) { return d.visitCount; });
  var digitCount = mostVisited.visitCount.toString().length;
  var visitLabelWidthGuess = 23 * digitCount;
  switch (digitCount) {
    case 1:    
      visitLabelWidthGuess = 33;
      break;
    case 2: 
      visitLabelWidthGuess = 50;
      break;
    case 3:
      visitLabelWidthGuess = 66;
      break;
    default:
      visitLabelWidthGuess = 22 * digitCount;
  }
  return visitLabelWidthGuess;
}

return graph;

}

