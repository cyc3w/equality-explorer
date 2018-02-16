// Copyright 2018, University of Colorado Boulder

//TODO merge into ConstantTermNode
/**
 * Displays a constant term, with fraction or integer value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ConstantTerm2 = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var TermNode2 = require( 'EQUALITY_EXPLORER/common/view/TermNode2' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var FRACTION_FONT = new PhetFont( 28 );
  var INTEGER_FONT = new PhetFont( 40 );

  /**
   * @param {ConstantTerm} term
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTermNode2( term, options ) {

    assert && assert( term instanceof ConstantTerm2, 'term has wrong type' );

    var self = this;

    options = _.extend( {
      diameter: EqualityExplorerConstants.TERM_DIAMETER,
      margin: 18,
      fractionFontSize: 12,
      integerFontSize: 22
    }, options );

    var circleNode = new Circle( options.diameter / 2, {
      stroke: 'black'
    } );

    // for fractional value
    var fractionNode = new ReducedFractionNode( term.valueProperty.value, {
      font: FRACTION_FONT
    } );

    // for integer value
    var integerNode = new Text( 0, {
      font: INTEGER_FONT,
      center: fractionNode.center
    } );

    var contentNode = new Node( {
      children: [ fractionNode, integerNode ],
      maxWidth: circleNode.width - ( 2 * options.margin ),
      maxHeight: circleNode.height - ( 2 * options.margin ),
      center: circleNode.center
    } );

    assert && assert( !options.children, 'subtype defines its own children' );
    options.children = [ circleNode, contentNode ];

    TermNode2.call( this, term, options );

    // synchronize with the model value
    term.valueProperty.link( function( newValue, oldValue ) {
      assert && assert( newValue instanceof ReducedFraction );

      // update the value displayed
      if ( newValue.isInteger() ) {

        // hide the fraction
        if ( contentNode.hasChild( fractionNode ) ) {
          contentNode.removeChild( fractionNode );
        }

        // update the integer
        assert && assert( Math.abs( newValue.denominator ) === 1, 'expected newValue to be reduced' );
        integerNode.text = newValue.numerator;
        if ( !contentNode.hasChild( integerNode ) ) {
          contentNode.addChild( integerNode );
        }
      }
      else {

        // hide the integer
        if ( contentNode.hasChild( integerNode ) ) {
          contentNode.removeChild( integerNode );
        }

        // update the fraction
        fractionNode.setFraction( newValue );
        if ( !contentNode.hasChild( fractionNode ) ) {
          contentNode.addChild( fractionNode );
        }
      }

      // update properties based on sign
      if ( newValue.getValue() >= 0 ) {
        circleNode.fill = EqualityExplorerConstants.POSITIVE_CONSTANT_FILL;
        circleNode.lineDash = EqualityExplorerConstants.POSITIVE_CONSTANT_LINE_DASH;
      }
      else {
        circleNode.fill = EqualityExplorerConstants.NEGATIVE_CONSTANT_FILL;
        circleNode.lineDash = EqualityExplorerConstants.NEGATIVE_CONSTANT_LINE_DASH;
      }

      // center in the circle
      contentNode.center = circleNode.center;

      // hide this node when value is zero
      self.visible = ( newValue.getValue() !== 0 );

      // sum-to-zero animation when the value transitions to zero
      if ( oldValue && oldValue.getValue() !== 0 && newValue.getValue() === 0 ) {
        var sumToZeroNode = new SumToZeroNode( {
          haloBaseColor: 'transparent', // no halo
          fontSize: INTEGER_FONT.size,
          center: self.center
        } );
        self.parent.addChild( sumToZeroNode );
        sumToZeroNode.startAnimation();
      }
    } );
  }

  equalityExplorer.register( 'ConstantTermNode2', ConstantTermNode2 );

  return inherit( TermNode2, ConstantTermNode2 );
} );