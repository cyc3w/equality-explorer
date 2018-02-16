// Copyright 2018, University of Colorado Boulder

//TODO merge this into ConstantTerm
/**
 * Term whose value is a constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var Term2 = require( 'EQUALITY_EXPLORER/common/model/Term2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTerm2( options ) {

    options = _.extend( {
      value: ReducedFraction.ONE // {ReducedFraction} initial value
    }, options );

    // @public {Property.<ReducedFraction>}
    this.valueProperty = new Property( options.value );

    Term2.call( this, options );
  }

  equalityExplorer.register( 'ConstantTerm2', ConstantTerm2 );

  return inherit( Term2, ConstantTerm2, {

    // @public
    reset: function() {
      this.valueProperty.reset();
      Term2.prototype.reset.call( this );
    },

    /**
     * Adds an integer value to the constant.
     * @param {number} value
     * @public
     */
    plus: function( value ) {
      this.valueProperty.value = this.valueProperty.value.plus( value );
    },

    /**
     * Subtracts an integer value from the constant.
     * @param {number} value
     * @public
     */
    minus: function( value ) {
      this.valueProperty.value = this.valueProperty.value.minus( value );
    },

    /**
     * Multiplies the number of terms by an integer value.
     * @param {number} value
     * @public
     */
    times: function( value ) {
      this.valueProperty.value = this.valueProperty.value.times( value );
    },

    /**
     * Divides the number of terms by an integer value.
     * @param {number} value
     * @public
     */
    divide: function( value ) {
      this.valueProperty.value = this.valueProperty.value.divide( value );
    }
  } );
} );
 