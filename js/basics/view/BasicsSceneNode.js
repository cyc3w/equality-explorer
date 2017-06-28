// Copyright 2017, University of Colorado Boulder

/**
 * Displays a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalanceScaleNode = require( 'EQUALITY_EXPLORER/common/view/BalanceScaleNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EquationAccordionBox = require( 'EQUALITY_EXPLORER/common/view/EquationAccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemsPanel = require( 'EQUALITY_EXPLORER/common/view/ItemsPanel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var SnapshotsAccordionBox = require( 'EQUALITY_EXPLORER/common/view/SnapshotsAccordionBox' );

  /**
   * @param {BasicsScene} scene
   * @param {Property.<BasicsScene>} sceneProperty
   * @param {Bounds2} layoutBounds
   * @constructor
   */
  function BasicsSceneNode( scene, sceneProperty, layoutBounds ) {

    var self = this;

    // view-specific Properties
    this.equationAccordionBoxExpandedProperty = new Property( true );
    this.snapshotsAccordionBoxExpandedProperty = new Property( true );

    var dragLayer = new Node();

    var snapshotsAccordionBox = new SnapshotsAccordionBox( scene.leftItemCreators, scene.rightItemCreators, {
      expandedProperty: this.snapshotsAccordionBoxExpandedProperty,
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    var equationAccordionBox = new EquationAccordionBox( scene.leftItemCreators, scene.rightItemCreators, {
      expandedProperty: this.equationAccordionBoxExpandedProperty,
      centerX: layoutBounds.left + ( snapshotsAccordionBox.left - layoutBounds.left ) / 2,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    var leftItemsPanel = new ItemsPanel( scene.leftItemCreators, dragLayer, {
      stroke: EqualityExplorerColors.LEFT_PLATFORM_COLOR,
      right: equationAccordionBox.centerX - 40,
      bottom: layoutBounds.bottom - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    var rightItemsPanel = new ItemsPanel( scene.rightItemCreators, dragLayer, {
      stroke: EqualityExplorerColors.RIGHT_PLATFORM_COLOR,
      left: equationAccordionBox.centerX + 40,
      bottom: leftItemsPanel.bottom
    } );

    var scaleNode = new BalanceScaleNode( scene.scale );

    Node.call( this, {
      children: [
        snapshotsAccordionBox,
        equationAccordionBox,
        leftItemsPanel,
        rightItemsPanel,
        scaleNode,
        dragLayer
      ]
    } );

    // unlink not needed, BasicsSceneNodeNode exists for lifetime of the sim
    sceneProperty.link( function( newScene ) {
      self.visible = ( newScene === scene );
    } );
  }

  equalityExplorer.register( 'BasicsSceneNode', BasicsSceneNode );

  return inherit( Node, BasicsSceneNode, {

    // @public
    reset: function() {
      this.equationAccordionBoxExpandedProperty.reset();
      this.snapshotsAccordionBoxExpandedProperty.reset();
    }
  } );
} );
