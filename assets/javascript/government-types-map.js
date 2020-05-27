const valueList = {
  'Policy Board': ['Selectmen', 'Select Board'],
  'Legislative Body': [
    'Open Town Meeting',
    'Representative Town Meeting',
    'Alderman',
    'Council',
  ],
  'Chief Municipal Official': [
    'Administrative Coordinator',
    'Chief Administrative Officer',
    'Executive Director',
    'Executive Secretary',
    'Executive Assistant',
    'General Manager',
    'Municipal Assistant',
    'Town Administrator',
    'Town Coordinator',
    'Town Manager',
    'Mayor',
  ],
};

const rangeList = {
  'Policy Board': ['#0063e6', '#ff5a50'],
  'Legislative Body': ['#17BECF', '#B07AA1', '#4E79A7', '#EDC948'],
  'Chief Municipal Official': [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
  ],
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
    .attr('height', '4rem') // number of entries times vertical height
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

  d3.selectAll('.legend > rect')
    .attr('height', `${16+(valueList[this.value].length *25)}px`)

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

function charge(d) {
  return -forceStrength * Math.pow(d.radius, 2.0);
}

function createForce(data) {
  const simulation = d3
    .forceSimulation(d => d.properties)
    .velocityDecay(0.2)
    .force(
      'x',
      d3
        .forceX()
        .strength(0.3)
        .x(window.innerWidth / 2)
    )
    .force(
      'y',
      d3
        .forceY()
        .strength(0.3)
        .y(window.innerHeight / 2)
    )
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);
}

window.addEventListener('DOMContentLoaded', () => {
  Promise.all([
    d3.json(
      '/government-types-map/assets/data/ma-municipal-government-forms-and-finances.json'
    ),
  ]).then(data => {
    const topology = topojson.feature(data[0], data[0].objects['layer1']);
    createMap(topology.features);
    addZoomToMaps();
    addUpdateButtons();
    // createForce(topology.features);
  });
});
