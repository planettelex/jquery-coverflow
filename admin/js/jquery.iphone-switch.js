/************************************************ 
*  jQuery iphoneSwitch plugin                   *
*                                               *
*  Author: Daniel LaBare                        *
*  Date:   2/4/2008                             *
************************************************/

jQuery.fn.iphoneSwitch = function (startState, switchedOnCallback, switchedOffCallback, options) {



    // define default settings
    var settings = {
        mouse_over: 'pointer',
        mouse_out: 'default',
        switch_on_container_path: 'images/iphone_switch_container_off.png',
        switch_off_container_path: 'images/iphone_switch_container_off.png',
        switch_path: 'images/iphone_switch.png',
        switch_height: 25,
        switch_width: 55
    };

    if (options) {
        jQuery.extend(settings, options);
    }

    // create the switch
    return this.each(function () {

        var container;
        var image;

        // make the container
        container = jQuery('<div class="iphone_switch_container" style="height:' + settings.switch_height + 'px; width:' + settings.switch_width + 'px; position: relative; overflow: hidden"></div>');

        // make the switch image based on starting state
        image = jQuery('<img class="iphone_switch" style="height:' + settings.switch_height + 'px; width:' + settings.switch_width + 'px; background-image:url(' + settings.switch_path + '); background-repeat:none; background-position:' + (startState == 'on' ? 0 : -53) + 'px" src="' + (startState == 'on' ? settings.switch_on_container_path : settings.switch_off_container_path) + '" />');

        // insert into placeholder
        jQuery(this).html(jQuery(container).html(jQuery(image)));

        jQuery(this).mouseover(function () {
            jQuery(this).css("cursor", settings.mouse_over);
        });

        jQuery(this).mouseout(function () {
            jQuery(this).css("background", settings.mouse_out);
        });

        jQuery(this).data("toggleSwitch", new toggleSwitch(this, startState));

        // click handling
        jQuery(this).click(function () {
            jQuery(this).data("toggleSwitch").toggle();
        });

    });

    function toggleSwitch(iSwitch, state) {
        this.state = state == 'on' ? state : 'off';
        this.$iSwitch = jQuery(iSwitch);
        this.$element = this.$iSwitch.find('.iphone_switch');
        this.turnOn = function () {
            if (this.state == 'on')
                return;

            this.$element.animate({ backgroundPosition: 0 }, "slow", function () {
                switchedOnCallback();
            });
            this.$element.attr('src', settings.switch_on_container_path);
            this.state = 'on';
        };

        this.turnOff = function () {
            if (this.state == 'off')
                return;

            var self = this;
            self.$element.animate({ backgroundPosition: -53 }, "slow", function () {
                self.$iSwitch.attr('src', settings.switch_off_container_path);
                switchedOffCallback();
            });
            this.state = 'off';
        };

        this.toggle = function () {
            if (this.state == 'on')
                this.turnOff();
            else
                this.turnOn();
        };
    }
};
