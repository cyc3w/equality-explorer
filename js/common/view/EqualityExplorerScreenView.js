// Copyright 2017, University of Colorado Boulder

/**
 * Base type for ScreenViews in the Equality Explorer sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {Object} model - any Object that has a reset function
   * @constructor
   */
  function EqualityExplorerScreenView( model ) {

    var self = this;
    
    ScreenView.call( this );

    // @public (read-only) for layout only
    this.resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset && model.reset(); // reset model
        self.reset && self.reset(); // reset view
      },
      right: this.layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( this.resetAllButton );
  }

  equalityExplorer.register( 'EqualityExplorerScreenView', EqualityExplorerScreenView );

  return inherit( ScreenView, EqualityExplorerScreenView );
} );