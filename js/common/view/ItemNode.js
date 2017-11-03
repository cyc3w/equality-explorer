// Copyright 2017, University of Colorado Boulder

/**
 * Visual representation of an item.
 * Origin is in the center of the item's icon.
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
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var XItem = require( 'EQUALITY_EXPLORER/common/model/XItem' );

  /**
   * @param {AbstractItem} item
   * @param {AbstractItemCreator} itemCreator
   * @param {Plate} plate
   * @param {Object} [options]
   * @constructor
   */
  function ItemNode( item, itemCreator, plate, options ) {

    var self = this;

    options = _.extend( {
      cursor: 'pointer',
      shadowOffset: new Dimension2( 4, 4 )
    }, options );

    // @public (read-only)
    this.item = item;

    // @private
    this.itemCreator = itemCreator;

    var shadowNode = new Node( {
      children: [ item.iconShadow ], // wrap the icon since we're using scenery DAG feature and need to offset it
      opacity: 0.4,
      left: item.icon.left + options.shadowOffset.width,
      top: item.icon.top + options.shadowOffset.height,
      visible: false
    } );

    assert && assert( !options.children, 'this type defines its children' );
    options.children = [ shadowNode, item.icon ]; // wrap the icon since we're using scenery DAG feature

    Node.call( this, options );

    // synchronize location with model
    var locationObserver = function( location ) {

      // compensate for the shadow, so that origin is in the center of the icon
      self.centerX = location.x + ( options.shadowOffset.width / 2 );
      self.centerY = location.y + ( options.shadowOffset.height / 2 );
    };
    item.locationProperty.link( locationObserver ); // unlink in dispose

    // {Vector2} where the drag started relative to locationProperty, in parent view coordinates
    var startDragOffset;

    // {Node} item the is the inverse of the item being dragged. E.g. 1 and -1, x and -x
    var inverseItem = null;

    // @public (read-only)
    this.dragListener = new SimpleDragHandler( {

      allowTouchSnag: true,

      start: function( event, trail ) {

        item.dragging = true;
        shadowNode.visible = true;

        self.moveToFront();

        // move up and left, same amount as shadow offset so the shadow appears where the item was
        self.item.locationProperty.value =
          self.item.locationProperty.value.plusXY( -options.shadowOffset.width, -options.shadowOffset.height );

        if ( plate.containsItem( item ) ) {
          plate.removeItem( item );
          self.itemCreator.removeItemFromScale( item );
        }
        startDragOffset = self.globalToParentPoint( event.pointer.point ).minus( item.locationProperty.value );
      },

      drag: function( event, trail ) {

        // move the item
        var location = self.globalToParentPoint( event.pointer.point ).minus( startDragOffset );
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
          //TODO hide halo around previous inverseItem
        }

        // handle new inverse item
        if ( !inverseItem ) {
          shadowNode.visible = true;
        }
        else if ( previousInverseItem !== inverseItem ) {
          //TODO show halo around item and inverseItem
          shadowNode.visible = false;
        }
      },

      end: function( event, trail ) {

        item.dragging = false;
        shadowNode.visible = false;

        if ( item.locationProperty.value.y > plate.locationProperty.value.y ) {

          // item was released below the plate, animate back to panel and dispose
          self.animateToPanel( item );
        }
        else if ( ( item instanceof ConstantItem ) || ( item instanceof XItem ) ) {

          // sum to zero, delete item and its inverse
          if ( inverseItem && inverseItem.isInverseOf( item ) ) {

            item.dispose();
            inverseItem.dispose();
            //TODO show '0' or '0x' in yellow halo, fade out
          }
          else {

            // item was released above the plate, animate to closest empty cell
            self.animateToClosestEmptyCell( item, plate );
          }
        }
        else {

          // item was released above the plate, animate to closest empty cell
          self.animateToClosestEmptyCell( item, plate );
        }
      }
    } );
    this.addInputListener( this.dragListener );

    // @private
    this.disposeItemNode = function() {
      item.locationProperty.unlink( locationObserver );
    };
  }

  equalityExplorer.register( 'ItemNode', ItemNode );

  return inherit( Node, ItemNode, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeItemNode();
      Node.prototype.dispose.call( this );
    },

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
     * @param {Plate} plate
     * @private
     */
    animateToClosestEmptyCell: function( item, plate ) {

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
              self.animateToClosestEmptyCell( item, plate );
            }
          },

          // When the item reaches the cell, put it in the cell.
          animationCompletedCallback: function() {
            plate.addItem( item, cellIndex );
            self.itemCreator.addItemToScale( item );
          }
        } );
      }
    }
  } );
} );
