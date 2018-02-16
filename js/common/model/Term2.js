// Copyright 2018, University of Colorado Boulder

//TODO merge this into term hierarchy that was formerly item hierarchy
/**
 * Abstract base type for terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerMovable = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerMovable' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  function Term2( options ) {
    EqualityExplorerMovable.call( this, options );
  }

  equalityExplorer.register( 'Term2', Term2 );

  return inherit( EqualityExplorerMovable, Term2, {

    /**
     * Applies a universal operation to this term.
     * If a term does not support the operator, the operation is ignored.
     * @param {UniversalOperation} operation
     * @public
     */
    apply: function( operation ) {
      if ( operation.operator === EqualityExplorerConstants.PLUS ) {
        this.plus && this.plus( operation.operand );
      }
      else if ( operation.operator === EqualityExplorerConstants.MINUS ) {
        this.minus && this.minus( operation.operand );
      }
      else if ( operation.operator === EqualityExplorerConstants.TIMES ) {
        this.times( operation.operand );
      }
      else if ( operation.operator === EqualityExplorerConstants.DIVIDE ) {
        this.divide( operation.operand );
      }
      else {
        throw new Error( 'invalid operator: ' + operation.operator );
      }
    }
  } );
} );