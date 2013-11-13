function createGraph(titleText) {
  
var graph = {
  height: 440,
  width: 400,
  paddingLeft: 60,
  paddingRight: 50,
  titleText: titleText,
  titleHeight: 40,
  colorDesignator: createColorDesignator(36, 220, 40, 80, 0.5, 1.0)
};

graph.setUpContainers = function setUpContainers(bodyEl, targetSvgId) {
  var body = d3.select(bodyEl);
  body.on('click', function closePopup() {
    window.close();
  });

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
  }
  return graphContent;
};

graph.setUpTitle = function setUpTitle(graphContent) {
  var title = graphContent.select('.graph-title');
  if (title.empty()) {
    title = graphContent.append('text').classed('graph-title', true);
  }

  title.attr({
    x: (this.width + this.paddingLeft + this.paddingRight)/2,
    y: this.height - this.titleHeight/2
  })
  .text(titleText);
};

// dailyVisits should be an array of objects, each with a date and a 
// visitCount.
graph.render = function render(bodyEl, targetSvgId, dailyVisits) {
  var graphContent = this.setUpContainers(bodyEl, targetSvgId);
  this.setUpTitle(graphContent);

  var xScale = d3.scale.linear()
    .domain([0, d3.max(dailyVisits, function getCount(d) {
      return d.visitCount;
    })])
    .range([0, this.width]);

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
    x: this.paddingLeft,
    width: 0,
    height: yScale.rangeBand(),
    fill: 'hsla(36, 0, 100, 0.5)'
  });

  // Update.
  visitBars.attr('width', function getWidth(d, i) {
    return xScale(d.visitCount);
  });
  visitBars.transition().duration(800).ease('quad')
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
      return xScale(d.visitCount) + this.paddingLeft + 6;
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
    .attr('transform', 'translate(' + (this.paddingLeft - 5) + ', 0)');
    axisGroup.call(yAxis);
  }

};

function identifyByDate(d) {
  return d.date;
}

return graph;

}

