// Copyright 2017, University of Colorado Boulder

/**
 * Creates Items with a specified value and icon.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Item = require( 'EQUALITY_EXPLORER/common/model/Item' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {string} name - internal name, not displayed to the user
   * @param {number} weight - initial weight of Items
   * @param {Node} icon
   * @param {Object} [options]
   * @constructor
   */
  function ItemCreator( name, weight, icon, options ) {

    options = _.extend( {
      constantTerm: false, // {boolean} do Items evaluate to a constant?
      dragBounds: Bounds2.EVERYTHING
    }, options );

    // @public (read-only)
    this.name = name;
    this.icon = icon;
    this.constantTerm = options.constantTerm;

    // @public {Bounds2} drag bounds for Items created
    this.dragBounds = options.dragBounds;

    // @public {Property.<number>} weight of Items
    this.weightProperty = new Property( weight );

    // @public {ObservableArray.<Item>} Items that have been created
    this.items = new ObservableArray();

    // @public {Property.<boolean>} is this ItemCreator enabled?
    this.enabledProperty = new Property( true );

    // @public {WeightingPlatform}
    this.weighingPlatform = null; // set after construction, when associated with a BalanceScale
  }

  equalityExplorer.register( 'ItemCreator', ItemCreator );

  return inherit( Object, ItemCreator, {

    // @public
    reset: function() {
      this.weightProperty.reset();
    },

    /**
     * Animate Items.
     * @param {number} dt - time since the previous step, in seconds
     */
    step: function( dt ) {
      this.items.forEach( function( item ) {
         item.step( dt );
      } );
    },

    /**
     * Creates an Item.
     * @param {Object} [options] - same as Item constructor
     * @returns {Item}
     * @public
     */
    createItem: function( options ) {

      options = _.extend( {
        constantTerm: this.constantTerm,
        dragBounds: this.dragBounds
      }, options );

      var item = new Item( this.name, this.weightProperty, this.icon, options );
      this.items.add( item );

      // clean up when the item is disposed
      item.disposedEmitter.addListener( this.removeItem.bind( this ) );

      return item;
    },

    /**
     * Removes an Item.
     * @param {Item} item
     * @private
     */
    removeItem: function( item ) {
      assert && assert( this.items.contains( item ), 'item not found: ' + item.toString() );
      this.items.remove( item );
    },

    /**
     * Gets the total weight of all items.
     * @returns {number}
     * @public
     */
    get total() { return this.items.length * this.weightProperty.value; }
  } );
} );
