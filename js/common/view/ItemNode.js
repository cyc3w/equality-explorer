// Copyright 2017, University of Colorado Boulder

/**
 * Visual representation of an item.
 * Origin is at the center of the item's icon.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ConstantItem = require( 'EQUALITY_EXPLORER/common/model/ConstantItem' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var HaloNode = require( 'EQUALITY_EXPLORER/common/view/HaloNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemDragHandler = require( 'EQUALITY_EXPLORER/common/view/ItemDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
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

    var iconNode = new Node( {
      children: [ item.icon ], // wrap the icon since we're using scenery DAG feature and need to offset it

      // put origin at the center of the icon
      centerX: 0,
      centerY: 0
    } );

    // shadow, offset from the icon
    var shadowNode = new Node( {
      children: [ item.iconShadow ], // wrap the shadow since we're using scenery DAG feature and need to offset it
      opacity: 0.4,
      right: iconNode.right + options.shadowOffset.width,
      bottom: iconNode.bottom + options.shadowOffset.height,
      visible: false
    } );

    assert && assert( !options.children, 'this type defines its children' );
    options.children = [ shadowNode, iconNode ];

    var haloRadius = 0.85 * Math.max( plate.cellSize.width, plate.cellSize.height );

    // @private {Node|null} halo around the icon
    this.haloNode = null;
    if ( item.constructor === ConstantItem || item.constructor === XItem ) {
      this.haloNode = new HaloNode( haloRadius, {
        center: iconNode.center,
        visible: false
      } );
      options.children.unshift( this.haloNode );
    }

    // Red dot at the origin
    if ( EqualityExplorerQueryParameters.showOrigin ) {
      options.children.push( new Circle( 4, { fill: 'red' } ) );
    }

    Node.call( this, options );

    // model controls location of this Node
    var locationObserver = function( location ) {
      self.translation = location;
    };
    item.locationProperty.link( locationObserver ); // unlink in dispose

    // model controls visibility of shadow
    item.shadowVisibleProperty.link( function( shadowVisible ) {
      shadowNode.visible = shadowVisible;
    } );

    // model controls visibility of halo
    item.haloVisibleProperty.link( function( haloVisible ) {
      if ( self.haloNode ) {
        self.haloNode.visible = haloVisible;
      }
    } );

    // @public so that ItemCreatorNode can forward events
    this.dragListener = new ItemDragHandler( this, item, itemCreator, plate, {
      haloRadius: haloRadius
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
    }
  } );
} );
