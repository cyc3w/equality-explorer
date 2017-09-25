// Copyright 2017, University of Colorado Boulder

/**
 * Model for the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumbersScene = require( 'EQUALITY_EXPLORER/numbers/model/NumbersScene' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function NumbersModel() {

    // @public (read-only)
    this.scene = new NumbersScene();

    //TODO make this go away
    // @public
    this.sceneProperty = new Property( this.scene );
    this.sceneProperty.lazyLink( function( scene ) {
      throw new Error( 'sceneProperty should never change, there is only 1 scene' );
    } );
  }

  equalityExplorer.register( 'NumbersModel', NumbersModel );

  return inherit( Object, NumbersModel, {

    // @public resets the model
    reset: function() {
      this.scene.reset();
    },

    // @public
    step: function( dt ) {
      this.scene.step( dt );
    }
  } );
} );