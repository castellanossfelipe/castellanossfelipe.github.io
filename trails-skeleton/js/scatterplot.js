class Scatterplot {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      colorScale: _config.colorScale,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 300,
      margin: _config.margin || { top: 25, right: 20, bottom: 20, left: 35 },
      tooltipPadding: _config.tooltipPadding || 15
    }
    this.data = _data;
    this.initVis();
  }

  /**
   * Initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleLinear()
      .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
      .range([vis.height, 0]);

    // Symbol scale for categorical difficulty values
    vis.symbolScale = d3.scaleOrdinal()
      .range([
        d3.symbol().type(d3.symbolCircle)(),
        d3.symbol().type(d3.symbolSquare)(),
        d3.symbol().type(d3.symbolDiamond)()
      ])
      .domain(['Easy', 'Intermediate', 'Difficult']);

    vis.xAxis = d3.axisBottom(vis.xScale)
      .ticks(6)
      .tickSize(-vis.height - 10)
      .tickPadding(10)
      .tickFormat(d => d + ' km');

    vis.yAxis = d3.axisLeft(vis.yScale)
      .ticks(6)
      .tickSize(-vis.width - 10)
      .tickPadding(10);

    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.xAxisG = vis.chart.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${vis.height})`);

    vis.yAxisG = vis.chart.append('g')
      .attr('class', 'axis y-axis');

    vis.chart.append('text')
      .attr('class', 'axis-title')
      .attr('y', vis.height - 15)
      .attr('x', vis.width + 10)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Distance');

    vis.svg.append('text')
      .attr('class', 'axis-title')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '.71em')
      .text('Hours');
  }

  /**
   * Slightly offset a value to reduce overlap in scatterplot
   */
  jitter(value) {
    let offset = Math.floor(Math.random() * 5) + 1;
    offset *= Math.random() > 0.5 ? 1 : -1;
    return value + offset;
  }

  /**
   * Prepare the data and scales before we render it.
   */
  updateVis() {
    let vis = this;

    vis.colorValue = d => d.difficulty;
    vis.xValue = d => d.time;
    vis.yValue = d => d.distance;

    vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
    vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

    vis.renderVis();
  }

  /**
   * Bind data to visual elements.
   */
  renderVis() {
    let vis = this;

    const symbols = vis.chart.selectAll('.symbol')
      .data(vis.data, d => d.trail)
      .join('path')
      .attr('class', 'symbol')
      .attr('transform', d =>
        `translate(${vis.jitter(vis.xScale(vis.xValue(d)))}, ${vis.yScale(vis.yValue(d))})`
      )
      .attr('d', d => vis.symbolScale(d.difficulty))
      .attr('fill', d => vis.config.colorScale(vis.colorValue(d)));

    // Tooltip event listeners
    symbols
      .on('mouseover', (event, d) => {
        d3.select('#tooltip')
          .style('display', 'block')
          .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
          .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
          .html(`
            <div class="tooltip-title">${d.trail}</div>
            <div><i>${d.region}</i></div>
            <ul>
              <li>${d.distance} km, ~${d.time} hours</li>
              <li>${d.difficulty}</li>
              <li>${d.season}</li>
            </ul>
          `);
      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('display', 'none');
      });

    vis.xAxisG.call(vis.xAxis).call(g => g.select('.domain').remove());
    vis.yAxisG.call(vis.yAxis).call(g => g.select('.domain').remove());
  }
}
