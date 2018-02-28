// Copyright 2018, University of Colorado Boulder

/**
 * Term whose value a coefficient times some variable value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );

  /**
   * @param {string} symbol
   * @param {NumberProperty} variableValueProperty
   * @param {Object} [options]
   * @constructor
   */
  function VariableTerm( symbol, variableValueProperty, options ) {

    assert && assert( variableValueProperty instanceof NumberProperty, 'invalid variableValueProperty' );

    var self = this;

    options = _.extend( {
      coefficient: ReducedFraction.withInteger( 1 )
    }, options );

    assert && assert( options.coefficient instanceof ReducedFraction, 'invalid coefficient' );
    assert && assert( options.coefficient.toDecimal() !== 0, 'coefficient cannot be zero' );

    // @public (read-only)
    this.symbol = symbol;

    // @public {ReducedFraction}
    this.coefficient = options.coefficient;

    // @public (read-only) {NumberProperty}
    this.variableValueProperty = variableValueProperty;

    // @public (read-only) {Property.<ReducedFraction>}
    this.weightProperty = new DerivedProperty( [ variableValueProperty ],
      function( variableValue ) {
        return self.coefficient.timesInteger( variableValue );
      } );

    Term.call( this, options );
  }

  equalityExplorer.register( 'VariableTerm', VariableTerm );

  return inherit( Term, VariableTerm, {

    /**
     * Gets the weight of this term.
     * @returns {ReducedFraction}
     * @public
     * @override
     */
    get weight() {
      return this.weightProperty.value;
    },

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.weightProperty.dispose();
      Term.prototype.dispose.call( this );
    },

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {
      return 'VariableTerm:' +
             ' coefficient=' + this.coefficient +
             ' symbol=' + this.symbol +
             ' variableValue=' + this.variableValueProperty.value;
    },

    /**
     * Is this term the inverse of a specified term?
     * Two variable terms are inverses if they represent the same variable and have inverse coefficients.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseOf: function( term ) {
      return ( term instanceof VariableTerm ) &&
             ( this.symbol === term.symbol ) &&
             ( this.variableProperty === term.variableProperty ) &&  // same Property, not same value!
             ( this.coefficient.toDecimal() === -term.coefficient.toDecimal() ); // inverse coefficients
    }
  } );
} );
 