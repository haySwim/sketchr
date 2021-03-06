/*global $*/


/******************************************************************************
 * Generates play area with grid-unit divs that change to a random background color
 * on mouseenter. After initial mouseenter events, the grid-units will darken until
 * they are completely black. User can clear the play area and set a new size 
 ******************************************************************************/


$(document).ready(function () {
    'use strict';
    var sketchpad = $('.sketchpad'), // Container div for the play area
        gridSize = 25; // Initial number of rows and collumns of grid units
//-------------------------------------------------------------------
// Populates sketchpad with grid-units
//-------------------------------------------------------------------
    function gridCreate(size) {

        var sketchpadSize = $(window).height() * 0.8, //80% of viewport size
            i,
            totalGridUnits = size * size,

            // Width of the play area
            context = sketchpad.width(),

            // Size of the play area divided by the number of grid units
            target = context / size,

            // Maximum percent of play area each grid unit can take up without overflowing
            relativeSize = (target / context) * 100;

        // Reset play area size in case user has resized screen
        sketchpad.height(sketchpadSize).width(sketchpadSize);

        for (i = 0; i < totalGridUnits; i += 1) {
            sketchpad.append('<div ' +
                                'class="grid-unit"' +
                                'style="width:' + relativeSize + '%;' +
                                'height: ' + relativeSize + '%"' +
                                    '></div>');
        }
    }

//-------------------------------------------------------------------
// Removes grid-units from DOM
//-------------------------------------------------------------------
    function gridDestroy() {
        $('.grid-unit').remove();
    }

//-------------------------------------------------------------------
// Event hander for mouseenter events on grid-units
//-------------------------------------------------------------------
    sketchpad.on('mouseenter', '.grid-unit', function () {
        var currentRbgString = '',
            rgbArr = [],
            darkenedRgbArr = [];

        // Generates a number between 0 and 255 to use as a rgb value
        function randomRgb() {
            return Math.floor(Math.random() * 256);
        }

        // If the grid-unit has not been been moused over
        if ($(this).attr('class') !== 'grid-unit sketched') {
            // Add sketched class
            $(this).addClass('sketched');
            // Write in-line css to change the background to a random rgb color
            $(this).css('background-color', 'rgb(' + randomRgb() + ',' + randomRgb() + ',' + randomRgb() + ')');
        // if the grid-unit has been moused over...
        } else {
            // grab the value of its background color property as a string, e.g. "rgb(255, 255, 255)"
            currentRbgString = $(this).css('background-color');
            // strip the rgb numbers from the and push them on to an array
            rgbArr = currentRbgString.match(/\d+/g, '');
            // darken the rgb values, 25.5 is 10% of the max rgb value of 255
            darkenedRgbArr = rgbArr.map(function (rgb) {
                return parseInt(rgb - 25.5, 10);
            });
            //write over the previous css background with the darker colors
            $(this).css('background-color', 'rgb(' + darkenedRgbArr.join(',') + ')');
        }
    });

//-------------------------------------------------------------------
// Clears sketchpad and creatues a new one with a user-defined size
//-------------------------------------------------------------------
    $('main').on('click', 'button', function () {
    // Prompts the user for a new size, calls itself if it receives bad input
        function resizePrompt() {
            gridSize = window.prompt('How large do you want the grid to be?\n (1-50)');
            var gridSizeInt = parseInt(gridSize, 10);
            // Allows user to cancel and keep current sketchpad uncleared
            if (gridSize === null) {
                console.log('Exit clear/resize dialog');
            } else if (gridSizeInt > 50) {
                gridSizeInt = window.alert('That\'s too big! Enter a number between 1-50 please!');
                resizePrompt();
            } else if (isNaN(gridSizeInt) || gridSizeInt < 1) {
                gridSizeInt = window.alert('That does not make sense! Enter a number between 1-50 please!');
                resizePrompt();
            } else {
            // If acceptable user input is recieved removes old grid from dom
                gridDestroy();
                // and creates a new one with the user-defined size
                gridCreate(gridSizeInt);
            }
        }
        resizePrompt();
    });

//-------------------------------------------------------------------
// Initialize the play area
//-------------------------------------------------------------------
    gridCreate(gridSize);
});
