/*
- Add proper history management
*/

function activateSection(id) {
  history.pushState(null, '', location.origin + '/wordpress/' + id)
  htmlCollectionIterator(document.getElementsByClassName('active'), function(e) {
    e.className = e.className.split('active').join('').trim()
  })
  var element = document.getElementById(id)
  element.className = element.className + ' active'
}

/* Add nav events */
htmlCollectionIterator(document.getElementsByClassName('nav-buttons'), function(e) {
  e.addEventListener('click', function(event) {
    event.prevent
    activateSection(e.dataset.sectionId)
  })

})

function loadSvg(destinationContainerElement, assetName) {
  return fetch(assetName)
    .then(function(res) { return res.text() })
    .then(function(text) { return destinationContainerElement.innerHTML = text })
}

function htmlCollectionIterator(collection, cb) {
  var i = collection.length
  while (i-- > 0) { cb(collection[i], i) }
}

function loadAllSvgs() {
  var loadableSvgContainers = document.getElementsByClassName('loadable-svg-container')
  var promises = []
  htmlCollectionIterator(loadableSvgContainers, function(element) {
    var assetName = element.dataset.svgAssetName
    promises.push(loadSvg(element, assetName))
  })
  return Promise.all(promises)
}

var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
filter.id = 'turbulence-1'
filter.innerHTML = '\
<feTurbulence type="fractalNoise" baseFrequency="0.001" numOctaves="2" data-filterId="3">\
<animate attributeName="baseFrequency" values="0.01; 0.015; 0.02; 0.025; 0.03; 0.025; 0.02; 0.015" repeatCount="indefinite" dur="0.25s"/>\
</feTurbulence>\
<feDisplacementMap xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" scale="25" />\
'

function makeItWiggle() {
  var wiggler = document.querySelector('#brainLines svg')
  wiggler.appendChild(filter)
  htmlCollectionIterator(wiggler.childNodes, function(element) {
    if (element.tagName !== 'FILTER') { element.style.filter = 'url(#turbulence-1)' }
  })
}
loadAllSvgs()
  .then(makeItWiggle)

var sections = document.getElementsByTagName('section')
htmlCollectionIterator(sections, function(element) {
  element.addEventListener('transitionend', function() {
    element.className = element.className.match('active') ? 'hidden' : 'active'
  }, false)
})

fetch('index.php/wp-json/wp/v2/posts')
  .then(function(res) { res.json() })
  .then(function(res) {
    console.log(res)
    var content = res.reduce(function(acc, article) { return acc + '<h2>' + article.title.rendered + '</h2>' + article.content.rendered }, '')
    document.getElementById('blogs').innerHTML = content
  })
