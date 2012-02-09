/*
 * Copyright (c) 2012 Planet Telex Inc. all rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(function () {
    // Initialize coverflow options to match default values
    var coverflowOptions = {
        width: null,                // Display width of the coverflow. Defaults to the container width.
        height: null,               // Display height of the coverflow. Defaults to the container height.
        selectedIndex: 0,           // The index of the cover to select where 0 is the first.
        autoplay: {
            enabled: false,
            interval: 3,            // Seconds between changing covers.
            pauseOnMouseenter: true,
            playsPerCategory: 3     // Includes the first cover loaded in the category.
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
            height: 300,            // Display height of each cover.
            width: 300,             // Display width of each cover.
            animation: {
                perspective: {
                    duration: 80,   // Milliseconds
                    inner: 120      // Percentage of duration.
                },
                radius: 20          // Number of covers animated on each side of the selected cover.
            },
            background: {
                size: 90,           // Percentage of original image.
                overlap: {
                    inner: 20,      // Percentage of overlap.
                    outer: 80       // Percentage of overlap.
                }
            },
            perspective: {
                angle: 12,          // Angle in degrees from the outside corner to the center. The same value is applied to the top and bottom.
                enabled: true
            },
            reflection: {
                enabled: true,
                initialOpacity: 30, // Percentage 0(transparent) <=> 100(opaque)
                length: 80          // Percentage of original image.
            },
            title: {
                enabled: true
            }
        },
        slider: {
            enabled: true,
            width: 80               // Percentage of the width of the coverflow container.
        }
    };

    // Initialize page variables
    var numberOfCovers = $("#coverflow > img").length;
    var categories = [];
    $.each($("#coverflow > img"), function (index, value) {
        var category = value.dataset["category"] != null ? value.dataset["category"] : coverflowOptions.categories.defaultCategory;
        if ($.inArray(category, categories) == -1)
            categories.push(category);
    });

    // Initialize accordion
    var accordion = $("#optionsPanel").accordion({ collapsible: true });

    // Initialize on/off switches
    var $autoplaySwitch = $("#autoplay .onOffSwitch").iphoneSwitch(coverflowOptions.autoplay.enabled ? "on" : "off", turnOnAutoplay, turnOffAutoplay);
    var $categoriesSwitch = $("#categories .onOffSwitch").iphoneSwitch(coverflowOptions.categories.enabled ? "on" : "off", turnOnCategories, turnOffCategories);
    var $perspectiveSwitch = $("#perspective .onOffSwitch").iphoneSwitch(coverflowOptions.cover.perspective.enabled ? "on" : "off", turnOnPerpective, turnOffPerpective);
    var $reflectionsSwitch = $("#reflections .onOffSwitch").iphoneSwitch(coverflowOptions.cover.reflection.enabled ? "on" : "off", turnOnReflections, turnOffReflections);
    var $sliderSwitch = $("#slider .onOffSwitch").iphoneSwitch(coverflowOptions.slider.enabled ? "on" : "off", turnOnSlider, turnOffSlider);
    var $titleSwitch = $("#titles .onOffSwitch").iphoneSwitch(coverflowOptions.cover.title.enabled ? "on" : "off", turnOnTitles, turnOffTitles);

    // Initialize select lists
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

    // Initialize sliders
    var $sliderBackgroundSize = $("#backgroundCoverSizeSlider").slider({
        value: coverflowOptions.cover.background.size - 100,
        min: -50,
        max: 50,
        step: 1,
        slide: function (event, ui) {
            $("#backgroundCoverSize").html(Math.abs(ui.value));
            var biggerSmaller = ui.value < 0 ? "smaller" : "bigger";
            $("#biggerSmaller").html(biggerSmaller);
            $("#changesLabel").show();
        }
    });
    var $sliderInnerOverlap = $("#innerCoverOverlapSlider").slider({
        value: coverflowOptions.cover.background.overlap.inner,
        min: -100,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#innerCoverOverlap").html(ui.value);
            $("#changesLabel").show();
        }
    });
    var $sliderOuterOverlap = $("#outerCoverOverlapSlider").slider({
        value: coverflowOptions.cover.background.overlap.outer,
        min: -100,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#outerCoverOverlap").html(ui.value);
            $("#changesLabel").show();
        }
    });
    var $sliderAngle = $("#angleSlider").slider({
        value: coverflowOptions.cover.perspective.angle,
        min: 0,
        max: 180,
        step: 1,
        slide: function (event, ui) {
            $("#angle").html(ui.value);
            $("#changesLabel").show();
        }
    });
    var $sliderAnimationDuration = $("#animationDurationSlider").slider({
        value: coverflowOptions.cover.animation.perspective.duration,
        min: 0,
        max: 1000,
        step: 10,
        slide: function (event, ui) {
            $("#animationDuration").html(ui.value);
            $("#changesLabel").show();
        }
    });
    var $sliderInnerCoverAnimationOffset = $("#innerCoverAnimationOffsetSlider").slider({
        value: coverflowOptions.cover.animation.perspective.inner,
        min: 0,
        max: 200,
        step: 1,
        slide: function (event, ui) {
            $("#innerCoverAnimationOffset").html(ui.value);
            $("#changesLabel").show();
        }
    });
    var $sliderInitialOpacity = $("#initialOpacitySlider").slider({
        value: coverflowOptions.cover.reflection.initialOpacity,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#initialOpacity").html(ui.value);
            $("#changesLabel").show();
        }
    });
    var $sliderReflectionLength = $("#reflectionLengthSlider").slider({
        value: coverflowOptions.cover.reflection.length,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#reflectionLength").html(ui.value);
            $("#changesLabel").show();
        }
    });
    var $sliderSliderWidth = $("#sliderWidthSlider").slider({
        value: coverflowOptions.slider.width,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#sliderWidth").html(ui.value);
            $("#changesLabel").show();
        }
    });

    // Define section on/off functions
    function turnOnAutoplay() {
        $("#autoplay ul").show();
        $("#autoplay > p").hide();
        if (!coverflowOptions.autoplay.enabled) {
            coverflowOptions.autoplay.enabled = true;
            $autoplaySwitch.data("toggleSwitch").turnOn();
            $("#changesLabel").show();
        }
    }
    function turnOffAutoplay() {
        $("#autoplay ul").hide();
        $("#autoplay > p").show();
        if (coverflowOptions.autoplay.enabled) {
            coverflowOptions.autoplay.enabled = false;
            $autoplaySwitch.data("toggleSwitch").turnOff();
            $("#changesLabel").show();
        }
    }
    function turnOnCategories() {
        $("#categories ul").show();
        $("#categories > p").hide();
        $("#flipsPerCategory").removeAttr("disabled");
        if (!coverflowOptions.categories.enabled) {
            coverflowOptions.categories.enabled = true;
            $categoriesSwitch.data("toggleSwitch").turnOn();
            $("#changesLabel").show();
        }
    }
    function turnOffCategories() {
        $("#categories ul").hide();
        $("#categories > p").show();
        $("#flipsPerCategory").attr("disabled", "disabled");
        if (coverflowOptions.categories.enabled) {
            coverflowOptions.categories.enabled = false;
            $categoriesSwitch.data("toggleSwitch").turnOff();
            $("#changesLabel").show();
        }
    }
    function turnOnPerpective() {
        $("#perspective ul").show();
        $("#perspective > p").hide();
        if (!coverflowOptions.cover.perspective.enabled) {
            coverflowOptions.cover.perspective.enabled = true;
            $perspectiveSwitch.data("toggleSwitch").turnOn();
            $("#changesLabel").show();
        }
    }
    function turnOffPerpective() {
        $("#perspective ul").hide();
        $("#perspective > p").show();
        if (coverflowOptions.cover.perspective.enabled) {
            coverflowOptions.cover.perspective.enabled = false;
            $perspectiveSwitch.data("toggleSwitch").turnOff();
            $("#changesLabel").show();
        }
    }
    function turnOnReflections() {
        $("#reflections ul").show();
        $("#reflections > p").hide();
        if (!coverflowOptions.cover.reflection.enabled) {
            coverflowOptions.cover.reflection.enabled = true;
            $reflectionsSwitch.data("toggleSwitch").turnOn();
            $("#changesLabel").show();
        }
    }
    function turnOffReflections() {
        $("#reflections ul").hide();
        $("#reflections > p").show();
        if (coverflowOptions.cover.reflection.enabled) {
            coverflowOptions.cover.reflection.enabled = false;
            $reflectionsSwitch.data("toggleSwitch").turnOff();
            $("#changesLabel").show();
        }
    }
    function turnOnSlider() {
        $("#slider ul").show();
        $("#slider > p").hide();
        if (!coverflowOptions.slider.enabled) {
            coverflowOptions.slider.enabled = true;
            $sliderSwitch.data("toggleSwitch").turnOn();
            $("#changesLabel").show();
        }
    }
    function turnOffSlider() {
        $("#slider ul").hide();
        $("#slider > p").show();
        if (coverflowOptions.slider.enabled) {
            coverflowOptions.slider.enabled = false;
            $sliderSwitch.data("toggleSwitch").turnOff();
            $("#changesLabel").show();
        }
    }
    function turnOnTitles() {
        $("#titles > p").hide();
        if (!coverflowOptions.cover.title.enabled) {
            coverflowOptions.cover.title.enabled = true;
            $titleSwitch.data("toggleSwitch").turnOn();
            $("#changesLabel").show();
        }
    }
    function turnOffTitles() {
        $("#titles > p").show();
        if (coverflowOptions.cover.title.enabled) {
            coverflowOptions.cover.title.enabled = false;
            $titleSwitch.data("toggleSwitch").turnOff();
            $("#changesLabel").show();
        }
    }

    // Update options from form
    function updateOptions() {
        coverflowOptions.selectedIndex = parseInt($("#startingIndex").val());
        coverflowOptions.autoplay.interval = parseInt($("#flipInterval").val());
        coverflowOptions.autoplay.pauseOnMouseenter = $("#pauseOnHover").prop("checked");
        coverflowOptions.autoplay.playsPerCategory = parseInt($("#flipsPerCategory").val());
        coverflowOptions.categories.defaultCategory = $("#defaultCategory").val();
        coverflowOptions.categories.selectedCategory = ($("#startingCategory").val() == "- Not set -") ? null : $("#startingCategory").val();
        coverflowOptions.categories.renderTitles = $("#displayCategoriesNav").prop("checked");
        coverflowOptions.categories.rememberLastCover = $("#categoriesStateful").prop("checked");
        coverflowOptions.categories.delAnimationCount = parseInt($("#animateOut").val());
        coverflowOptions.categories.addAnimationRadius = parseInt($("#animateIn").val());
        coverflowOptions.cover.height = parseInt($("#coverHeight").val());
        coverflowOptions.cover.width = parseInt($("#coverWidth").val());
        coverflowOptions.cover.animation.radius = parseInt($("#slideAnimationRadius").val());
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
        $("#backgroundCoverSize").html(Math.abs(backgroundSize));
        $("#biggerSmaller").html(biggerSmaller);
        $("#innerCoverOverlap").html(coverflowOptions.cover.background.overlap.inner);
        $("#outerCoverOverlap").html(coverflowOptions.cover.background.overlap.outer);
        $("#angle").html(coverflowOptions.cover.perspective.angle);
        $("#animationDuration").html(coverflowOptions.cover.animation.perspective.duration);
        $("#innerCoverAnimationOffset").html(coverflowOptions.cover.animation.perspective.inner);
        $("#initialOpacity").html(coverflowOptions.cover.reflection.initialOpacity);
        $("#reflectionLength").html(coverflowOptions.cover.reflection.length);
        $("#sliderWidth").html(coverflowOptions.slider.width);
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
        // Set visibile areas
        if (!coverflowOptions.autoplay.enabled) turnOffAutoplay(); else turnOnAutoplay();
        if (!coverflowOptions.categories.enabled) turnOffCategories(); else turnOnCategories();
        if (!coverflowOptions.cover.perspective.enabled) turnOffPerpective(); else turnOnPerpective();
        if (!coverflowOptions.cover.reflection.enabled) turnOffReflections(); else turnOnReflections();
        if (!coverflowOptions.slider.enabled) turnOffSlider(); else turnOnSlider();
        if (!coverflowOptions.cover.title.enabled) turnOffTitles(); else turnOnTitles();
        $("#changesLabel").hide();
    }

    // Flag for changes
    $("#optionsForm input").change(function () {
        $("#changesLabel").show();
    });
    $("#optionsForm select").change(function () {
        $("#changesLabel").show();
    });
    $("#changesLabel").click(function () {
        accordion.accordion("activate", false);
    });

    // Initialize coverflow and admin form.
    var $coverflow = $("#coverflow").coverflow(coverflowOptions);
    updateForm(false);

    // Refresh coverflow button
    $("#refreshCoverflow").click(function () {
        $coverflow.coverflow("destroy");
        updateOptions();
        $coverflow = $("#coverflow").coverflow(coverflowOptions);
        $("#changesLabel").hide();
    });

    // View/Edit JSON button
    $("#viewEditJson").fancybox({
        overlayColor: '#000',
        onStart: function () {
            updateOptions();
            var jsonString = JSON.stringify(coverflowOptions);
            $("#jsonView textarea").html(formatJson(jsonString));
        },
        titleShow: false
    });

    // Apply JSON button
    $("#jsonView input").click(function () {
        var jsonString = $("#jsonView textarea").val();
        var jsonEval = "coverflowOptions = " + jsonString + ";";
        eval(jsonEval);
        $coverflow.coverflow("destroy");
        $coverflow = $("#coverflow").coverflow(coverflowOptions);
        $.fancybox.close();
        updateForm(true);
    });

});