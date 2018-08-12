

  function showTitleOnHover() {
    var i = 4;
    while (i-- > 0) {
    }
  }
  showTitleOnHover()

  function loadSvg(destinationContainerElement, assetName) {
    return fetch('../assets/' + assetName)
      .then(res => res.text())
      .then(text => destinationContainerElement.innerHTML = text)
  }

  function htmlCollectionIterator(collection, cb) {
    var i = collection.length
    while (i-- > 0) { cb(collection[i], i) }
  }

  function loadAllSvgs() {
    var loadableSvgContainers = document.getElementsByClassName('loadable-svg-container')
    var promises = [];
    htmlCollectionIterator(loadableSvgContainers, function (element) {
      var assetName = element.dataset.svgAssetName
      promises.push(loadSvg(element, assetName))
    })
    return Promise.all(promises)
  }

    var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
    filter.id = 'turbulence-1'
    filter.innerHTML = `
<feTurbulence type="fractalNoise" baseFrequency="0.001" numOctaves="2" data-filterId="3">
<animate attributeName="baseFrequency" values="0.01; 0.015; 0.02; 0.025; 0.03; 0.025; 0.02; 0.015" repeatCount="indefinite" dur="0.25s"/>
</feTurbulence>
<feDisplacementMap xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" scale="25" />
`
  function makeItWiggle() {
    var wiggler = document.querySelector('#brainLines svg')
    wiggler.appendChild(filter)
    htmlCollectionIterator(wiggler.childNodes, function (element) {
      if (element.tagName !== 'FILTER')element.style.filter = 'url(#turbulence-1)'
    })
    // wiggler.prepend(g)
  }
  loadAllSvgs()
  .then(makeItWiggle)
