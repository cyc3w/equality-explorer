// Copyright 2018, University of Colorado Boulder

/**
 * The 'Mystery' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerScreenIcons = require( 'EQUALITY_EXPLORER/common/EqualityExplorerScreenIcons' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SolveItModel = require( 'EQUALITY_EXPLORER/solveit/model/SolveItModel' );
  var SolveItScreenView = require( 'EQUALITY_EXPLORER/solveit/view/SolveItScreenView' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenSolveItString = require( 'string!EQUALITY_EXPLORER/screen.solveIt' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function SolveItScreen( options ) {

    options = _.extend( {
      name: screenSolveItString,
      backgroundColorProperty: new Property( EqualityExplorerColors.SOLVE_IT_SCREEN_BACKGROUND ),
      homeScreenIcon: EqualityExplorerScreenIcons.createSolveItHomeScreenIcon(),
      navigationBarIcon: EqualityExplorerScreenIcons.createSolveItNavigationBarIcon(),
    }, options );

    Screen.call( this,
      function() { return new SolveItModel(); },
      function( model ) { return new SolveItScreenView( model ); },
      options
    );
  }

  equalityExplorer.register( 'SolveItScreen', SolveItScreen );

  return inherit( Screen, SolveItScreen );
} );