// Declare and initialize variables.
var coverflowOptions = {            // This are the default options.
    width: null,                    // Display width of the coverflow. Defaults to the container width.
    height: null,                   // Display height of the coverflow. Defaults to the container height.
    selectedIndex: 0,               // The index of the cover to select where 0 is the first.
    autoplay: {
        enabled: false,
        interval: 3,                // Seconds between changing covers.
        pauseOnMouseenter: true,
        playsPerCategory: 3         // Includes the first cover loaded in the category.
    },
    categories: {
        enabled: false,
        defaultCategory: "Unknown", // Name of category applied to covers that don't have one specified.
        selectedCategory: null,     // Name of the category to select.
        renderTitles: true,
        rememberLastCover: true,    // Show the last cover displayed when returning to the category. This is always true when autoplay is enabled.
        delAnimationCount: 4,       // Number of old covers animated on remove during category change.
        addAnimationRadius: 4       // Number of new covers animated on each side of the selected cover during category change.
    },
    cover: {
        height: 300,                // Display height of each cover.
        width: 300,                 // Display width of each cover.
        animation: {
            perspective: {
                duration: 80,       // Milliseconds
                inner: 120          // Percentage of duration.
            },
            radius: 20              // Number of covers animated on each side of the selected cover.
        },
        background: {
            size: 90,               // Percentage of original image.
            overlap: {
                inner: 20,          // Percentage of overlap.
                outer: 80           // Percentage of overlap.
            }
        },
        perspective: {
            angle: 12,              // Angle in degrees from the outside corner to the center. The same value is applied to the top and bottom.
            enabled: true
        },
        reflection: {
            enabled: true,
            initialOpacity: 30,     // Percentage 0(transparent) <=> 100(opaque)
            length: 80              // Percentage of original image.
        },
        title: {
            enabled: true
        }
    },
    slider: {
        enabled: true,
        width: 80                   // Percentage of the width of the coverflow container.
    }
};

var numberOfCovers = 0;
var categories = [];
var $autoplaySwitch, $categoriesSwitch, $perspectiveSwitch, $reflectionsSwitch, $sliderSwitch, $titleSwitch;
var $sliderBackgroundSize, $sliderInnerOverlap, $sliderOuterOverlap, $sliderAngle, $sliderAnimationDuration, $sliderInnerCoverAnimationOffset, $sliderInitialOpacity, $sliderReflectionLength, $sliderSliderWidth;

