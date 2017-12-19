// Copyright 2017, University of Colorado Boulder

/**
 * VariableItem is an item associated with the variable 'x' and can be summed with other VariableItems.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractItem = require( 'EQUALITY_EXPLORER/common/model/AbstractItem' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {string} symbol
   * @param {NumberProperty} weightProperty
   * @param {number} sign - determines the sign of 'x' (1 positive, -1 negative)
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function VariableItem( symbol, weightProperty, sign, icon, shadow, options ) {

    assert && assert( sign === 1 || sign === -1, 'invalid sign: ' + sign );
    
    // @public
    this.symbol = symbol;

    // @public dynamic weight, since 'x' is a variable
    this.weightProperty = weightProperty;

    // @public (read-only) the sign of 'x' (1 positive, -1 negative)  
    this.sign = sign;

    // @public whether the item's halo is visible
    this.haloVisibleProperty = new BooleanProperty( false );

    AbstractItem.call( this, icon, shadow, options );
  }

  equalityExplorer.register( 'VariableItem', VariableItem );

  return inherit( AbstractItem, VariableItem, {

    /**
     * Gets the item's weight.
     * @returns {number}
     * @public
     * @override
     */
    get weight() {
      return this.weightProperty.value;
    }
  } );
} );
 