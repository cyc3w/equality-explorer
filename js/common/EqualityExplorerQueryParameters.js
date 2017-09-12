// Copyright 2017, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );

  var EqualityExplorerQueryParameters = QueryStringMachine.getAll( {

    // Enables console logging.
    log: { type: 'flag' },

    // Makes all animation run slowly, so that things are easier to grab while they're animating.
    // Useful for testing multi-touch.
    slowMotion: { type: 'flag' },

    // Shows the origin of various objects, typically rendered as a red dot.
    showOrigin: { type: 'flag' },

    // Shows the grid on each of the weighing platforms.
    showGrid: { type: 'flag' },

    // Shows the drag bounds for Items
    showDragBounds: { type: 'flag' },

    // Size of the grid on the scale's weighing platforms.
    // A grid size that exceeds the width of the weighing platforms will result in an assertion failure.
    // Setting to a smaller gridSize is useful for testing what happens when the scale is full.
    gridSize: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 6, 6 ], // rows, columns
      isValidValue: function( value ) {
        return ( value.length === 2 );
      }
    },

    // Number of items that are initially on the left weighing platform.
    // This is intended to be used for debugging and testing, not in production situations.
    // See https://github.com/phetsims/equality-explorer/issues/8
    leftItems: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0 ]
    },

    // Similar to leftItems, but for the right weighing platform.
    rightItems: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0 ]
    }
  } );

  equalityExplorer.register( 'EqualityExplorerQueryParameters', EqualityExplorerQueryParameters );

  //TODO migrate to common code? See https://github.com/phetsims/query-string-machine/issues/28
  if ( EqualityExplorerQueryParameters.log ) {

    // add a log function that displays messages in green
    equalityExplorer.log = function( message ) {
      console.log( '%clog: ' + message, 'color: #009900' );
    };

    // log the values of all query parameters
    for ( var property in EqualityExplorerQueryParameters ) {
      if ( EqualityExplorerQueryParameters.hasOwnProperty( property ) ) {
        equalityExplorer.log( property + '=' + EqualityExplorerQueryParameters[ property ] );
      }
    }
  }

  return EqualityExplorerQueryParameters;
} );
