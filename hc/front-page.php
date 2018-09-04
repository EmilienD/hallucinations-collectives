<!DOCTYPE html>
<html>
<head>
  <meta charset="utf8" />
  <title>Hallucinations Collectives</title>
  <link href="<?php echo get_bloginfo('template_directory'); ?>/custom.css" rel="stylesheet">
  <link rel="shortcut icon" href="<?php echo get_bloginfo('template_directory'); ?>/assets/favicon.png" type="image/x-icon">
  <!-- UNCOMMENT FOR PROD -->
  <!-- <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.4/fetch.min.js"></script> -->
</head>
<body>
  <div class="page" id="home">
    <div class="radiation-container">
      <div class="loadable-svg-container radiation" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/radiations.svg"></div>
    </div>
    <div class="layer loadable-svg-container" id="brain" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/brain.svg"></div>
    <div class="rotating-logo layer loadable-svg-container" id="homeLogo" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/logo.svg"></div>
    <div class="layer brain-lines">
      <div class="loadable-svg-container wiggle" id="magazineLines" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/MagazineLines.svg"></div>
      <div class="loadable-svg-container wiggle" id="festivalLines" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/FestivalLines.svg"></div>
    </div>
  </div>
  <div class="page" id="main">
    <div class="frame">
      <div class="column-left">
        <div class="rotating-logo loadable-svg-container" id="mainLayoutLogo" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/logoblog.svg"></div>
        <div class="raining-lane">
          <div class="raindrop-container">
            <div class="loadable-svg-container" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/goutte.svg"></div>
            <div class="loadable-svg-container" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/goutte.svg"></div>
            <div class="loadable-svg-container" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/goutte.svg"></div>
            <div class="loadable-svg-container" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/goutte.svg"></div>
            <div class="loadable-svg-container" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/goutte.svg"></div>
            <div class="loadable-svg-container" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/goutte.svg"></div>
          </div>
        </div>
      </div>
      <div class="column-right">
        <div class="top-line">
          <div>
            <div class="loadable-svg-container flag" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/drapeauwebzine.svg"></div>
            <nav>
              <ul>
                <li><a class="nav-buttons" data-section-id="podcasts">podcasts</a></li>
                <li><a class="nav-buttons" data-section-id="reviews">reviews</a></li>
                <li><a class="nav-buttons" data-section-id="articles">articles</a></li>
                <li><a class="nav-buttons" data-section-id="blogs">blogs</a></li>
                <li><a class="nav-buttons" data-section-id="festival">festival</a></li>
              </ul>
            </nav>
          </div>
        </div>
        <section class="content" id="podcasts">podcasts</section>
        <section class="content" id="reviews">reviews</section>
        <section class="content" id="articles">articles</section>
        <section class="content" id="blogs"></section>
        <section class="content" id="festival">festival</section>
      </div>
    </div>
  </div>
  <div class="page" id="post">
    <div id="postInnerContainer"></div>
  </div>
  <div class="page" id="fourZeroFour">
    <h1>
      <a href="/">Nothing to see here, click me to go to the home page.</a>
      <a href="/" id="fourZeroFourBackLink">Or here to go back.</a>
    </h1>
  </div>
  <script type="text/javascript" src="<?php echo get_bloginfo('template_directory'); ?>/index.js"></script>
</body>
</html>
