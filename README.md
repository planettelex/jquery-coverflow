# [Planet Telex (PT) Coverflow](http://www.planettelex.net/tools/jquery/coverflow/demos/)

Planet Telex  brings you the most fully featured JavaScript Coverflow plugin available. It is a jQuery UI widget that will display a succession of images with accompanying text titles in the style of an iTunes&reg;
 "Cover Flow" view. It is configurable in a numerous ways that can allow you to create a unique look for your site.

[Demos and Documentation](http://www.planettelex.net/tools/jquery/coverflow/demos/)

## Requirements
* jQuery 1.3.2+
* jQueryUI 1.8+ (Core, Widget, Effects Core)
	* Add the "Slider" widget if you want to see that feature on your site.


## Features

* Very simple setup requiring miminal markup.
* Cross-browser compatible with graceful degredation.
	* Chrome, Safari, Firefox 3.6+, Opera, IE7+
* Highly customizable via configuration, method API, and triggered events.
* Images added from the DOM or by JSON configuration or both.
* Image reflection and perspective are configurable and optional.
* Image categories and an optional menu that is fully CSS stylable.
* A slider with a handle that sizes according to the number of images.
* Autoplay mode and the ability to pause during mouse over.
* Extensive inline and accompanying documentation.


## Quick start

### Step 1

Include jQuery, jQuery UI, and jQuery UI CSS in your HTML.

	<script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>
	<script type="text/javascript" src="js/jquery-ui-1.8.17.custom.min.js"></script>
    <link type="text/css" href="css/ui-darkness/jquery-ui-1.8.17.custom.css" rel="Stylesheet" />

Include the PT Coverflow and its starter CSS in your HTML.

	<script type="text/javascript" src="js/jquery.ui.pt_coverflow-1.0.min.js"></script>
	<link type="text/css" href="css/jquery.ui.pt_coverflow-1.0.css" rel="stylesheet">

### Step 2

Create your HTML structure with a wrapper element that has the class "coverflow".  Add some images to your container including the title and subtitle as data attributes if you want those to be displayed.

    <div id="coverflow" class="coverflow">
        <!-- (Optional) Add additional controls. PT Coverflow leaves non-img tags in the container untouched, so you can absolute position them relative to the container. -->
        <div class="controls">
            <a id="previous" title="Previous Cover">&lsaquo;</a>
            <a id="next" title="Next Cover">&rsaquo;</a>
        </div>
        <!-- PT Coverflow uses all img tags in the container not nested in other elements. The alt tags are not used by coverflow, but should be rendered to be standards compliant and accessible. -->
        <img src="img/muse-the-resistance.jpg" alt="Muse, The Resistance" data-subtitle="Muse" data-title="The Resistance" />
        <img src="img/albertacross-thebrokensideoftime.jpg" alt="Alberta Cross, Broken Side of Time" data-subtitle="Alberta Cross" data-title="Broken Side of Time" />
        <img src="img/batforlashes-twosuns.jpg" alt="Bat For Lashes, Two Suns" data-subtitle="Bat For Lashes" data-title="Two Suns" />
        <img src="img/bjork-post.jpg" alt="Bjork, Post" data-subtitle="Bjork" data-title="Post" />
    </div>

### Step 3

Add the JavaScript to your page to hook up the PT Coverflow to your container.

    <script type="text/javascript">
        $(function () {
            // Instantiate PT Coverflow
            var $demo = $("#coverflow").coverflow();

            // (Optional) Attach control click events to the PT Coverflow API
            $("#previous").click(function () {
                $demo.coverflow("prevCover");
            });
            $("#next").click(function () {
                $demo.coverflow("nextCover");
            });
        });
    </script>

See the accompanying [demos](http://www.planettelex.net/tools/jquery/coverflow/demos/) for more complete examples.


## License

### Major components:

* jQuery, jQueryUI: MIT/GPL license

### Everything else:

    Copyright 2011 Planet Telex, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
