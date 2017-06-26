// Copyright 2017, University of Colorado Boulder

/**
 * The balance scale used throughout Equality Explorer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var BoxNode = require( 'EQUALITY_EXPLORER/common/view/BoxNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ClearScaleButton = require( 'EQUALITY_EXPLORER/common/view/ClearScaleButton' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OrganizeButton = require( 'EQUALITY_EXPLORER/common/view/OrganizeButton' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var WeighingPlatformNode = require( 'EQUALITY_EXPLORER/common/view/WeighingPlatformNode' );

  // colors
  var TOP_FACE_FILL = 'rgb( 177, 177, 177 )';
  var FRONT_FACE_FILL = 'rgb( 100, 100, 100 )';
  var FULCRUM_FILL = 'rgb( 204, 204, 204 )';
  var PLATFORM_PIVOT_FILL = 'rgb( 204, 204, 204 )';

  // base
  var BASE_WIDTH = 200;
  var BASE_HEIGHT = 40;
  var BASE_DEPTH = 10;
  
  // beam
  var BEAM_HEIGHT = 5;
  var BEAM_DEPTH = 8;
  
  // beam pivot
  var FULCRUM_HEIGHT = 40;
  var FULCRUM_TOP_WIDTH = 15;
  var FULCRUM_BOTTOM_WIDTH = 25;

  // platform pivots, connect a weighing platform to the beam
  var PLATFORM_PIVOT_DIAMETER = 16;
  var PLATFORM_PIVOT_OPTIONS = {
    fill: PLATFORM_PIVOT_FILL,
    stroke: 'black'
  };

  // arrow
  var ARROW_LENGTH = 75;

  /**
   * @param {BalanceScale} scale
   * @param {Object} [options]
   * @constructor
   */
  function BalanceScaleNode( scale, options ) {

    var self = this;

    options = _.extend( {
      leftPlatformFill: EqualityExplorerColors.LEFT_PLATFORM_COLOR,
      rightPlatformFill: EqualityExplorerColors.RIGHT_PLATFORM_COLOR
    }, options );

    options.centerX = scale.location.x;
    options.y = scale.location.y; //TODO not correct

    // the fulcrum that the beam balances on
    var fulcrumTaper = FULCRUM_BOTTOM_WIDTH - FULCRUM_TOP_WIDTH;
    var fulcrumShape = new Shape().polygon( [
      new Vector2( 0, 0 ),
      new Vector2( FULCRUM_TOP_WIDTH, 0 ),
      new Vector2( FULCRUM_TOP_WIDTH + fulcrumTaper / 2, FULCRUM_HEIGHT ),
      new Vector2( -fulcrumTaper / 2, FULCRUM_HEIGHT )
    ] );
    var fulcrumNode = new Path( fulcrumShape, {
      stroke: 'black',
      fill: FULCRUM_FILL,
      centerX: 0,
      top: 0
    } );

    // the base the supports the entire scale
    var baseNode = new BoxNode( {
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
      depth: BASE_DEPTH,
      stroke: 'black',
      topFill: TOP_FACE_FILL,
      frontFill: FRONT_FACE_FILL,
      centerX: fulcrumNode.centerX,
      top: fulcrumNode.bottom - ( BASE_DEPTH / 2 )
    } );

    // the beam that supports a plate on either end
    var beamNode = new BoxNode( {
      width: scale.beamWidth,
      height: BEAM_HEIGHT,
      depth: BEAM_DEPTH,
      stroke: 'black',
      topFill: TOP_FACE_FILL,
      frontFill: FRONT_FACE_FILL,
      centerX: baseNode.centerX,
      top: fulcrumNode.top - ( 0.5 * BEAM_DEPTH )
    } );

    // dashed line that is perpendicular to the base
    var dashedLine = new Line( 0, 0, 0, 1.2 * ARROW_LENGTH, {
      lineDash: [ 4, 4 ],
      stroke: 'black',
      centerX: beamNode.centerX,
      bottom: 0
    } );

    // arrow at the center on the beam, points perpendicular to the beam
    var arrowNode = new ArrowNode( 0, 0, 0, -ARROW_LENGTH, {
      headHeight: 20,
      headWidth: 15,
      centerX: beamNode.centerX,
      bottom: 0
    } );

    // pivot points that connect the platforms to the beam
    var platformPivotShape = new Shape().circle( 0, 0, PLATFORM_PIVOT_DIAMETER / 2 );
    var leftPivotNode = new Path( platformPivotShape, _.extend( {}, PLATFORM_PIVOT_OPTIONS,  {
      centerX: scale.platformXInset,
      bottom: -0.5 * BEAM_DEPTH
    } ) );
    beamNode.addChild( leftPivotNode );
    var rightPivotNode = new Path( platformPivotShape, _.extend( {}, PLATFORM_PIVOT_OPTIONS, {
      centerX: beamNode.width - scale.platformXInset,
      bottom: -0.5 * BEAM_DEPTH
    } ) );
    beamNode.addChild( rightPivotNode );

    // left platform
    var leftPlatformNode = new WeighingPlatformNode( {
      color: options.leftPlatformFill,
      center: beamNode.center // correct location handled by scale.angleProperty observer
    } );
    leftPlatformNode.setScaleMagnitude( scale.leftPlatform.diameter / leftPlatformNode.width, 1 );
    assert && assert( leftPlatformNode.width === scale.leftPlatform.diameter );

    // right platform
    var rightPlatformNode = new WeighingPlatformNode( {
      color: options.rightPlatformFill,
      center: beamNode.center // correct location handled by scale.angleProperty observer
    } );
    rightPlatformNode.setScaleMagnitude( scale.rightPlatform.diameter / rightPlatformNode.width, 1 );
    assert && assert( rightPlatformNode.width === scale.rightPlatform.diameter );

    var clearScaleButton = new ClearScaleButton( {
      touchAreaDilation: 5
      //TODO add ClearScaleButton listener
      //TODO disable ClearScaleButton when scale is empty
    } );

    var organizeButton = new OrganizeButton( {
      touchAreaXDilation: 5,
      touchAreaYDilation: 5
      //TODO disable OrganizeButton when scale is empty or organized
    } );

    // buttons in the front face of the base
    var buttonsParent = new HBox( {
      children: [ clearScaleButton, organizeButton ],
      spacing: 25,
      centerX: baseNode.centerX,
      centerY: baseNode.bottom - ( BASE_HEIGHT / 2 )
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [
      leftPlatformNode,
      rightPlatformNode,
      baseNode,
      buttonsParent,
      fulcrumNode,
      dashedLine,
      arrowNode,
      beamNode
    ];

    // draw a red dot at the origin
    if ( phet.chipper.queryParameters.dev ) {
      options.children.push( new Circle( 4, { fill: 'red' } ) );
    }

    Node.call( this, options );

    // unlink unnecessary, BalanceScaleNode exists for lifetime of sim
    scale.angleProperty.link( function( angle, oldAngle ) {

      var deltaAngle = angle - oldAngle;

      // rotate the beam about its pivot point
      beamNode.rotateAround( new Vector2( beamNode.centerX, beamNode.centerY ), deltaAngle );

      // rotate and fill the arrow
      arrowNode.rotateAround( new Vector2( arrowNode.centerX, arrowNode.bottom ), deltaAngle );
      arrowNode.fill = ( angle === 0 ) ? EqualityExplorerColors.SCALE_ARROW_BALANCED : EqualityExplorerColors.SCALE_ARROW_UNBALANCED;

      // left platform
      var leftPivotCenter = self.globalToLocalPoint( beamNode.localToGlobalPoint( leftPivotNode.center ) );
      leftPlatformNode.centerX = leftPivotCenter.x;
      leftPlatformNode.bottom = leftPivotCenter.y;

      // right platform
      var rightPivotCenter = self.globalToLocalPoint( beamNode.localToGlobalPoint( rightPivotNode.center ) );
      rightPlatformNode.centerX = rightPivotCenter.x;
      rightPlatformNode.bottom = rightPivotCenter.y;
    } );
  }

  equalityExplorer.register( 'BalanceScaleNode', BalanceScaleNode );

  return inherit( Node, BalanceScaleNode );
} );