// Copyright 2017, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  var EqualityExplorerConstants = {

    SCREEN_VIEW_LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),

    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 20,

    PLUS: '\u002b',
    MINUS: '\u2212',
    TIMES: '\u00d7',
    DIVIDE: '\u00f7',

    X_RANGE: new RangeWithValue( -40, 40, 1 ),

    ACCORDION_BOX_TITLE_FONT_SIZE: 18
  };

  equalityExplorer.register( 'EqualityExplorerConstants', EqualityExplorerConstants );

  return EqualityExplorerConstants;
} );
