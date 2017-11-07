// Copyright 2017, University of Colorado Boulder

/**
 * Drag handler for items.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantItem = require( 'EQUALITY_EXPLORER/common/model/ConstantItem' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var XItem = require( 'EQUALITY_EXPLORER/common/model/XItem' );

  /**
   * @param {Node} itemNode - Node that the listener is attached to, can't use event.currentTarget due to forwarding
   * @param {AbstractItem} item
   * @param {AbstractItemCreator} itemCreator
   * @param {Plate} plate
   * @param {Object} [options]
   * @constructor
   */
  function ItemDragHandler( itemNode, item, itemCreator, plate, options ) {

    var self = this;

    options = _.extend( {
      offset: new Dimension2( -4, -4 ), // offset to move when drag starts, up and left
      haloRadius: 10 // radius of the halo on SumToZeroNode
    }, options );

    // {Vector2} where the drag started relative to locationProperty, in parent view coordinates
    var startDragOffset = null;

    // {Node} item the is the inverse of the item being dragged. E.g. 1 and -1, x and -x
    var inverseItem = null;

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      /**
       * Called at the start of a drag cycle, on pointer down.
       * @param {Event} event
       * @param {Trail} trail
       */
      start: function( event, trail ) {

        item.dragging = true;
        item.shadowVisibleProperty.value = true;

        itemNode.moveToFront();

        // move up and left
        item.locationProperty.value =
          item.locationProperty.value.plusXY( options.offset.width, options.offset.height );

        if ( plate.containsItem( item ) ) {
          plate.removeItem( item );
          itemCreator.removeItemFromScale( item );
        }
        startDragOffset = itemNode.globalToParentPoint( event.pointer.point ).minus( item.locationProperty.value );
      },

      /**
       * Called while the Node is being dragged.
       * @param {Event} event
       * @param {Trail} trail
       */
      drag: function( event, trail ) {

        // move the item
        var location = itemNode.globalToParentPoint( event.pointer.point ).minus( startDragOffset );
        var boundedLocation = item.dragBounds.closestPointTo( location );
        item.moveTo( boundedLocation );

        // identify inverse item
        var previousInverseItem = inverseItem;
        inverseItem = null;
        if ( ( item instanceof ConstantItem ) || ( item instanceof XItem ) ) {
          var itemOnPlate = plate.getItemAtLocation( item.locationProperty.value );
          if ( itemOnPlate && itemOnPlate.isInverseOf( item ) ) {
            inverseItem = itemOnPlate;
          }
        }

        // clean up previous inverse item
        if ( previousInverseItem && ( previousInverseItem !== inverseItem ) ) {
          previousInverseItem.haloVisibleProperty.value = false;
        }

        // handle new inverse item
        if ( !inverseItem ) {
          item.shadowVisibleProperty.value = true;
          item.haloVisibleProperty.value = false;
        }
        else if ( previousInverseItem !== inverseItem ) {
          item.shadowVisibleProperty.value = false;
          item.haloVisibleProperty.value = true;
          inverseItem.haloVisibleProperty.value = true;
        }
      },

      /**
       * Called at the end of a drag cycle, on pointer up.
       * @param {Event} event
       * @param {Trail} trail
       */
      end: function( event, trail ) {

        item.dragging = false;
        item.shadowVisibleProperty.value = false;

        if ( item.locationProperty.value.y > plate.locationProperty.value.y ) {

          // item was released below the plate, animate back to panel and dispose
          self.animateToPanel( item );
        }
        else if ( ( item instanceof ConstantItem ) || ( item instanceof XItem ) ) {

          // sum to zero, delete item and its inverse
          if ( inverseItem && inverseItem.isInverseOf( item ) ) {

            // determine where the '0' appears
            var inverseItemLocation = inverseItem.locationProperty.value;
            var parent = itemNode.getParent();
            var itemConstructor = item.constructor;

            // delete the 2 items that sum to zero
            item.dispose();
            inverseItem.dispose();

            // show '0' or '0x' in yellow halo, fade out
            var sumToZeroNode = new SumToZeroNode( itemConstructor, {
              haloRadius: options.haloRadius,
              center: inverseItemLocation
            } );
            parent.addChild( sumToZeroNode );
            sumToZeroNode.startAnimation();
          }
          else {

            // the item doesn't sum to zero with another item, animate to closest empty cell
            self.animateToClosestEmptyCell( item, itemCreator, plate );
          }
        }
        else {

          // item was released above the plate, animate to closest empty cell
          self.animateToClosestEmptyCell( item, itemCreator, plate );
        }
      }
    } );
  }

  equalityExplorer.register( 'ItemDragHandler', ItemDragHandler );

  return inherit( SimpleDragHandler, ItemDragHandler, {

    /**
     * Returns an Item to the panel where it was created.
     * @param {AbstractItem} item
     * @private
     */
    animateToPanel: function( item ) {
      item.animateTo( item.locationProperty.initialValue, {
        animationCompletedCallback: function() {
          item.dispose();
        }
      } );
    },

    /**
     * Animates an item to an empty cell on the plate.
     * @param {AbstractItem} item
     * @param {AbstractItemCreator} itemCreator
     * @param {Plate} plate
     * @private
     */
    animateToClosestEmptyCell: function( item, itemCreator, plate ) {

      var self = this;

      var cellIndex = plate.getClosestEmptyCell( item.locationProperty.value );
      if ( cellIndex === -1 ) {

        // Plate has become full, or there is no available cell above the item's location.
        // Return the item to panel.
        this.animateToPanel( item );
      }
      else {

        var cellLocation = plate.getLocationForCell( cellIndex );

        item.animateTo( cellLocation, {

          // If the target cell has become occupied, choose another cell.
          animationStepCallback: function() {
            if ( !plate.isEmptyCell( cellIndex ) ) {
              self.animateToClosestEmptyCell( item, itemCreator, plate );
            }
          },

          // When the item reaches the cell, put it in the cell.
          animationCompletedCallback: function() {
            plate.addItem( item, cellIndex );
            itemCreator.addItemToScale( item );
          }
        } );
      }
    }
  } );
} );
 