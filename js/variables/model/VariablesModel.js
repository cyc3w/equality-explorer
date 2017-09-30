// Copyright 2017, University of Colorado Boulder

/**
 * Model for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var VariablesScene = require( 'EQUALITY_EXPLORER/variables/model/VariablesScene' );

  /**
   * @constructor
   */
  function VariablesModel() {

    // @public (read-only)
    this.variableRange = new RangeWithValue( -40, 40, 1 );

    // @public
    this.variableValueProperty = new Property( this.variableRange.defaultValue );

    // @public (read-only)
    this.scene = new VariablesScene();
  }

  equalityExplorer.register( 'VariablesModel', VariablesModel );

  return inherit( Object, VariablesModel, {

    // @public resets the model
    reset: function() {
      this.variableValueProperty.reset();
      this.scene.reset();
    },

    // @public
    step: function( dt ) {
      this.scene.step( dt );
    }
  } );
} );