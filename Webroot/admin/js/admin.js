$(function () {
    // The default coverflow options
    var coverflowOptions = JSON.constructor({
        width: null,
        height: null,
        selectedIndex: 0,
        autoplay: {
            enabled: false,
            interval: 3,            // seconds between covers
            pauseOnMouseenter: true,
            playsPerCategory: 3     // Includes the first cover loaded in the category
        },
        categories: {
            enabled: false,
            defaultCategory: "Unknown",
            selectedCategory: null,
            renderTitles: true,
            rememberLastCover: true, // This is always true when autoplay is enabled
            delAnimationCount: 4,   // The number of old covers animated on remove during category change
            addAnimationRadius: 4   // The number of new covers animated on each side of the selected cover during category change
        },
        cover: {
            angle: 12,              // degrees
            height: 300,
            width: 300,
            animation: {
                perspective: {
                    duration: 80,   // milliseconds
                    inner: 120      // percentage of duration
                },
                radius: 20          // The number of covers animated on each side of the selected cover
            },
            background: {
                size: 90            // percentage of original image
            },
            overlap: {
                inner: 20, 	        // percentage of overlap
                outer: 80           // percentage of overlap
            },
            perspective: {
                enabled: true
            },
            reflection: {
                enabled: true,
                initialOpacity: 30, // percentage 0(transparent) <=> 100(opaque)
                length: 80          // percentage of original image
            },
            title: {
                enabled: true
            }
        },
        slider: {
            enabled: true,
            width: 80               // percentage of width
        }
    });

    
    // Set up accordion
    $("#optionsPanel").accordion({ collapsible: true });
    // Set up on/off switches
    $("#autoplay .onOffSwitch").iphoneSwitch("off", turnOnAutoplay, turnOffAutoplay);
    $("#categories .onOffSwitch").iphoneSwitch("off", turnOnCategories, turnOffCategories);
    $("#perspective .onOffSwitch").iphoneSwitch("on", turnOnPerpective, turnOffPerpective);
    $("#reflections .onOffSwitch").iphoneSwitch("on", turnOnReflections, turnOffReflections);
    $("#slider .onOffSwitch").iphoneSwitch("on", turnOnSlider, turnOffSlider);
    $("#titles .onOffSwitch").iphoneSwitch("on", turnOnTitles, turnOffTitles);
    // Set up sliders
    $("#backgroundCoverSizeSlider").slider({
        value: coverflowOptions.cover.background.size - 100,
        min: -50,
        max: 50,
        step: 1,
        slide: function (event, ui) {
            $("#backgroundCoverSize").html(ui.value);
        }
    });
    $("#innerCoverOverlapSlider").slider({
        value: 0,
        min: -100,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#innerCoverOverlap").html(ui.value);
        }
    });
    $("#outerCoverOverlapSlider").slider({
        value: 0,
        min: -100,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#outerCoverOverlap").html(ui.value);
        }
    });
    $("#angleSlider").slider({
        value: 12,
        min: 0,
        max: 180,
        step: 1,
        slide: function (event, ui) {
            $("#angle").html(ui.value);
        }
    });
    $("#animationDurationSlider").slider({
        value: 80,
        min: 0,
        max: 1000,
        step: 10,
        slide: function (event, ui) {
            $("#animationDuration").html(ui.value);
        }
    });
    $("#innerCoverAnimationOffsetSlider").slider({
        value: 0,
        min: -100,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#innerCoverAnimationOffset").html(ui.value);
        }
    });
    $("#initialOpacitySlider").slider({
        value: 30,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#initialOpacity").html(ui.value);
        }
    });
    $("#reflectionLengthSlider").slider({
        value: 80,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#reflectionLength").html(ui.value);
        }
    });
    $("#sliderWidthSlider").slider({
        value: 80,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#sliderWidth").html(ui.value);
        }
    });
    // Set up select lists

    var $coverflow = $("#coverflow").coverflow();

    function turnOnAutoplay() {
        console.log("turn on autoplay");
        $("#autoplay ul").show();
        $("#autoplay > p").hide();
    }
    function turnOffAutoplay() {
        console.log("turn off autoplay");
        $("#autoplay ul").hide();
        $("#autoplay > p").show();
    }
    function turnOnCategories() {
        console.log("turn on categories");
        $("#categories ul").show();
        $("#categories > p").hide();
        $("#flipsPerCategory").removeAttr("disabled");
    }
    function turnOffCategories() {
        console.log("turn off categories");
        $("#categories ul").hide();
        $("#categories > p").show();
        $("#flipsPerCategory").attr("disabled", "disabled");
    }
    function turnOnPerpective() {
        console.log("turn on perspective");
        $("#perspective ul").show();
        $("#perspective > p").hide();
    }
    function turnOffPerpective() {
        console.log("turn off perspective");
        $("#perspective ul").hide();
        $("#perspective > p").show();
    }
    function turnOnReflections() {
        console.log("turn on reflections");
        $("#reflections ul").show();
        $("#reflections > p").hide();
    }
    function turnOffReflections() {
        console.log("turn off reflections");
        $("#reflections ul").hide();
        $("#reflections > p").show();
    }
    function turnOnSlider() {
        console.log("turn on slider");
        $("#slider ul").show();
        $("#slider > p").hide();
    }
    function turnOffSlider() {
        console.log("turn off slider");
        $("#slider ul").hide();
        $("#slider > p").show();
    }
    function turnOnTitles() {
        console.log("turn on titles");
        $("#titles > p").hide();
    }
    function turnOffTitles() {
        console.log("turn off titles");
        $("#titles > p").show();
    }
});