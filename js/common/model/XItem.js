// Copyright 2017, University of Colorado Boulder

/**
 * XItem is an item associated with the variable 'x' and can be summed with other XItems.
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
   * @param {NumberProperty} weightProperty
   * @param {number} multiplier - determines the sign of 'x' (1 positive, -1 negative)
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function XItem( weightProperty, multiplier, icon, iconShadow, options ) {

    assert && assert( multiplier === 1 || multiplier === -1, 'invalid multiplier: ' + multiplier );

    // @public
    this.weightProperty = weightProperty;

    // @public (read-only) 
    this.multiplier = multiplier;

    // @public
    this.haloVisibleProperty = new BooleanProperty( false );

    AbstractItem.call( this, icon, iconShadow, options );
  }

  equalityExplorer.register( 'XItem', XItem );

  return inherit( AbstractItem, XItem, {

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
 