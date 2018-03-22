// Copyright 2017-2018, University of Colorado Boulder

/**
 * Model for the 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerModel = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OperationsScene = require( 'EQUALITY_EXPLORER/solving/model/OperationsScene' );

  /**
   * @constructor
   */
  function OperationsModel() {

    // this screen has 1 scene
    EqualityExplorerModel.call( this, [ new OperationsScene() ] );
  }

  equalityExplorer.register( 'OperationsModel', OperationsModel );

  return inherit( EqualityExplorerModel, OperationsModel );
} );