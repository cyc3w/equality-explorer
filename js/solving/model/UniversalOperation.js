// Copyright 2018, University of Colorado Boulder

/**
 * A universal operation, which can be applied to a set of terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {string} operator
   * @param {number} operand
   * @constructor
   */
  function UniversalOperation( operator, operand ) {

    assert && assert( typeof operator === 'string', 'invalid operator: ' + operator );
    assert && assert( typeof operand === 'number' && Util.isInteger( operand ), 'invalid operand: ' + operand );

    // @public (read-only)
    this.operator = operator;
    this.operand = operand;
  }

  equalityExplorer.register( 'UniversalOperation', UniversalOperation );

  return inherit( Object, UniversalOperation, {

    /**
     * Applies the operation to terms.
     * @param {Term[]} terms
     * @public
     */
    applyTo: function( terms ) {
      for ( var i = 0; i < terms.length; i++ ) {
        terms[ i ].apply( this );
      }
    }
  } );
} );
