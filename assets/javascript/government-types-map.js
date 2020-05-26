const valueList = {
  'Policy Board': ['Selectmen', 'Select Board'],
  'Legislative Body': ['Open Town Meeting', 'Representative Town Meeting'],
};

const rangeList = {
  'Policy Board': ['#0063e6', '#ff5a50'],
  'Legislative Body': ['#0063e6', '#ff5a50'],
};

function createMap(data) {
  const colors = d3
    .scaleOrdinal()
    .domain(valueList['Policy Board'])
    .range(rangeList['Policy Board'])
    .unknown(['#d3d3d3']);

  const path = d3.geoPath().projection(null);

  d3.select('.government-form-map')
    .append('g')
    .attr('class', 'government-form-map__data')
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('fill', d => colors(d.properties['Policy Board']))
    .attr('opacity', '0.8')
    .attr('class', 'government-form-map__municipality')
    .attr('d', path);

  // Legend

  legendGroup = d3
    .select('.government-form-map')
    .append('g')
    .attr('class', 'legend')
    .attr('x', 0)
    .attr('y', 0);

  legendGroup
    .append('rect')
    .attr('x', 0)
    .attr('y', 400)
    .attr('width', 250)
    .attr('height', 140)
    .style('stroke-width', 1)
    .style('stroke', 'rgb(0,0,0)')
    .style('fill', 'rgb(255,255,255,.5)');

  legendGroup
    .selectAll('circle')
    .data(valueList['Policy Board'])
    .enter()
    .append('circle')
    .attr('cx', 15)
    .attr('cy', (d, i) => 420 + i * 25)
    .attr('r', 7)
    .style('fill', d => colors(d));

  legendGroup
    .selectAll('text')
    .data(valueList['Policy Board'])
    .enter()
    .append('text')
    .attr('x', 30)
    .attr('y', (d, i) => 421 + i * 25)
    .text(d => d)
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle');
}

function addUpdateButtons() {
  d3.select('.layer-select').on('change', updateMap);
}

function updateMap() {
  const colors = d3
    .scaleOrdinal()
    .domain(valueList[this.value])
    .range(rangeList[this.value])
    .unknown(['#d3d3d3']);

  d3.selectAll('.government-form-map__data > *').attr('fill', data =>
    colors(data.properties[this.value])
  );

  d3.selectAll('.legend > circle, .legend > text').remove();

  d3.select('.legend')
    .selectAll('circle')
    .data(valueList[this.value])
    .enter()
    .append('circle')
    .attr('cx', 15)
    .attr('cy', (d, i) => 420 + i * 25)
    .attr('r', 7)
    .style('fill', d => colors(d));

  d3.select('.legend')
    .selectAll('text')
    .data(valueList[this.value])
    .enter()
    .append('text')
    .attr('x', 30)
    .attr('y', (d, i) => 421 + i * 25)
    .text(d => d)
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle');
}

function zoomed() {
  d3.selectAll('.government-form-map__data')
    .selectAll('path,circle')
    .attr('transform', d3.event.transform);
}

function addZoomToMaps() {
  const zoom = d3
    .zoom()
    .scaleExtent([1, 8])
    .on('zoom', zoomed);
  d3.select('.government-form-map').call(zoom);
}

// function createForce(data) {
//   const simulation = d3.forceSimulation()
//   .velocityDecay(0.2);

//   simulation.nodes(d => d.properties)

// }

window.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    d3.json('/assets/data/ma-municipal-government-forms-and-finances.json'),
  ]).then(data => {
    const topology = topojson.feature(data[0], data[0].objects['layer1']);
    createMap(topology.features);
    addZoomToMaps();
    addUpdateButtons();
    createForce(topologyfeatures);;
  });
});