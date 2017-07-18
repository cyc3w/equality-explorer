// Copyright 2017, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {Item} item
   * @param {Object} [options]
   * @constructor
   */
  function ItemNode( item, options ) {

    options = _.extend( {
      cursor: 'pointer'
    }, options );

    var self = this;

    // @public (read-only)
    this.item = item;

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ item.icon ]; // wrap the icon since we're using scenery DAG feature

    Node.call( this, options );

    // synchronize location with model
    var locationObserver = function( location ) {
      self.center = location;
    };
    item.locationProperty.link( locationObserver ); // unlink in dispose

    // {Vector2} where the drag started relative to locationProperty, in parent view coordinates
    var startDragOffset;

    // @public (read-only)
    this.dragListener = new SimpleDragHandler( {

      allowTouchSnag: options.allowTouchSnag,

      start: function( event, trail ) {
        item.dragging = true;
        startDragOffset = self.globalToParentPoint( event.pointer.point ).minus( item.locationProperty.value );
      },

      drag: function( event, trail ) {
        var location = self.globalToParentPoint( event.pointer.point ).minus( startDragOffset );
        var boundedLocation = item.dragBounds.closestPointTo( location );
        item.moveTo( boundedLocation );
      },
      
      end: function( event, trail ) {
        item.dragging = false;
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

    // @public @override
    dispose: function() {
      this.disposeItemNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
