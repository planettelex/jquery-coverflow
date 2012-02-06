$(function () {
    // The default coverflow options
    var coverflowOptions = JSON.constructor({
        width: null,                // Display width of the coverflow. Defaults to the container width.
        height: null,               // Display height of the coverflow. Defaults to the container height.
        selectedIndex: 0,           // The index of the cover to select where 0 is the first
        autoplay: {
            enabled: false,
            interval: 3,            // Seconds between changing covers
            pauseOnMouseenter: true,
            playsPerCategory: 3     // Includes the first cover loaded in the category
        },
        categories: {
            enabled: false,
            defaultCategory: "Unknown", // Name of category applied to covers that don't have one specified.
            selectedCategory: null,     // Name of the category to select.
            renderTitles: true,
            rememberLastCover: true,    // Show the last cover displayed when returning to the category. This is always true when autoplay is enabled.
            delAnimationCount: 4,       // Number of old covers animated on remove during category change
            addAnimationRadius: 4       // Number of new covers animated on each side of the selected cover during category change
        },
        cover: {
            height: 300,            // Display height of each cover.
            width: 300,             // Display width of each cover.
            animation: {
                perspective: {
                    duration: 80,   // Milliseconds
                    inner: 120      // Percentage of duration
                },
                radius: 20          // Number of covers animated on each side of the selected cover
            },
            background: {
                size: 90,           // Percentage of original image
                overlap: {
                    inner: 20,      // Percentage of overlap
                    outer: 80       // Percentage of overlap
                }
            },
            perspective: {
                angle: 12,          // Angle in degrees from the outside corner to the center. The same value is applied to the top and bottom.
                enabled: true
            },
            reflection: {
                enabled: true,
                initialOpacity: 30, // Percentage 0(transparent) <=> 100(opaque)
                length: 80          // Percentage of original image
            },
            title: {
                enabled: true
            }
        },
        slider: {
            enabled: true,
            width: 80               // Percentage of the width of the coverflow container
        }
    });

    var numberOfCovers = $("#coverflow > img").length;
    var categories = [];
    $.each($("#coverflow > img"), function (index, value) {
        var category = value.dataset["category"] != null ? value.dataset["category"] : coverflowOptions.categories.defaultCategory;
        if ($.inArray(category, categories) == -1)
            categories.push(category);
    });

    // Set up accordion
    $("#optionsPanel").accordion({ collapsible: true });

    // Set up on/off switches
    $("#autoplay .onOffSwitch").iphoneSwitch(coverflowOptions.autoplay.enabled ? "on" : "off", turnOnAutoplay, turnOffAutoplay);
    $("#categories .onOffSwitch").iphoneSwitch(coverflowOptions.categories.enabled ? "on" : "off", turnOnCategories, turnOffCategories);
    $("#perspective .onOffSwitch").iphoneSwitch(coverflowOptions.cover.perspective.enabled ? "on" : "off", turnOnPerpective, turnOffPerpective);
    $("#reflections .onOffSwitch").iphoneSwitch(coverflowOptions.cover.reflection.enabled ? "on" : "off", turnOnReflections, turnOffReflections);
    $("#slider .onOffSwitch").iphoneSwitch(coverflowOptions.slider.enabled ? "on" : "off", turnOnSlider, turnOffSlider);
    $("#titles .onOffSwitch").iphoneSwitch(coverflowOptions.cover.title.enabled ? "on" : "off", turnOnTitles, turnOffTitles);

    // Set up select lists
    for (var i = 0; i < numberOfCovers; i++) {
        var selectOption = $("<option value='" + i + "'>" + i + "</option>");
        $("#startingIndex").append(selectOption.clone());
        if (i > 1) {
            $("#slideAnimationRadius").append(selectOption.clone());
            $("#animateIn").append(selectOption.clone());
            $("#animateOut").append(selectOption.clone());
        }
        if (i > 0) $("#flipsPerCategory").append(selectOption.clone());
    }
    $.each(categories, function (index, value) {
        var categorySelectOption = $("<option value='" + value + "'>" + value + "</option>");
        $("#startingCategory").append(categorySelectOption.clone());
    });

    // Set non-slider form values
    $("#coverWidth").val(coverflowOptions.cover.width);
    $("#coverHeight").val(coverflowOptions.cover.height);
    $("#startingIndex").val(Math.min(coverflowOptions.selectedIndex, numberOfCovers - 1));
    $("#slideAnimationRadius").val(Math.min(coverflowOptions.cover.animation.radius, numberOfCovers));
    $("#flipInterval").val(coverflowOptions.autoplay.interval);
    $("#flipsPerCategory").val(Math.min(coverflowOptions.autoplay.playsPerCategory, numberOfCovers));
    $("#pauseOnHover").prop("checked", coverflowOptions.autoplay.pauseOnMouseenter);
    $("#displayCategoriesNav").prop("checked", coverflowOptions.categories.renderTitles);
    $("#categoriesStateful").prop("checked", coverflowOptions.categories.rememberLastCover);
    $("#defaultCategory").val(coverflowOptions.categories.defaultCategory);
    if (coverflowOptions.categories.selectedCategory != null)
        $("#startingCategory").val(coverflowOptions.categories.selectedCategory);
    $("#animateIn").val(Math.min(coverflowOptions.categories.addAnimationRadius, numberOfCovers));
    $("#animateOut").val(Math.min(coverflowOptions.categories.delAnimationCount, numberOfCovers));

    // Set up sliders
    var $sliderBackgroundSize = $("#backgroundCoverSizeSlider").slider({
        value: coverflowOptions.cover.background.size - 100,
        min: -50,
        max: 50,
        step: 1,
        slide: function (event, ui) {
            $("#backgroundCoverSize").html(ui.value);
        }
    });
    var $sliderInnerOverlap = $("#innerCoverOverlapSlider").slider({
        value: coverflowOptions.cover.background.overlap.inner,
        min: -100,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#innerCoverOverlap").html(ui.value);
        }
    });
    var $sliderOuterOverlap = $("#outerCoverOverlapSlider").slider({
        value: coverflowOptions.cover.background.overlap.outer,
        min: -100,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#outerCoverOverlap").html(ui.value);
        }
    });
    var $sliderAngle = $("#angleSlider").slider({
        value: coverflowOptions.cover.perspective.angle,
        min: 0,
        max: 180,
        step: 1,
        slide: function (event, ui) {
            $("#angle").html(ui.value);
        }
    });
    var $sliderAnimationDuration = $("#animationDurationSlider").slider({
        value: coverflowOptions.cover.animation.perspective.duration,
        min: 0,
        max: 1000,
        step: 10,
        slide: function (event, ui) {
            $("#animationDuration").html(ui.value);
        }
    });
    var $sliderInnerCoverAnimationOffset = $("#innerCoverAnimationOffsetSlider").slider({
        value: coverflowOptions.cover.animation.perspective.inner - 100,
        min: -100,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#innerCoverAnimationOffset").html(ui.value);
        }
    });
    var $sliderInitialOpacity = $("#initialOpacitySlider").slider({
        value: coverflowOptions.cover.reflection.initialOpacity,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#initialOpacity").html(ui.value);
        }
    });
    var $sliderReflectionLength = $("#reflectionLengthSlider").slider({
        value: coverflowOptions.cover.reflection.length,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#reflectionLength").html(ui.value);
        }
    });
    var $sliderSliderWidth = $("#sliderWidthSlider").slider({
        value: coverflowOptions.slider.width,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#sliderWidth").html(ui.value);
        }
    });
    $("#backgroundCoverSize").html(coverflowOptions.cover.background.size - 100);
    $("#innerCoverOverlap").html(coverflowOptions.cover.background.overlap.inner);
    $("#outerCoverOverlap").html(coverflowOptions.cover.background.overlap.outer);
    $("#angle").html(coverflowOptions.cover.perspective.angle);
    $("#animationDuration").html(coverflowOptions.cover.animation.perspective.duration);
    $("#innerCoverAnimationOffset").html(coverflowOptions.cover.animation.perspective.inner);
    $("#initialOpacity").html(coverflowOptions.cover.reflection.initialOpacity);
    $("#reflectionLength").html(coverflowOptions.cover.reflection.length);
    $("#sliderWidth").html(coverflowOptions.slider.width);

    // Set visibile areas
    if (!coverflowOptions.autoplay.enabled) turnOffAutoplay();
    if (!coverflowOptions.categories.enabled) turnOffCategories();
    if (!coverflowOptions.cover.perspective.enabled) turnOffPerpective();
    if (!coverflowOptions.cover.reflection.enabled) turnOffReflections();
    if (!coverflowOptions.slider.enabled) turnOffSlider();
    if (!coverflowOptions.cover.title.enabled) turnOffTitles();

    // On/Off functions
    function turnOnAutoplay() {
        coverflowOptions.autoplay.enabled = true;
        $("#autoplay ul").show();
        $("#autoplay > p").hide();
    }
    function turnOffAutoplay() {
        coverflowOptions.autoplay.enabled = false;
        $("#autoplay ul").hide();
        $("#autoplay > p").show();
    }
    function turnOnCategories() {
        coverflowOptions.categories.enabled = true;
        $("#categories ul").show();
        $("#categories > p").hide();
        $("#flipsPerCategory").removeAttr("disabled");
    }
    function turnOffCategories() {
        coverflowOptions.categories.enabled = false;
        $("#categories ul").hide();
        $("#categories > p").show();
        $("#flipsPerCategory").attr("disabled", "disabled");
    }
    function turnOnPerpective() {
        coverflowOptions.cover.perspective.enabled = true;
        $("#perspective ul").show();
        $("#perspective > p").hide();
    }
    function turnOffPerpective() {
        coverflowOptions.cover.perspective.enabled = false;
        $("#perspective ul").hide();
        $("#perspective > p").show();
    }
    function turnOnReflections() {
        coverflowOptions.cover.reflection.enabled = true;
        $("#reflections ul").show();
        $("#reflections > p").hide();
    }
    function turnOffReflections() {
        coverflowOptions.cover.reflection.enabled = false;
        $("#reflections ul").hide();
        $("#reflections > p").show();
    }
    function turnOnSlider() {
        coverflowOptions.slider.enabled = true;
        $("#slider ul").show();
        $("#slider > p").hide();
    }
    function turnOffSlider() {
        coverflowOptions.slider.enabled = false;
        $("#slider ul").hide();
        $("#slider > p").show();
    }
    function turnOnTitles() {
        coverflowOptions.cover.title.enabled = true;
        $("#titles > p").hide();
    }
    function turnOffTitles() {
        coverflowOptions.cover.title.enabled = false;
        $("#titles > p").show();
    }

    // Update options from form
    function updateOptions() {
        coverflowOptions.selectedIndex = $("#startingIndex").val();
        coverflowOptions.autoplay.interval = $("#flipInterval").val();
        coverflowOptions.autoplay.pauseOnMouseenter = $("#pauseOnHover").prop("checked");
        coverflowOptions.autoplay.playsPerCategory = $("#flipsPerCategory").val();
        coverflowOptions.categories.defaultCategory = $("#defaultCategory").val();
        coverflowOptions.categories.selectedCategory = ($("#startingCategory").val() == "- Not set -") ? null : $("#startingCategory").val();
        coverflowOptions.categories.renderTitles = $("#displayCategoriesNav").prop("checked");
        coverflowOptions.categories.rememberLastCover = $("#categoriesStateful").prop("checked");
        coverflowOptions.categories.delAnimationCount = $("#animateOut").val();
        coverflowOptions.categories.addAnimationRadius = $("#animateIn").val();
        coverflowOptions.cover.height = $("#coverHeight").val();
        coverflowOptions.cover.width = $("#coverWidth").val();
        coverflowOptions.cover.animation.radius = $("#slideAnimationRadius").val();
        coverflowOptions.cover.animation.perspective.duration = $sliderAnimationDuration.slider("value");
        coverflowOptions.cover.animation.perspective.inner = $sliderInnerCoverAnimationOffset.slider("value");
        coverflowOptions.cover.background.size = $sliderBackgroundSize.slider("value") + 100;
        coverflowOptions.cover.background.overlap.inner = $sliderInnerOverlap.slider("value");
        coverflowOptions.cover.background.overlap.outer = $sliderOuterOverlap.slider("value");
        coverflowOptions.cover.perspective.angle = $sliderAngle.slider("value");
        coverflowOptions.cover.reflection.initialOpacity = $sliderInitialOpacity.slider("value");
        coverflowOptions.cover.reflection.length = $sliderReflectionLength.slider("value");
        coverflowOptions.slider.width = $sliderSliderWidth.slider("value");
    }

    // Initialize coverflow
    var $coverflow = $("#coverflow").coverflow(coverflowOptions);

    // Refresh coverflow
    $("#refreshCoverflow").click(function () {
        $coverflow.coverflow("destroy");
        updateOptions();
        $coverflow = $("#coverflow").coverflow(coverflowOptions);
    });

    // View/edit JSON
    function setJsonView() {
        var jsonString = JSON.stringify(coverflowOptions);
        $("#jsonView pre").html(jsonString);
        SyntaxHighlighter.all();
    }
    SyntaxHighlighter.all();
    $("#viewEditJson").fancybox({
        overlayColor: '#000',
        onStart: setJsonView
    });

});