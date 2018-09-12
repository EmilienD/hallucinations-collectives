// consts
var pagesId = {
  ZINE: 'zine',
  HOME: 'home',
  POST: 'post',
  DEFAULT: 'home',
  FOUR_ZERO_FOUR: 'fourZeroFour',
}

// state management
function State(firstState) {
  this.state = firstState || {}
  this.previousState = {}
  this.listeners = []
}

function updateState(newState, replace) {
  showState(newState)
  if (JSON.stringify(newState) === JSON.stringify(history.state)) { return }
  var url = location.origin + makePath(
    newState.page,
    newState.section,
    newState.post && newState.post.slug
  )
  replace ? history.replaceState(newState, '', url) : history.pushState(newState, '', url)
}

function showState(state) {
  (pageSwitch[state.page] || pageSwitch[pagesId.FOUR_ZERO_FOUR])(state)
}

var pageSwitch = {
  zine: function(state) {
    showPage(state.page)
    activateSection(state.section)
  },
  home: function(state) {
    showPage(state.page)
  },
  post: function(state) {
    showPage(state.page)
    displayPost(state.post)
  },
  fourZeroFour: function(state) {
    showPage(state.page)
  }
}

function makePath() {
  return Array.prototype.slice.call(arguments).reduce(function(acc, pathElement) {
    var newString = acc
    if (pathElement) {
      if (acc.slice(-1) !== '/' && pathElement.charAt(0) !== '/') { newString += '/' }
      newString += pathElement
    }
    return newString
  }, '')
}

function applyUrlToState() {
  var pathItems = location.pathname.split('/').filter(function(s) { return s })
  var page = pathItems.shift() || pagesId.DEFAULT
  var lastItem = pathItems.shift()
  if (page === pagesId.POST) {
    fetchPosts('slug=' + lastItem)
      .then(function(postList) {
        var state = {
          page: page,
          post: postList.shift(),
        }
        updateState(state, true)
      })
      .catch(console.log)
  }
  else {
    updateState({
      page: page,
      section: lastItem,
    }, true)
  }
}

applyUrlToState()

// DOM manipulations

function activateSection(id) {
  htmlCollectionIterator(document.getElementsByTagName('section'), function(e) {
    e.className = e.className.split('active').join('').trim()
  })
  if (id) {
    var element = document.getElementById(id)
    if (element) { element.className = element.className + ' active' }
    else {
      updateState({
        page: pagesId.FOUR_ZERO_FOUR,
      }, true)
    }
  }
}

function showPage(id) {
  htmlCollectionIterator(document.getElementsByClassName('page'), function(e) {
    e.className = e.className.split('active').join('').trim()
  })
  // elements with id have a variable with the same name as the id
  var element = document.getElementById(id) || fourZeroFour // eslint-disable-line no-undef
  element.className = element.className + ' active'
}

function displayPost(post) {
  if (!post) { return }
  postInnerContainer.innerHTML = // eslint-disable-line no-undef
    '<h1>' + post.title.rendered + '</h1>' +
    post.content.rendered
}

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
<feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" data-filterId="3">\
<animate attributeName="baseFrequency" values="0.01; 0.015; 0.02; 0.025; 0.03; 0.025; 0.02; 0.015" repeatCount="indefinite" dur="1s"/>\
</feTurbulence>\
<feDisplacementMap xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" scale="10" />\
'

function makeItWiggle() {
  var wigglers = document.getElementsByClassName('wiggle')
  htmlCollectionIterator(wigglers, function(wigglerParent) {
    var wiggler = wigglerParent.firstChild
    wiggler.appendChild(filter)
    htmlCollectionIterator(wiggler.childNodes, function(element) {
      if (element.tagName !== 'FILTER') { element.style.filter = 'url(#turbulence-1)' }
    })
  })
}
loadAllSvgs()
  .then(addActionsToHomeMenu)
  .then(makeItWiggle)

