// Copyright 2018, University of Colorado Boulder

/**
 * Data structure for a constant term operand in a universal operation.
 * There's not much to this data structure. It's a type solely for differentiation with VariableTermOperand.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Fraction} constantValue
   * @constructor
   */
  function ConstantTermOperand( constantValue ) {

    assert && assert( constantValue instanceof Fraction, 'invalid constantValue: ' + constantValue );
    assert && assert( constantValue.isReduced(), 'constantValue must be reduced: ' + constantValue );

    // @public (read-only)
    this.constantValue = constantValue;
  }

  equalityExplorer.register( 'ConstantTermOperand', ConstantTermOperand );

  return inherit( Object, ConstantTermOperand, {

    /**
     * For debugging only. Do not rely on the format of this.
     * @public
     * @returns {string}
     */
    toString: function() {
      return 'ConstantTermOperand: ' + this.constantValue;
    }
  } );
} );