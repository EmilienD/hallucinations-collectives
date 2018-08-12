<!DOCTYPE html>
<html>
<head>
  <meta charset="utf8" />
  <title>Hallucinations Collectives</title>
  <link href="<?php echo get_bloginfo('template_directory'); ?>/custom.css" rel="stylesheet">
  <link rel="shortcut icon" href="<?php echo get_bloginfo('template_directory'); ?>/assets/favicon.png" type="image/x-icon">
  <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.4/fetch.min.js"></script>
</head>
<body>
  <section id="menu-container" class="active">
    <div class="left title">
    </div>
    <div class="layer loadable-svg-container" id="brain" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/brain.svg"></div>
    <div class="rotating-logo layer loadable-svg-container" id="homeLogo" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/logo.svg"></div>
    <div class="layer loadable-svg-container" id="brainLines" data-svg-asset-name="<?php echo get_bloginfo('template_directory'); ?>/assets/brainlines.svg"></div>
    <div class="right title"></div>
  </section>
  <section id="blog"></section>
  <script type="text/javascript" src="<?php echo get_bloginfo('template_directory'); ?>/index.js"></script>
</body>
</html>