// Define section on/off functions
function turnOnAutoplay() {
    $("#coverflowOptionsAdminPanel #autoplay ul").show();
    $("#coverflowOptionsAdminPanel #autoplay > p").hide();
    if (!coverflowOptions.autoplay.enabled) {
        coverflowOptions.autoplay.enabled = true;
        $autoplaySwitch.data("toggleSwitch").turnOn();
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    }
}
function turnOffAutoplay() {
    $("#coverflowOptionsAdminPanel #autoplay ul").hide();
    $("#coverflowOptionsAdminPanel #autoplay > p").show();
    if (coverflowOptions.autoplay.enabled) {
        coverflowOptions.autoplay.enabled = false;
        $autoplaySwitch.data("toggleSwitch").turnOff();
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    }
}
function turnOnCategories() {
    $("#coverflowOptionsAdminPanel #categories ul").show();
    $("#coverflowOptionsAdminPanel #categories > p").hide();
    $("#coverflowOptionsAdminPanel #flipsPerCategory").removeAttr("disabled");
    if (!coverflowOptions.categories.enabled) {
        coverflowOptions.categories.enabled = true;
        $categoriesSwitch.data("toggleSwitch").turnOn();
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    }
}
function turnOffCategories() {
    $("#coverflowOptionsAdminPanel #categories ul").hide();
    $("#coverflowOptionsAdminPanel #categories > p").show();
    $("#coverflowOptionsAdminPanel #flipsPerCategory").attr("disabled", "disabled");
    if (coverflowOptions.categories.enabled) {
        coverflowOptions.categories.enabled = false;
        $categoriesSwitch.data("toggleSwitch").turnOff();
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    }
}
function turnOnPerpective() {
    $("#coverflowOptionsAdminPanel #perspective ul").show();
    $("#coverflowOptionsAdminPanel #perspective > p").hide();
    if (!coverflowOptions.cover.perspective.enabled) {
        coverflowOptions.cover.perspective.enabled = true;
        $perspectiveSwitch.data("toggleSwitch").turnOn();
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    }
}
function turnOffPerpective() {
    $("#coverflowOptionsAdminPanel #perspective ul").hide();
    $("#coverflowOptionsAdminPanel #perspective > p").show();
    if (coverflowOptions.cover.perspective.enabled) {
        coverflowOptions.cover.perspective.enabled = false;
        $perspectiveSwitch.data("toggleSwitch").turnOff();
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    }
}
function turnOnReflections() {
    $("#coverflowOptionsAdminPanel #reflections ul").show();
    $("#coverflowOptionsAdminPanel #reflections > p").hide();
    if (!coverflowOptions.cover.reflection.enabled) {
        coverflowOptions.cover.reflection.enabled = true;
        $reflectionsSwitch.data("toggleSwitch").turnOn();
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    }
}
function turnOffReflections() {
    $("#coverflowOptionsAdminPanel #reflections ul").hide();
    $("#coverflowOptionsAdminPanel #reflections > p").show();
    if (coverflowOptions.cover.reflection.enabled) {
        coverflowOptions.cover.reflection.enabled = false;
        $reflectionsSwitch.data("toggleSwitch").turnOff();
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    }
}
function turnOnSlider() {
    $("#coverflowOptionsAdminPanel #slider ul").show();
    $("#coverflowOptionsAdminPanel #slider > p").hide();
    if (!coverflowOptions.slider.enabled) {
        coverflowOptions.slider.enabled = true;
        $sliderSwitch.data("toggleSwitch").turnOn();
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    }
}
function turnOffSlider() {
    $("#coverflowOptionsAdminPanel #slider ul").hide();
    $("#coverflowOptionsAdminPanel #slider > p").show();
    if (coverflowOptions.slider.enabled) {
        coverflowOptions.slider.enabled = false;
        $sliderSwitch.data("toggleSwitch").turnOff();
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    }
}
function turnOnTitles() {
    $("#coverflowOptionsAdminPanel #titles > p").hide();
    if (!coverflowOptions.cover.title.enabled) {
        coverflowOptions.cover.title.enabled = true;
        $titleSwitch.data("toggleSwitch").turnOn();
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    }
}
function turnOffTitles() {
    $("#coverflowOptionsAdminPanel #titles > p").show();
    if (coverflowOptions.cover.title.enabled) {
        coverflowOptions.cover.title.enabled = false;
        $titleSwitch.data("toggleSwitch").turnOff();
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    }
}