var sections = document.getElementsByTagName('section')
htmlCollectionIterator(sections, function(element) {
  element.addEventListener('transitionend', function() {
    element.className = element.className.match('active') ? 'hidden' : 'active'
  }, false)
})

fetchPosts('page=1&categories=1')
  .then(function(res) {
    var list = createPostList(res)
    document.getElementById('articles').appendChild(list)
  })
  .catch(function(err) { console.log(err) })

/* Add event listeners */
htmlCollectionIterator(document.getElementsByClassName('nav-buttons'), function(e) {
  e.addEventListener('click', updateState.bind(null, { page: pagesId.ZINE, section: e.dataset.sectionId }, false))
})
mainLayoutLogo.addEventListener('click', function() { updateState({ page: pagesId.HOME }) }) // eslint-disable-line no-undef
fourZeroFourBackLink.addEventListener('click', function(event) { // eslint-disable-line no-undef
  event.preventDefault()
  history.back()
})

/* Renderers */
function createPostList(posts) {
  var ol = document.createElement('ol')
  ol.className = 'post-list'
  posts.forEach(function(post) {
    var builtPost = createPostListElement(post)
    var li = document.createElement('li')
    li.appendChild(builtPost)
    ol.appendChild(li)
  })
  return ol
}

function createPostListElement(post) {
  var li = document.createElement('li')
  var a = document.createElement('a')
  li.appendChild(a)
  a.className = 'post-link'
  a.addEventListener('click', function(event) {
    updateState({ page: pagesId.POST, post: post })
    event.preventDefault()
  })
  a.href = location.origin + '/posts/' + post.slug
  a.innerHTML = '<h2>' + post.title.rendered + '</h2>' + post.excerpt.rendered
  return a
}

function addActionsToHomeMenu() {
  var zine = ['articles', 'interviews', 'podcasts', 'lists', 'playlists', 'zineinfos']
  var fest = ['presentation', 'programmation', 'tickets', 'festinfos', 'contact']
  htmlCollectionIterator(homeMenuZine.firstChild.children, function(g, i) { // eslint-disable-line no-undef
    g.addEventListener('click', function() { updateState({ page: pagesId.ZINE, section: zine[i] }) })
  })
  htmlCollectionIterator(homeMenuFest.firstChild.children, function(g, i) { // eslint-disable-line no-undef
    g.addEventListener('click', function() { updateState({ page: pagesId.ZINE, section: fest[i] }) })
  })
}

function fetchPosts(queryString) {
  return fetch(location.origin + '/wp-json/wp/v2/posts' +
      (queryString ? '?' + queryString : '')
  )
    .then(function(res) { return res.json() })
}

function hide(element) { element.className = element.className + ' hidden' }

function unhide(element) { element.className = element.className.split('hidden').join('').trim() }

function hideUnhide(hideElement, unhideElement) {
  hide(hideElement)
  unhide(unhideElement)
}

homeMenuZine.addEventListener('mouseenter', function(event) { hideUnhide(magazineLines, event.target) }) // eslint-disable-line no-undef
homeMenuZine.addEventListener('mouseleave', function(event) { hideUnhide(event.target, magazineLines) }) // eslint-disable-line no-undef

homeMenuFest.addEventListener('mouseenter', function(event) { hideUnhide(festivalLines, event.target) }) // eslint-disable-line no-undef
homeMenuFest.addEventListener('mouseleave', function(event) { hideUnhide(event.target, festivalLines) }) // eslint-disable-line no-undef

function fetchCategories() {
  return fetch('/wp-json/wp/v2/categories')
    .then(function(res) { return res.json() })
    .then(console.log)
}

fetchCategories()
  .then(function(categories) {
    var liContainer = document.createDocumentFragment()
    categories.forEach(function(cat) {
      var li = document.createElement('li')
      var a = document.createElement('a')
      li.appendChild(a)
      a.innerText = cat.name
      a.href = [location.origin, pagesId.ZINE, 'articles?cat=' + cat.id].join('/')
      liContainer.appendChild(li)
    })
  })
