// Copyright 2017, University of Colorado Boulder

/**
 * XItemCreator creates and manages XItems (items that are associated with the variable 'x').
 *
 * @author Chris Malley (PixelZoom, Inc.)     
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractItemCreator = require( 'EQUALITY_EXPLORER/common/model/AbstractItemCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Util = require( 'DOT/Util' );
  var XItem = require( 'EQUALITY_EXPLORER/common/model/XItem' );

  /**
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function XItemCreator( icon, iconShadow, options ) {

    var self = this;

    options = _.extend( {
      weight: 1,
      multiplier: 1 // determines the sign of 'x' (1 positive, -1 negative)
    }, options );

    assert && assert( options.multiplier === 1 || options.multiplier === -1,
      'invalid multiplier: ' + options.multiplier );

    // @public
    this.weightProperty = new NumberProperty( options.weight, {
      isValidValue: function( value ) { return Util.isInteger( value ); } // integer values
    } );

    // @public (read-only)
    this.multiplier = options.multiplier;

    AbstractItemCreator.call( this, icon, iconShadow, options );

    // Update the weight of all XItems. unlink unnecessary
    this.weightProperty.link( function( weight ) {
      var items = self.getItems();
      for ( var i = 0; i < items.length; i++ ) {
        items[ i ].weightProperty.value = weight;
      }
    } );
  }

  equalityExplorer.register( 'XItemCreator', XItemCreator );

  return inherit( AbstractItemCreator, XItemCreator, {

    /**
     * Instantiates an XItem.
     * @param {Vector2} location
     * @returns {AbstractItem}
     * @protected
     * @override
     */
    createItemProtected: function( location ) {
      return new XItem( this.weightProperty, this.multiplier, this.icon, this.iconShadow, {
        location: location,
        dragBounds: this.dragBounds
      } );
    },

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
 