// Update options from form
function updateOptions() {
    coverflowOptions.selectedIndex = parseInt($("#coverflowOptionsAdminPanel #startingIndex").val());
    coverflowOptions.autoplay.interval = parseInt($("#coverflowOptionsAdminPanel #flipInterval").val());
    coverflowOptions.autoplay.pauseOnMouseenter = $("#coverflowOptionsAdminPanel #pauseOnHover").prop("checked");
    coverflowOptions.autoplay.playsPerCategory = parseInt($("#coverflowOptionsAdminPanel #flipsPerCategory").val());
    coverflowOptions.categories.defaultCategory = $("#coverflowOptionsAdminPanel #defaultCategory").val();
    coverflowOptions.categories.selectedCategory = ($("#coverflowOptionsAdminPanel #startingCategory").val() == "- Not set -") ? null : $("#coverflowOptionsAdminPanel #startingCategory").val();
    coverflowOptions.categories.renderTitles = $("#coverflowOptionsAdminPanel #displayCategoriesNav").prop("checked");
    coverflowOptions.categories.rememberLastCover = $("#coverflowOptionsAdminPanel #categoriesStateful").prop("checked");
    coverflowOptions.categories.delAnimationCount = parseInt($("#coverflowOptionsAdminPanel #animateOut").val());
    coverflowOptions.categories.addAnimationRadius = parseInt($("#coverflowOptionsAdminPanel #animateIn").val());
    coverflowOptions.cover.height = parseInt($("#coverflowOptionsAdminPanel #coverHeight").val());
    coverflowOptions.cover.width = parseInt($("#coverflowOptionsAdminPanel #coverWidth").val());
    coverflowOptions.cover.animation.radius = parseInt($("#coverflowOptionsAdminPanel #slideAnimationRadius").val());
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

// Update form with options
function updateForm(setSliders) {
    if (setSliders) { // Set sliders
        $sliderAnimationDuration.slider("value", coverflowOptions.cover.animation.perspective.duration);
        $sliderInnerCoverAnimationOffset.slider("value", coverflowOptions.cover.animation.perspective.inner);
        $sliderBackgroundSize.slider("value", coverflowOptions.cover.background.size - 100);
        $sliderInnerOverlap.slider("value", coverflowOptions.cover.background.overlap.inner);
        $sliderOuterOverlap.slider("value", coverflowOptions.cover.background.overlap.outer);
        $sliderAngle.slider("value", coverflowOptions.cover.perspective.angle);
        $sliderInitialOpacity.slider("value", coverflowOptions.cover.reflection.initialOpacity);
        $sliderReflectionLength.slider("value", coverflowOptions.cover.reflection.length);
        $sliderSliderWidth.slider("value", coverflowOptions.slider.width);
    }
    // Set slider value displays
    var backgroundSize = coverflowOptions.cover.background.size - 100;
    var biggerSmaller = backgroundSize < 0 ? "smaller" : "bigger";
    $("#coverflowOptionsAdminPanel #backgroundCoverSize").html(Math.abs(backgroundSize));
    $("#coverflowOptionsAdminPanel #biggerSmaller").html(biggerSmaller);
    $("#coverflowOptionsAdminPanel #innerCoverOverlap").html(coverflowOptions.cover.background.overlap.inner);
    $("#coverflowOptionsAdminPanel #outerCoverOverlap").html(coverflowOptions.cover.background.overlap.outer);
    $("#coverflowOptionsAdminPanel #angle").html(coverflowOptions.cover.perspective.angle);
    $("#coverflowOptionsAdminPanel #animationDuration").html(coverflowOptions.cover.animation.perspective.duration);
    $("#coverflowOptionsAdminPanel #innerCoverAnimationOffset").html(coverflowOptions.cover.animation.perspective.inner);
    $("#coverflowOptionsAdminPanel #initialOpacity").html(coverflowOptions.cover.reflection.initialOpacity);
    $("#coverflowOptionsAdminPanel #reflectionLength").html(coverflowOptions.cover.reflection.length);
    $("#coverflowOptionsAdminPanel #sliderWidth").html(coverflowOptions.slider.width);
    // Set non-slider form values
    $("#coverflowOptionsAdminPanel #coverWidth").val(coverflowOptions.cover.width);
    $("#coverflowOptionsAdminPanel #coverHeight").val(coverflowOptions.cover.height);
    $("#coverflowOptionsAdminPanel #startingIndex").val(Math.min(coverflowOptions.selectedIndex, numberOfCovers - 1));
    $("#coverflowOptionsAdminPanel #slideAnimationRadius").val(Math.min(coverflowOptions.cover.animation.radius, numberOfCovers));
    $("#coverflowOptionsAdminPanel #flipInterval").val(coverflowOptions.autoplay.interval);
    $("#coverflowOptionsAdminPanel #flipsPerCategory").val(Math.min(coverflowOptions.autoplay.playsPerCategory, numberOfCovers));
    $("#coverflowOptionsAdminPanel #pauseOnHover").prop("checked", coverflowOptions.autoplay.pauseOnMouseenter);
    $("#coverflowOptionsAdminPanel #displayCategoriesNav").prop("checked", coverflowOptions.categories.renderTitles);
    $("#coverflowOptionsAdminPanel #categoriesStateful").prop("checked", coverflowOptions.categories.rememberLastCover);
    $("#coverflowOptionsAdminPanel #defaultCategory").val(coverflowOptions.categories.defaultCategory);
    if (coverflowOptions.categories.selectedCategory != null)
        $("#coverflowOptionsAdminPanel #startingCategory").val(coverflowOptions.categories.selectedCategory);
    $("#coverflowOptionsAdminPanel #animateIn").val(Math.min(coverflowOptions.categories.addAnimationRadius, numberOfCovers));
    $("#coverflowOptionsAdminPanel #animateOut").val(Math.min(coverflowOptions.categories.delAnimationCount, numberOfCovers));
    // Set visibile areas
    if (!coverflowOptions.autoplay.enabled) turnOffAutoplay(); else turnOnAutoplay();
    if (!coverflowOptions.categories.enabled) turnOffCategories(); else turnOnCategories();
    if (!coverflowOptions.cover.perspective.enabled) turnOffPerpective(); else turnOnPerpective();
    if (!coverflowOptions.cover.reflection.enabled) turnOffReflections(); else turnOnReflections();
    if (!coverflowOptions.slider.enabled) turnOffSlider(); else turnOnSlider();
    if (!coverflowOptions.cover.title.enabled) turnOffTitles(); else turnOnTitles();
    $("#coverflowOptionsAdminPanel #changesLabel").hide();
}

// On page load
$(function () {
    // Initialize page variables
    numberOfCovers = $("#coverflowOptionsAdminPreview > img").length;

    $.each($("#coverflowOptionsAdminPreview > img"), function (index, value) {
        var category = value.dataset["category"] != null ? value.dataset["category"] : coverflowOptions.categories.defaultCategory;
        if ($.inArray(category, categories) == -1)
            categories.push(category);
    });

    // Initialize on/off switches
    $autoplaySwitch = $("#coverflowOptionsAdminPanel #autoplay .onOffSwitch").iphoneSwitch(coverflowOptions.autoplay.enabled ? "on" : "off", turnOnAutoplay, turnOffAutoplay);
    $categoriesSwitch = $("#coverflowOptionsAdminPanel #categories .onOffSwitch").iphoneSwitch(coverflowOptions.categories.enabled ? "on" : "off", turnOnCategories, turnOffCategories);
    $perspectiveSwitch = $("#coverflowOptionsAdminPanel #perspective .onOffSwitch").iphoneSwitch(coverflowOptions.cover.perspective.enabled ? "on" : "off", turnOnPerpective, turnOffPerpective);
    $reflectionsSwitch = $("#coverflowOptionsAdminPanel #reflections .onOffSwitch").iphoneSwitch(coverflowOptions.cover.reflection.enabled ? "on" : "off", turnOnReflections, turnOffReflections);
    $sliderSwitch = $("#coverflowOptionsAdminPanel #slider .onOffSwitch").iphoneSwitch(coverflowOptions.slider.enabled ? "on" : "off", turnOnSlider, turnOffSlider);
    $titleSwitch = $("#coverflowOptionsAdminPanel #titles .onOffSwitch").iphoneSwitch(coverflowOptions.cover.title.enabled ? "on" : "off", turnOnTitles, turnOffTitles);

    // Initialize select lists
    for (var i = 0; i < numberOfCovers; i++) {
        var selectOption = $("<option value='" + i + "'>" + i + "</option>");
        $("#coverflowOptionsAdminPanel #startingIndex").append(selectOption.clone());
        if (i > 1) {
            $("#coverflowOptionsAdminPanel #slideAnimationRadius").append(selectOption.clone());
            $("#coverflowOptionsAdminPanel #animateIn").append(selectOption.clone());
            $("#coverflowOptionsAdminPanel #animateOut").append(selectOption.clone());
        }
        if (i > 0) $("#coverflowOptionsAdminPanel #flipsPerCategory").append(selectOption.clone());
    }
    $.each(categories, function (index, value) {
        var categorySelectOption = $("<option value='" + value + "'>" + value + "</option>");
        $("#coverflowOptionsAdminPanel #startingCategory").append(categorySelectOption.clone());
    });

    // Initialize sliders
    $sliderBackgroundSize = $("#coverflowOptionsAdminPanel #backgroundCoverSizeSlider").slider({
        value: coverflowOptions.cover.background.size - 100,
        min: -50,
        max: 50,
        step: 1,
        slide: function (event, ui) {
            $("#coverflowOptionsAdminPanel #backgroundCoverSize").html(Math.abs(ui.value));
            var biggerSmaller = ui.value < 0 ? "smaller" : "bigger";
            $("#coverflowOptionsAdminPanel #biggerSmaller").html(biggerSmaller);
            $("#coverflowOptionsAdminPanel #changesLabel").show();
        }
    });
    $sliderInnerOverlap = $("#coverflowOptionsAdminPanel #innerCoverOverlapSlider").slider({
        value: coverflowOptions.cover.background.overlap.inner,
        min: -100,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#coverflowOptionsAdminPanel #innerCoverOverlap").html(ui.value);
            $("#coverflowOptionsAdminPanel #changesLabel").show();
        }
    });
    $sliderOuterOverlap = $("#coverflowOptionsAdminPanel #outerCoverOverlapSlider").slider({
        value: coverflowOptions.cover.background.overlap.outer,
        min: -100,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#coverflowOptionsAdminPanel #outerCoverOverlap").html(ui.value);
            $("#coverflowOptionsAdminPanel #changesLabel").show();
        }
    });
    $sliderAngle = $("#coverflowOptionsAdminPanel #angleSlider").slider({
        value: coverflowOptions.cover.perspective.angle,
        min: 0,
        max: 180,
        step: 1,
        slide: function (event, ui) {
            $("#coverflowOptionsAdminPanel #angle").html(ui.value);
            $("#coverflowOptionsAdminPanel #changesLabel").show();
        }
    });
    $sliderAnimationDuration = $("#coverflowOptionsAdminPanel #animationDurationSlider").slider({
        value: coverflowOptions.cover.animation.perspective.duration,
        min: 0,
        max: 1000,
        step: 10,
        slide: function (event, ui) {
            $("#coverflowOptionsAdminPanel #animationDuration").html(ui.value);
            $("#coverflowOptionsAdminPanel #changesLabel").show();
        }
    });
    $sliderInnerCoverAnimationOffset = $("#coverflowOptionsAdminPanel #innerCoverAnimationOffsetSlider").slider({
        value: coverflowOptions.cover.animation.perspective.inner,
        min: 0,
        max: 200,
        step: 1,
        slide: function (event, ui) {
            $("#coverflowOptionsAdminPanel #innerCoverAnimationOffset").html(ui.value);
            $("#coverflowOptionsAdminPanel #changesLabel").show();
        }
    });
    $sliderInitialOpacity = $("#coverflowOptionsAdminPanel #initialOpacitySlider").slider({
        value: coverflowOptions.cover.reflection.initialOpacity,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#coverflowOptionsAdminPanel #initialOpacity").html(ui.value);
            $("#coverflowOptionsAdminPanel #changesLabel").show();
        }
    });
    $sliderReflectionLength = $("#coverflowOptionsAdminPanel #reflectionLengthSlider").slider({
        value: coverflowOptions.cover.reflection.length,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#coverflowOptionsAdminPanel #reflectionLength").html(ui.value);
            $("#coverflowOptionsAdminPanel #changesLabel").show();
        }
    });
    $sliderSliderWidth = $("#coverflowOptionsAdminPanel #sliderWidthSlider").slider({
        value: coverflowOptions.slider.width,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#coverflowOptionsAdminPanel #sliderWidth").html(ui.value);
            $("#coverflowOptionsAdminPanel #changesLabel").show();
        }
    });
    
    // Hide show changes label.
    $("#coverflowOptionsAdminPanel #optionsForm input").change(function () {
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    });
    $("#coverflowOptionsAdminPanel #optionsForm select").change(function () {
        $("#coverflowOptionsAdminPanel #changesLabel").show();
    });
});
