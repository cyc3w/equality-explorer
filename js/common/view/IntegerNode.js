// Copyright 2017, University of Colorado Boulder

/**
 * Displays an integer in a circle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {number} value
   * @param {Object} {options}
   * @constructor
   */
  function IntegerNode( value, options ) {

    assert && assert( Util.isInteger( value ), 'value must be an integer: ' + value );

    options = _.extend( {
      radius: 20,
      margin: 3,
      fill: 'white',
      stroke: 'black',
      lineDash: [],
      textFill: 'black',
      font: new PhetFont( 20 )
    }, options );

    var circleNode = new Circle( options.radius, {
      fill: options.fill,
      stroke: options.stroke,
      lineDash: options.lineDash
    } );

    var textNode = new Text( value, {
      font: options.font,
      fill: options.textFill,
      maxWidth: circleNode.width - ( 2 * options.margin ),
      maxHeight: circleNode.height - ( 2 * options.margin ),
      center: circleNode.center
    } );

    assert && assert( !options.children, 'this subtype defines its children' );
    options.children = [ circleNode, textNode ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'IntegerNode', IntegerNode );

  return inherit( Node, IntegerNode );
} );