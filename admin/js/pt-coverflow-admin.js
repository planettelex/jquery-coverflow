/*
 * Copyright (c) 2015 Planet Telex Inc. all rights reserved.
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

// ReSharper disable UsageOfPossiblyUnassignedValue
var pt = pt || {};
// ReSharper restore UsageOfPossiblyUnassignedValue

pt.coverflow = {
    defaultOptions: {
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
    },
    admin: { }
};
pt.coverflow.admin = {
    coverflowOptions: pt.coverflow.defaultOptions,
    numberOfCovers: 0,
    categories: [],
    validationMessages: [],
    $autoplaySwitch: null,
    $categoriesSwitch: null,
    $perspectiveSwitch: null,
    $reflectionsSwitch: null,
    $sliderSwitch: null,
    $titleSwitch: null,
    $backgroundSizeSlider: null,
    $innerOverlapSlider: null,
    $outerOverlapSlider: null,
    $angleSlider: null,
    $animationDurationSlider: null,
    $innerCoverAnimationOffsetSlider: null,
    $initialOpacitySlider: null,
    $reflectionLengthSlider: null,
    $sliderWidthSlider: null,
    validateCoverflowOptions: function() {
        this.validationMessages = [];

        if (this.coverflowOptions == null)
            this.coverflowOptions = pt.coverflow.defaultOptions;
        else {
            if (this.coverflowOptions.selectedIndex == null) this.coverflowOptions.selectedIndex = pt.coverflow.defaultOptions.selectedIndex;
            else if (isNaN(parseInt(this.coverflowOptions.selectedIndex))) this.validationMessages.push("Selected index is not a number.");

            if (this.coverflowOptions.autoplay == null) this.coverflowOptions.autoplay = pt.coverflow.defaultOptions.autoplay;
            else {
                if (this.coverflowOptions.autoplay.enabled == null) this.coverflowOptions.autoplay.enabled = pt.coverflow.defaultOptions.autoplay.enabled;
                else if (this.coverflowOptions.autoplay.enabled != true && this.coverflowOptions.autoplay.enabled != false) this.validationMessages.push("Autoplay enabled is not a boolean.");
                if (this.coverflowOptions.autoplay.interval == null) this.coverflowOptions.autoplay.interval = pt.coverflow.defaultOptions.autoplay.interval;
                else if (isNaN(parseInt(this.coverflowOptions.autoplay.interval))) this.validationMessages.push("Autoplay interval is not a number.");
                else if (parseInt(this.coverflowOptions.autoplay.interval) <= 0) this.validationMessages.push("Autoplay interval must be greater than zero.");
                if (this.coverflowOptions.autoplay.pauseOnMouseenter == null) this.coverflowOptions.autoplay.pauseOnMouseenter = pt.coverflow.defaultOptions.autoplay.pauseOnMouseenter;
                else if (this.coverflowOptions.autoplay.pauseOnMouseenter != true && this.coverflowOptions.autoplay.pauseOnMouseenter != false) this.validationMessages.push("Autoplay pause on mouse enter is not a boolean.");
                if (this.coverflowOptions.autoplay.playsPerCategory == null) this.coverflowOptions.autoplay.playsPerCategory = pt.coverflow.defaultOptions.autoplay.playsPerCategory;
                else if (isNaN(parseInt(this.coverflowOptions.autoplay.playsPerCategory))) this.validationMessages.push("Autoplay plays per category is not a number.");
                else if (parseInt(this.coverflowOptions.autoplay.playsPerCategory) <= 0) this.validationMessages.push("Autoplay plays per category must be greater than zero.");
            }

            if (this.coverflowOptions.categories == null) this.coverflowOptions.categories = pt.coverflow.defaultOptions.categories;
            else {
                if (this.coverflowOptions.categories.enabled == null) this.coverflowOptions.categories.enabled = pt.coverflow.defaultOptions.categories.enabled;
                else if (this.coverflowOptions.categories.enabled != true && this.coverflowOptions.categories.enabled != false) this.validationMessages.push("Categories enabled is not a boolean.");
                if (this.coverflowOptions.categories.defaultCategory == null) this.coverflowOptions.categories.defaultCategory = pt.coverflow.defaultOptions.categories.defaultCategory;
                if (this.coverflowOptions.categories.renderTitles == null) this.coverflowOptions.categories.renderTitles = pt.coverflow.defaultOptions.categories.renderTitles;
                else if (this.coverflowOptions.categories.renderTitles != true && this.coverflowOptions.categories.renderTitles != false) this.validationMessages.push("Categories render titles is not a boolean.");
                if (this.coverflowOptions.categories.rememberLastCover == null) this.coverflowOptions.categories.rememberLastCover = pt.coverflow.defaultOptions.categories.rememberLastCover;
                else if (this.coverflowOptions.categories.rememberLastCover != true && this.coverflowOptions.categories.rememberLastCover != false) this.validationMessages.push("Categories remember last cover is not a boolean.");
                if (this.coverflowOptions.categories.delAnimationCount == null) this.coverflowOptions.categories.delAnimationCount = pt.coverflow.defaultOptions.categories.delAnimationCount;
                else if (isNaN(parseInt(this.coverflowOptions.categories.delAnimationCount))) this.validationMessages.push("Categories delete animation count is not a number.");
                else if (parseInt(this.coverflowOptions.categories.delAnimationCount) <= 0) this.validationMessages.push("Categories delete animation count must be greater than zero.");
                if (this.coverflowOptions.categories.addAnimationRadius == null) this.coverflowOptions.categories.addAnimationRadius = pt.coverflow.defaultOptions.categories.addAnimationRadius;
                else if (isNaN(parseInt(this.coverflowOptions.categories.addAnimationRadius))) this.validationMessages.push("Categories add animation radius is not a number.");
                else if (parseInt(this.coverflowOptions.categories.addAnimationRadius) <= 0) this.validationMessages.push("Categories add animation radius must be greater than zero.");
            }

            if (this.coverflowOptions.cover == null) this.coverflowOptions.cover = pt.coverflow.defaultOptions.cover;
            else {
                if (this.coverflowOptions.cover.height == null) this.coverflowOptions.cover.height = pt.coverflow.defaultOptions.cover.height;
                else if (isNaN(parseInt(this.coverflowOptions.cover.height))) this.validationMessages.push("Cover height is not a number.");
                else if (parseInt(this.coverflowOptions.cover.interval) <= 0) this.validationMessages.push("Cover height must be greater than zero.");
                if (this.coverflowOptions.cover.width == null) this.coverflowOptions.cover.width = pt.coverflow.defaultOptions.cover.width;
                else if (isNaN(parseInt(this.coverflowOptions.cover.width))) this.validationMessages.push("Cover width is not a number.");
                else if (parseInt(this.coverflowOptions.cover.width) <= 0) this.validationMessages.push("Cover width must be greater than zero.");

                if (this.coverflowOptions.cover.animation == null) this.coverflowOptions.cover.animation = pt.coverflow.defaultOptions.cover.animation;
                else {
                    if (this.coverflowOptions.cover.animation.radius == null) this.coverflowOptions.cover.animation.radius = pt.coverflow.defaultOptions.cover.animation.radius;
                    else if (isNaN(parseInt(this.coverflowOptions.cover.animation.radius))) this.validationMessages.push("Cover animation radius is not a number.");
                    else if (parseInt(this.coverflowOptions.cover.animation.radius) <= 0) this.validationMessages.push("Cover animation radius must be greater than zero.");
                    if (this.coverflowOptions.cover.animation.perspective == null) this.coverflowOptions.cover.animation.perspective = pt.coverflow.defaultOptions.cover.animation.perspective;
                    else {
                        if (this.coverflowOptions.cover.animation.perspective.duration == null) this.coverflowOptions.cover.animation.perspective.duration = pt.coverflow.defaultOptions.cover.animation.perspective.duration;
                        else if (isNaN(parseInt(this.coverflowOptions.cover.animation.perspective.duration))) this.validationMessages.push("Cover perspective animation duration is not a number.");
                        else if (parseInt(this.coverflowOptions.cover.animation.perspective.duration) <= 0) this.validationMessages.push("Cover perspective animation duration must be greater than zero.");
                        if (this.coverflowOptions.cover.animation.perspective.inner == null) this.coverflowOptions.cover.animation.perspective.inner = pt.coverflow.defaultOptions.cover.animation.perspective.inner;
                        else if (isNaN(parseInt(this.coverflowOptions.cover.animation.perspective.inner))) this.validationMessages.push("Cover perspective animation inner is not a number.");
                    }
                }

                if (this.coverflowOptions.cover.background == null) this.coverflowOptions.cover.background = pt.coverflow.defaultOptions.cover.background;
                else {
                    if (this.coverflowOptions.cover.background.size == null) this.coverflowOptions.cover.background.size = pt.coverflow.defaultOptions.cover.background.size;
                    else if (isNaN(parseInt(this.coverflowOptions.cover.background.size))) this.validationMessages.push("Background cover size is not a number.");
                    else if (parseInt(this.coverflowOptions.cover.background.size) <= 0) this.validationMessages.push("Background cover size must be greater than zero.");
                    if (this.coverflowOptions.cover.background.overlap == null) this.coverflowOptions.cover.background.overlap = pt.coverflow.defaultOptions.cover.background.overlap;
                    else {
                        if (this.coverflowOptions.cover.background.overlap.inner == null) this.coverflowOptions.cover.background.overlap.inner = pt.coverflow.defaultOptions.cover.background.overlap.inner;
                        else if (isNaN(parseInt(this.coverflowOptions.cover.background.overlap.inner))) this.validationMessages.push("Inner background cover overlap is not a number.");
                        if (this.coverflowOptions.cover.background.overlap.outer == null) this.coverflowOptions.cover.background.overlap.outer = pt.coverflow.defaultOptions.cover.background.overlap.outer;
                        else if (isNaN(parseInt(this.coverflowOptions.cover.background.overlap.outer))) this.validationMessages.push("Outer background cover overlap is not a number.");
                    }
                }

                if (this.coverflowOptions.cover.perspective == null) this.coverflowOptions.cover.perspective = pt.coverflow.defaultOptions.cover.perspective;
                else {
                    if (this.coverflowOptions.cover.perspective.enabled == null) this.coverflowOptions.cover.perspective.enabled = pt.coverflow.defaultOptions.cover.perspective.enabled;
                    else if (this.coverflowOptions.cover.perspective.enabled != true && this.coverflowOptions.cover.perspective.enabled != false) this.validationMessages.push("Cover perspective enabled is not a boolean.");
                    if (this.coverflowOptions.cover.perspective.angle == null) this.coverflowOptions.cover.perspective.angle = pt.coverflow.defaultOptions.cover.perspective.angle;
                    else if (isNaN(parseInt(this.coverflowOptions.cover.perspective.angle))) this.validationMessages.push("Cover perspective angle is not a number.");
                }

                if (this.coverflowOptions.cover.reflection == null) this.coverflowOptions.cover.reflection = pt.coverflow.defaultOptions.cover.reflection;
                else {
                    if (this.coverflowOptions.cover.reflection.enabled == null) this.coverflowOptions.cover.reflection.enabled = pt.coverflow.defaultOptions.cover.reflection.enabled;
                    else if (this.coverflowOptions.cover.reflection.enabled != true && this.coverflowOptions.cover.reflection.enabled != false) this.validationMessages.push("Cover reflection enabled is not a boolean.");
                    if (this.coverflowOptions.cover.reflection.length == null) this.coverflowOptions.cover.reflection.length = pt.coverflow.defaultOptions.cover.reflection.length;
                    else if (isNaN(parseInt(this.coverflowOptions.cover.reflection.length))) this.validationMessages.push("Cover reflection length is not a number.");
                    else if (parseInt(this.coverflowOptions.cover.reflection.length) <= 0) this.validationMessages.push("Cover reflection length must be greater than zero.");
                    if (this.coverflowOptions.cover.reflection.initialOpacity == null) this.coverflowOptions.cover.reflection.initialOpacity = pt.coverflow.defaultOptions.cover.reflection.initialOpacity;
                    else if (isNaN(parseInt(this.coverflowOptions.cover.reflection.initialOpacity))) this.validationMessages.push("Cover reflection initial opacity is not a number.");
                }

                if (this.coverflowOptions.cover.title == null) this.coverflowOptions.cover.title = pt.coverflow.defaultOptions.cover.title;
                else {
                    if (this.coverflowOptions.cover.title.enabled == null) this.coverflowOptions.cover.title.enabled = pt.coverflow.defaultOptions.cover.title.enabled;
                    else if (this.coverflowOptions.cover.title.enabled != true && this.coverflowOptions.cover.title.enabled != false) this.validationMessages.push("Cover title enabled is not a boolean.");
                }
            }
            if (this.coverflowOptions.slider == null) this.coverflowOptions.slider = pt.coverflow.defaultOptions.slider;
            else {
                if (this.coverflowOptions.slider.enabled == null) this.coverflowOptions.slider.enabled = pt.coverflow.defaultOptions.slider.enabled;
                else if (this.coverflowOptions.slider.enabled != true && this.coverflowOptions.slider.enabled != false) this.validationMessages.push("Slider enabled is not a boolean.");
                if (this.coverflowOptions.slider.width == null) this.coverflowOptions.slider.width = pt.coverflow.defaultOptions.slider.width;
                else if (isNaN(parseInt(this.coverflowOptions.slider.width))) this.validationMessages.push("Slider width is not a number.");
                else if (parseInt(this.coverflowOptions.slider.width) <= 0) this.validationMessages.push("Slider width must be greater than zero.");
            }
        }
        var isValid = this.validationMessages.length == 0;
        $("#coverflowOptionsAdminPanel .validationMessage").empty();
        if (isValid) {
            $("#coverflowOptionsAdminPanel .validationMessage").hide();
        }
        else {
            for (var i = 0; i < this.validationMessages.length; i++)
                $("#coverflowOptionsAdminPanel .validationMessage").append("<li>" + this.validationMessages[i] + "</li>");

            $("#coverflowOptionsAdminPanel .validationMessage").show();
        }
        return isValid;
    },
    turnOnAutoplay: function() {
        $("#coverflowOptionsAdminPanel .autoplay ul").show();
        $("#coverflowOptionsAdminPanel .autoplay > p").hide();
        this.$autoplaySwitch.data("toggleSwitch").turnOn();
        if (!this.coverflowOptions.autoplay.enabled) {
            this.coverflowOptions.autoplay.enabled = true;
            $("#changesLabel").show();
        }
    },
    turnOffAutoplay: function() {
        $("#coverflowOptionsAdminPanel .autoplay ul").hide();
        $("#coverflowOptionsAdminPanel .autoplay > p").show();
        this.$autoplaySwitch.data("toggleSwitch").turnOff();
        if (this.coverflowOptions.autoplay.enabled) {
            this.coverflowOptions.autoplay.enabled = false;
            $("#changesLabel").show();
        }
    },
    turnOnCategories: function() {
        $("#coverflowOptionsAdminPanel .categories ul").show();
        $("#coverflowOptionsAdminPanel .categories > p").hide();
        $("#flipsPerCategory").removeAttr("disabled");
        this.$categoriesSwitch.data("toggleSwitch").turnOn();
        if (!this.coverflowOptions.categories.enabled) {
            this.coverflowOptions.categories.enabled = true;
            $("#changesLabel").show();
        }
    },
    turnOffCategories: function() {
        $("#coverflowOptionsAdminPanel .categories ul").hide();
        $("#coverflowOptionsAdminPanel .categories > p").show();
        $("#flipsPerCategory").attr("disabled", "disabled");
        this.$categoriesSwitch.data("toggleSwitch").turnOff();
        if (this.coverflowOptions.categories.enabled) {
            this.coverflowOptions.categories.enabled = false;
            $("#changesLabel").show();
        }
    },
    turnOnPerpective: function() {
        $("#coverflowOptionsAdminPanel .perspective ul").show();
        $("#coverflowOptionsAdminPanel .perspective > p").hide();
        this.$perspectiveSwitch.data("toggleSwitch").turnOn();
        if (!this.coverflowOptions.cover.perspective.enabled) {
            this.coverflowOptions.cover.perspective.enabled = true;
            $("#changesLabel").show();
        }
    },
    turnOffPerpective: function() {
        $("#coverflowOptionsAdminPanel .perspective ul").hide();
        $("#coverflowOptionsAdminPanel .perspective > p").show();
        this.$perspectiveSwitch.data("toggleSwitch").turnOff();
        if (this.coverflowOptions.cover.perspective.enabled) {
            this.coverflowOptions.cover.perspective.enabled = false;
            $("#changesLabel").show();
        }
    },
    turnOnReflections: function() {
        $("#coverflowOptionsAdminPanel .reflections ul").show();
        $("#coverflowOptionsAdminPanel .reflections > p").hide();
        this.$reflectionsSwitch.data("toggleSwitch").turnOn();
        if (!this.coverflowOptions.cover.reflection.enabled) {
            this.coverflowOptions.cover.reflection.enabled = true;
            $("#changesLabel").show();
        }
    },
    turnOffReflections: function() {
        $("#coverflowOptionsAdminPanel .reflections ul").hide();
        $("#coverflowOptionsAdminPanel .reflections > p").show();
        this.$reflectionsSwitch.data("toggleSwitch").turnOff();
        if (this.coverflowOptions.cover.reflection.enabled) {
            this.coverflowOptions.cover.reflection.enabled = false;
            $("#changesLabel").show();
        }
    },
    turnOnSlider: function() {
        $("#coverflowOptionsAdminPanel .slider ul").show();
        $("#coverflowOptionsAdminPanel .slider > p").hide();
        this.$sliderSwitch.data("toggleSwitch").turnOn();
        if (!this.coverflowOptions.slider.enabled) {
            this.coverflowOptions.slider.enabled = true;
            $("#changesLabel").show();
        }
    },
    turnOffSlider: function() {
        $("#coverflowOptionsAdminPanel .slider ul").hide();
        $("#coverflowOptionsAdminPanel .slider > p").show();
        this.$sliderSwitch.data("toggleSwitch").turnOff();
        if (this.coverflowOptions.slider.enabled) {
            this.coverflowOptions.slider.enabled = false;
            $("#changesLabel").show();
        }
    },
    turnOnTitles: function() {
        $("#coverflowOptionsAdminPanel .titles > p").hide();
        this.$titleSwitch.data("toggleSwitch").turnOn();
        if (!this.coverflowOptions.cover.title.enabled) {
            this.coverflowOptions.cover.title.enabled = true;
            $("#changesLabel").show();
        }
    },
    turnOffTitles: function() {
        $("#coverflowOptionsAdminPanel .titles > p").show();
        this.$titleSwitch.data("toggleSwitch").turnOff();
        if (this.coverflowOptions.cover.title.enabled) {
            this.coverflowOptions.cover.title.enabled = false;
            $("#changesLabel").show();
        }
    },
    updateOptions: function() {
        this.coverflowOptions.selectedIndex = parseInt($("#startingIndex").val());
        this.coverflowOptions.autoplay.interval = parseInt($("#flipInterval").val());
        this.coverflowOptions.autoplay.pauseOnMouseenter = $("#pauseOnHover").prop("checked");
        this.coverflowOptions.autoplay.playsPerCategory = parseInt($("#flipsPerCategory").val());
        this.coverflowOptions.categories.defaultCategory = $("#defaultCategory").val();
        this.coverflowOptions.categories.selectedCategory = ($("#startingCategory").val() == "- Not set -") ? null : $("#startingCategory").val();
        this.coverflowOptions.categories.renderTitles = $("#displayCategoriesNav").prop("checked");
        this.coverflowOptions.categories.rememberLastCover = $("#categoriesStateful").prop("checked");
        this.coverflowOptions.categories.delAnimationCount = parseInt($("#animateOut").val());
        this.coverflowOptions.categories.addAnimationRadius = parseInt($("#animateIn").val());
        this.coverflowOptions.cover.height = parseInt($("#coverHeight").val());
        this.coverflowOptions.cover.width = parseInt($("#coverWidth").val());
        this.coverflowOptions.cover.animation.radius = parseInt($("#slideAnimationRadius").val());
        this.coverflowOptions.cover.animation.perspective.duration = this.$animationDurationSlider.slider("value");
        this.coverflowOptions.cover.animation.perspective.inner = this.$innerCoverAnimationOffsetSlider.slider("value");
        this.coverflowOptions.cover.background.size = this.$backgroundSizeSlider.slider("value") + 100;
        this.coverflowOptions.cover.background.overlap.inner = this.$innerOverlapSlider.slider("value");
        this.coverflowOptions.cover.background.overlap.outer = this.$outerOverlapSlider.slider("value");
        this.coverflowOptions.cover.perspective.angle = this.$angleSlider.slider("value");
        this.coverflowOptions.cover.reflection.initialOpacity = this.$initialOpacitySlider.slider("value");
        this.coverflowOptions.cover.reflection.length = this.$reflectionLengthSlider.slider("value");
        this.coverflowOptions.slider.width = this.$sliderWidthSlider.slider("value");
    },
    updateForm: function(setSliders) {
        if (!this.validateCoverflowOptions())
            return;

        if (setSliders) { // Set sliders
            this.$animationDurationSlider.slider("value", this.coverflowOptions.cover.animation.perspective.duration);
            this.$innerCoverAnimationOffsetSlider.slider("value", this.coverflowOptions.cover.animation.perspective.inner);
            this.$backgroundSizeSlider.slider("value", this.coverflowOptions.cover.background.size - 100);
            this.$innerOverlapSlider.slider("value", this.coverflowOptions.cover.background.overlap.inner);
            this.$outerOverlapSlider.slider("value", this.coverflowOptions.cover.background.overlap.outer);
            this.$angleSlider.slider("value", this.coverflowOptions.cover.perspective.angle);
            this.$initialOpacitySlider.slider("value", this.coverflowOptions.cover.reflection.initialOpacity);
            this.$reflectionLengthSlider.slider("value", this.coverflowOptions.cover.reflection.length);
            this.$sliderWidthSlider.slider("value", this.coverflowOptions.slider.width);
        }
        // Set slider value displays
        var backgroundSize = this.coverflowOptions.cover.background.size - 100;
        var biggerSmaller = backgroundSize < 0 ? "smaller" : "bigger";
        $("#backgroundCoverSize").html(Math.abs(backgroundSize));
        $("#biggerSmaller").html(biggerSmaller);
        $("#innerCoverOverlap").html(this.coverflowOptions.cover.background.overlap.inner);
        $("#outerCoverOverlap").html(this.coverflowOptions.cover.background.overlap.outer);
        $("#angle").html(this.coverflowOptions.cover.perspective.angle);
        $("#animationDuration").html(this.coverflowOptions.cover.animation.perspective.duration);
        $("#innerCoverAnimationOffset").html(this.coverflowOptions.cover.animation.perspective.inner);
        $("#initialOpacity").html(this.coverflowOptions.cover.reflection.initialOpacity);
        $("#reflectionLength").html(this.coverflowOptions.cover.reflection.length);
        $("#sliderWidth").html(this.coverflowOptions.slider.width);
        // Set non-slider form values
        $("#coverWidth").val(this.coverflowOptions.cover.width);
        $("#coverHeight").val(this.coverflowOptions.cover.height);
        $("#startingIndex").val(Math.min(this.coverflowOptions.selectedIndex, this.numberOfCovers - 1));
        $("#slideAnimationRadius").val(Math.min(this.coverflowOptions.cover.animation.radius, this.numberOfCovers));
        $("#flipInterval").val(this.coverflowOptions.autoplay.interval);
        $("#flipsPerCategory").val(Math.min(this.coverflowOptions.autoplay.playsPerCategory, this.numberOfCovers));
        $("#pauseOnHover").prop("checked", this.coverflowOptions.autoplay.pauseOnMouseenter);
        $("#displayCategoriesNav").prop("checked", this.coverflowOptions.categories.renderTitles);
        $("#categoriesStateful").prop("checked", this.coverflowOptions.categories.rememberLastCover);
        $("#defaultCategory").val(this.coverflowOptions.categories.defaultCategory);
        if (this.coverflowOptions.categories.selectedCategory != null)
            $("#startingCategory").val(this.coverflowOptions.categories.selectedCategory);
        $("#animateIn").val(Math.min(this.coverflowOptions.categories.addAnimationRadius, this.numberOfCovers));
        $("#animateOut").val(Math.min(this.coverflowOptions.categories.delAnimationCount, this.numberOfCovers));
        // Set visibile areas
        if (!this.coverflowOptions.autoplay.enabled) this.turnOffAutoplay();
        else this.turnOnAutoplay();
        if (!this.coverflowOptions.categories.enabled) this.turnOffCategories();
        else this.turnOnCategories();
        if (!this.coverflowOptions.cover.perspective.enabled) this.turnOffPerpective();
        else this.turnOnPerpective();
        if (!this.coverflowOptions.cover.reflection.enabled) this.turnOffReflections();
        else this.turnOnReflections();
        if (!this.coverflowOptions.slider.enabled) this.turnOffSlider();
        else this.turnOnSlider();
        if (!this.coverflowOptions.cover.title.enabled) this.turnOffTitles();
        else this.turnOnTitles();
        $("#changesLabel").hide();
    }
};


// On page load
$(function () {
    // Initialize categories
    $.each($("#coverflowOptionsAdminPreview > img"), function (index, value) {
        var category = value.dataset["category"] != null ? value.dataset["category"] : pt.coverflow.admin.coverflowOptions.categories.defaultCategory;
        if ($.inArray(category, pt.coverflow.admin.categories) == -1)
            pt.coverflow.admin.categories.push(category);
    });

    // Initialize on/off switches
    pt.coverflow.admin.$autoplaySwitch = $("#coverflowOptionsAdminPanel .autoplay .onOffSwitch").iphoneSwitch(pt.coverflow.admin.coverflowOptions.autoplay.enabled ? "on" : "off", pt.coverflow.admin.turnOnAutoplay.bind(pt.coverflow.admin), pt.coverflow.admin.turnOffAutoplay.bind(pt.coverflow.admin));
    pt.coverflow.admin.$categoriesSwitch = $("#coverflowOptionsAdminPanel .categories .onOffSwitch").iphoneSwitch(pt.coverflow.admin.coverflowOptions.categories.enabled ? "on" : "off", pt.coverflow.admin.turnOnCategories.bind(pt.coverflow.admin), pt.coverflow.admin.turnOffCategories.bind(pt.coverflow.admin));
    pt.coverflow.admin.$perspectiveSwitch = $("#coverflowOptionsAdminPanel .perspective .onOffSwitch").iphoneSwitch(pt.coverflow.admin.coverflowOptions.cover.perspective.enabled ? "on" : "off", pt.coverflow.admin.turnOnPerpective.bind(pt.coverflow.admin), pt.coverflow.admin.turnOffPerpective.bind(pt.coverflow.admin));
    pt.coverflow.admin.$reflectionsSwitch = $("#coverflowOptionsAdminPanel .reflections .onOffSwitch").iphoneSwitch(pt.coverflow.admin.coverflowOptions.cover.reflection.enabled ? "on" : "off", pt.coverflow.admin.turnOnReflections.bind(pt.coverflow.admin), pt.coverflow.admin.turnOffReflections.bind(pt.coverflow.admin));
    pt.coverflow.admin.$sliderSwitch = $("#coverflowOptionsAdminPanel .slider .onOffSwitch").iphoneSwitch(pt.coverflow.admin.coverflowOptions.slider.enabled ? "on" : "off", pt.coverflow.admin.turnOnSlider.bind(pt.coverflow.admin), pt.coverflow.admin.turnOffSlider.bind(pt.coverflow.admin));
    pt.coverflow.admin.$titleSwitch = $("#coverflowOptionsAdminPanel .titles .onOffSwitch").iphoneSwitch(pt.coverflow.admin.coverflowOptions.cover.title.enabled ? "on" : "off", pt.coverflow.admin.turnOnTitles.bind(pt.coverflow.admin), pt.coverflow.admin.turnOffTitles.bind(pt.coverflow.admin));

    // Initialize select lists
    pt.coverflow.admin.numberOfCovers = Math.max($("#coverflowOptionsAdminPreview > img").length, 25);
    for (var i = 0; i < pt.coverflow.admin.numberOfCovers; i++) {
        var selectOption = $("<option value='" + i + "'>" + i + "</option>");
        $("#startingIndex").append(selectOption.clone());
        if (i > 1) {
            $("#slideAnimationRadius").append(selectOption.clone());
            $("#animateIn").append(selectOption.clone());
            $("#animateOut").append(selectOption.clone());
        }
        if (i > 0) $("#flipsPerCategory").append(selectOption.clone());
    }
    $.each(pt.coverflow.admin.categories, function (index, value) {
        var categorySelectOption = $("<option value='" + value + "'>" + value + "</option>");
        $("#startingCategory").append(categorySelectOption.clone());
    });

    // Initialize sliders
    pt.coverflow.admin.$backgroundSizeSlider = $("#backgroundCoverSizeSlider").slider({
        value: pt.coverflow.admin.coverflowOptions.cover.background.size - 100,
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
    pt.coverflow.admin.$innerOverlapSlider = $("#innerCoverOverlapSlider").slider({
        value: pt.coverflow.admin.coverflowOptions.cover.background.overlap.inner,
        min: -100,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#innerCoverOverlap").html(ui.value);
            $("#changesLabel").show();
        }
    });
    pt.coverflow.admin.$outerOverlapSlider = $("#outerCoverOverlapSlider").slider({
        value: pt.coverflow.admin.coverflowOptions.cover.background.overlap.outer,
        min: -100,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#outerCoverOverlap").html(ui.value);
            $("#changesLabel").show();
        }
    });
    pt.coverflow.admin.$angleSlider = $("#angleSlider").slider({
        value: pt.coverflow.admin.coverflowOptions.cover.perspective.angle,
        min: 0,
        max: 180,
        step: 1,
        slide: function (event, ui) {
            $("#angle").html(ui.value);
            $("#changesLabel").show();
        }
    });
    pt.coverflow.admin.$animationDurationSlider = $("#animationDurationSlider").slider({
        value: pt.coverflow.admin.coverflowOptions.cover.animation.perspective.duration,
        min: 0,
        max: 1000,
        step: 10,
        slide: function (event, ui) {
            $("#animationDuration").html(ui.value);
            $("#changesLabel").show();
        }
    });
    pt.coverflow.admin.$innerCoverAnimationOffsetSlider = $("#innerCoverAnimationOffsetSlider").slider({
        value: pt.coverflow.admin.coverflowOptions.cover.animation.perspective.inner,
        min: 0,
        max: 200,
        step: 1,
        slide: function (event, ui) {
            $("#innerCoverAnimationOffset").html(ui.value);
            $("#changesLabel").show();
        }
    });
    pt.coverflow.admin.$initialOpacitySlider = $("#initialOpacitySlider").slider({
        value: pt.coverflow.admin.coverflowOptions.cover.reflection.initialOpacity,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#initialOpacity").html(ui.value);
            $("#changesLabel").show();
        }
    });
    pt.coverflow.admin.$reflectionLengthSlider = $("#reflectionLengthSlider").slider({
        value: pt.coverflow.admin.coverflowOptions.cover.reflection.length,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#reflectionLength").html(ui.value);
            $("#changesLabel").show();
        }
    });
    pt.coverflow.admin.$sliderWidthSlider = $("#sliderWidthSlider").slider({
        value: pt.coverflow.admin.coverflowOptions.slider.width,
        min: 0,
        max: 100,
        step: 1,
        slide: function (event, ui) {
            $("#sliderWidth").html(ui.value);
            $("#changesLabel").show();
        }
    });

    // Hide show changes label.
    $("#optionsForm input").change(function () {
        $("#changesLabel").show();
    });
    $("#optionsForm select").change(function () {
        $("#changesLabel").show();
    });
});
