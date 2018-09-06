// consts
var pagesId = {
  MAIN: 'main',
  HOME: 'home',
  POST: 'post',
  DEFAULT: 'home',
  FOUR_ZERO_FOUR: 'fourZeroFour',
}

// state management
window.onpopstate = function(event) {
  showState(event.state)
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
  main: function(state) {
    showPage(pagesId.MAIN)
    activateSection(state.section)
  },
  home: function(state) {
    showPage(pagesId.HOME)
  },
  post: function(state) {
    showPage(pagesId.POST)
    displayPost(state.post)
  },
  home: function(state) {
    showPage(pagesId.HOME)
  },
  fourZeroFour: function() {
    showPage(pagesId.FOUR_ZERO_FOUR)
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
      .then(function(res) { return res.json() })
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
  postInnerContainer.innerHTML =
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
    console.log(res.headers.get('X-WP-TotalPages'))
    return res.json()
  })
  .then(function(res) {
    var list = createPostList(res)
    document.getElementById('articles').appendChild(list)
  })
  .catch((err) => console.log(err))

/* Add event listeners */
htmlCollectionIterator(document.getElementsByClassName('nav-buttons'), function(e) {
  e.addEventListener('click', updateState.bind(null, { page: pagesId.MAIN, section: e.dataset.sectionId }, false))
})
mainLayoutLogo.addEventListener('click', function() { updateState({ page: pagesId.HOME }) }) // eslint-disable-line no-undef
fourZeroFourBackLink.addEventListener('click', function(event) {
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
  const zine = ['articles', 'interviews', 'podcasts', 'lists', 'playlists', 'zineinfos']
  const fest = ['presentation', 'programmation', 'tickets', 'festinfos', 'contact']
  htmlCollectionIterator(homeMenuZine.firstChild.children, function(g, i) {
    g.addEventListener('click', function() { updateState({ page: pagesId.MAIN, section: zine[i] }) })
  })
  htmlCollectionIterator(homeMenuFest.firstChild.children, function(g, i) {
    g.addEventListener('click', function() { updateState({ page: pagesId.MAIN, section: fest[i] }) })
  })
}

function fetchPosts(queryString) {
  return fetch(location.origin + '/wp-json/wp/v2/posts' +
    ('?' + queryString || '')
  )
}
