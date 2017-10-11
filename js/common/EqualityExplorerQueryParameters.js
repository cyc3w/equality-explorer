// Copyright 2017, University of Colorado Boulder

/**
 * Query parameters that are specific to the Equality Explorer sim.
 * Running with ?log will print these query parameters and their values to the console.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Util = require( 'DOT/Util' );

  var EqualityExplorerQueryParameters = QueryStringMachine.getAll( {

    // Makes all animation run slowly, so that things are easier to grab while they're animating.
    // Useful for testing multi-touch.
    slowMotion: { type: 'flag' },

    // Shows the origin of various objects, rendered as a red dot.
    showOrigin: { type: 'flag' },

    // Shows the grid on each of the plates.
    showGrid: { type: 'flag' },

    // Shows the drag bounds for Items.
    // Rendered as a dotted rectangle, color coded to the associated plate.
    showDragBounds: { type: 'flag' },

    // Number of items that are initially on the left plate in the Basics screen.
    // This is intended to be used for debugging and testing, not in production situations.
    // See https://github.com/phetsims/equality-explorer/issues/8
    leftBasics: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0 ], // in the order that Items appear in the panel below the scale
      isValidValue: function( value ) {
        return isValidItemsArray( value, 3 );
      }
    },

    // Similar to leftBasics, but for the right plate in the Basics screen.
    rightBasics: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0 ],
      isValidValue: function( value ) {
        return isValidItemsArray( value, 3 );
      }
    },

    // Number of items that are initially on the left plate in the Numbers screen.
    // This is intended to be used for debugging and testing, not in production situations.
    // See https://github.com/phetsims/equality-explorer/issues/8
    leftNumbers: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0 ], // in the order that Items appear in the panel below the scale
      isValidValue: function( value ) {
        return isValidItemsArray( value, 2 );
      }
    },

    // Similar to leftNumbers, but for the right plate in the Numbers screen.
    rightNumbers: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0 ],
      isValidValue: function( value ) {
        return isValidItemsArray( value, 2 );
      }
    },

    // Number of items that are initially on the left plate in the Variables screen.
    // This is intended to be used for debugging and testing, not in production situations.
    // See https://github.com/phetsims/equality-explorer/issues/8
    leftVariables: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0, 0 ], // in the order that Items appear in the panel below the scale
      isValidValue: function( value ) {
        return isValidItemsArray( value, 4 );
      }
    },

    // Similar to leftVariables, but for the right plate in the Variables screen.
    rightVariables: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0, 0 ],
      isValidValue: function( value ) {
        return isValidItemsArray( value, 4 );
      }
    }
  } );

  equalityExplorer.register( 'EqualityExplorerQueryParameters', EqualityExplorerQueryParameters );

  // Validates an array that indicates the number of Items on a plate
  function isValidItemsArray( array, length ) {
    return ( array.length === length ) &&
           // every value in the array is an integer
           ( _.every( array, function( value ) { return value >= 0 && Util.isInteger( value ); } ) ) &&
           // sum of values in the array doesn't exceed number of cells
           ( _.reduce( array, function( sum, n ) { return sum + n; } ) <= 36 );
  }

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( EqualityExplorerQueryParameters, null, 2 ) );

  return EqualityExplorerQueryParameters;
} );
