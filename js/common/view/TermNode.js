// Copyright 2017, University of Colorado Boulder

/**
 * Visual representation of a term.
 * Origin is at the center of the term's icon.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HaloNode = require( 'EQUALITY_EXPLORER/common/view/HaloNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var TermDragListener = require( 'EQUALITY_EXPLORER/common/view/TermDragListener' );

  /**
   * @param {AbstractTerm} term - associated model element
   * @param {AbstractTermCreator} termCreator - the creator of term
   * @param {Plate} plate - the plate that term is associated with
   * @param {Object} [options]
   * @constructor
   */
  function TermNode( term, termCreator, plate, options ) {

    var self = this;

    options = _.extend( {
      cursor: 'pointer',
      shadowOffset: new Dimension2( 4, 4 )
    }, options );

    // @public (read-only)
    this.term = term;

    // @private
    this.termCreator = termCreator;

    var iconNode = new Node( {
      children: [ term.icon ], // wrap the icon since we're using scenery DAG feature and need to offset it

      // put origin at the center of the icon
      centerX: 0,
      centerY: 0
    } );

    // shadow, offset from the icon
    var shadowNode = new Node( {
      children: [ term.shadow ], // wrap the shadow since we're using scenery DAG feature and need to offset it
      opacity: 0.4,
      right: iconNode.right + options.shadowOffset.width,
      bottom: iconNode.bottom + options.shadowOffset.height,
      visible: false
    } );

    // model controls visibility of shadow
    term.shadowVisibleProperty.link( function( shadowVisible ) {
      shadowNode.visible = shadowVisible;
    } );

    assert && assert( !options.children, 'this type defines its children' );
    options.children = [ shadowNode, iconNode ];

    var haloRadius = Math.max( term.icon.width, term.icon.height );

    // @private {Node|null} halo around the icon
    this.haloNode = null;
    if ( term.haloVisibleProperty ) {

      this.haloNode = new HaloNode( haloRadius, {
        center: iconNode.center,
        visible: false
      } );
      options.children.unshift( this.haloNode );

      // model controls visibility of halo, unlink unnecessary
      term.haloVisibleProperty.link( function( haloVisible ) {
        if ( self.haloNode ) {
          self.haloNode.visible = haloVisible;
        }
      } );
    }

    // Red dot at the origin
    if ( phet.chipper.queryParameters.dev ) {
      options.children.push( new Circle( 2, { fill: 'red' } ) );
    }

    Node.call( this, options );

    // model controls location of this Node
    var locationObserver = function( location ) {
      self.translation = location;
    };
    term.locationProperty.link( locationObserver ); // unlink required

    // @private removeListener and dispose required
    this.dragListener = new TermDragListener( this, term, termCreator, plate, {
      haloRadius: haloRadius
    } );
    this.addInputListener( this.dragListener ); // removeListener required

    // @private
    this.disposeTermNode = function() {
      term.locationProperty.unlink( locationObserver );
      self.removeInputListener( self.dragListener );
      self.dragListener.dispose();
    };
  }

  equalityExplorer.register( 'TermNode', TermNode );

  return inherit( Node, TermNode, {

    /**
     * Starts a drag cycle.
     * The user drags a new term out of a panel below the scale by clicking on an TermCreatorNode.
     * That action causes TermCreatorNode to instantiate a TermNode.  This function allows
     * TermCreatorNode to forward the startDrag event to the TermNode that it created.
     * @param {Event} event
     */
    startDrag: function( event ) {
      this.dragListener.startDrag( event );
    },

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeTermNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
