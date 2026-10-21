// Global objects go here (outside of any functions)
let data, scatterplot, barchart;

// Initialize dispatcher for event handling
const dispatcher = d3.dispatch('filterCategories');

/**
 * Load data from CSV file asynchronously and render charts
 */
d3.csv('data/vancouver_trails.csv')
  .then(_data => {
    data = _data;

    // Data preprocessing: convert string numbers to actual numbers
    data.forEach(d => {
      d.length = +d.length;
      d.elevation_gain = +d.elevation_gain;
      d.rating = +d.rating;
    });

    // Ordinal color scale for difficulty
    const colorScale = d3.scaleOrdinal()
      .domain(['Easy', 'Intermediate', 'Difficult'])
      .range(['#5cb85c', '#f0ad4e', '#d9534f']);

    // Scatterplot config
    const scatterplotConfig = {
      parentElement: '#scatterplot',
      colorScale: colorScale
    };

    // Barchart config
    const barchartConfig = {
      parentElement: '#barchart',
      colorScale: colorScale
    };

    // Initialize visualizations
    scatterplot = new Scatterplot(scatterplotConfig, data);
    scatterplot.updateVis();

    barchart = new Barchart(barchartConfig, dispatcher, data);
    barchart.updateVis();
  })
  .catch(error => console.error('Error loading the data:', error));

// Dispatcher event handler
dispatcher.on('filterCategories', selectedCategories => {
  if (selectedCategories.length === 0) {
    scatterplot.data = data;
  } else {
    scatterplot.data = data.filter(d =>
      selectedCategories.includes(d.difficulty)
    );
  }
  scatterplot.updateVis();
});
