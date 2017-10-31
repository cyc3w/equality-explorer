// Copyright 2017, University of Colorado Boulder

/**
 * Displays an equation or inequality with at most 1 variable.
 * Origin is at the center of the relational operator.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantItemCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantItemCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Multilink = require( 'AXON/Multilink' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var XItemCreator = require( 'EQUALITY_EXPLORER/common/model/XItemCreator' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function EquationNode( leftItemCreators, rightItemCreators, options ) {

    var self = this;

    options = _.extend( {

      // icons
      iconScale: 0.75,

      // fonts
      relationalOperatorFont: new PhetFont( { size: 40, weight: 'bold' } ), // for relational operator
      plusFont: new PhetFont( 28 ), // for plus operator
      numberFont: new PhetFont( 28 ), // for coefficients and constants
      variableFont: new MathSymbolFont( 28 ), // for variables, like 'x'

      // horizontal spacing
      relationalOperatorSpacing: 20, // space around the relational operator
      plusSpacing: 8, // space around plus operator
      coefficientSpacing: 2 // space between coefficient and icon

    }, options );

    Node.call( this );

    // Correct initial operator will be set in multilink below
    var relationalOperatorNode = new Text( '=', {
      font: options.relationalOperatorFont
    } );

    // {ItemCreator[]} all ItemCreator instances
    var itemCreators = leftItemCreators.concat( rightItemCreators );

    // {Property} dependencies that require the equation to be updated
    var updateDependencies = [];
    itemCreators.forEach( function( itemCreator ) {
      updateDependencies.push( itemCreator.numberOfItemsOnScaleProperty );
      if ( itemCreator instanceof XItemCreator ) {
        updateDependencies.push( itemCreator.weightProperty );
      }
    } );

    // update the equation, dispose of this Multilink in dispose
    var updateMultilink = new Multilink( updateDependencies, function() {

      relationalOperatorNode.text = getRelationalOperator( leftItemCreators, rightItemCreators );

      var leftSideNode = createSideNode( leftItemCreators,
        options.iconScale, options.plusFont, options.numberFont, options.variableFont, options.plusSpacing, options.coefficientSpacing );

      var rightSideNode = createSideNode( rightItemCreators,
        options.iconScale, options.plusFont, options.numberFont, options.variableFont, options.plusSpacing, options.coefficientSpacing );

      self.children = [ leftSideNode, relationalOperatorNode, rightSideNode ];

      // Layout, with origin at center of relational operator
      relationalOperatorNode.centerX = 0;
      relationalOperatorNode.centerY = 0;
      leftSideNode.right = relationalOperatorNode.left - options.relationalOperatorSpacing;
      leftSideNode.centerY = relationalOperatorNode.centerY;
      rightSideNode.left = relationalOperatorNode.right + options.relationalOperatorSpacing;
      rightSideNode.centerY = relationalOperatorNode.centerY;
    } );

    // @private
    this.disposeEquationNode = function() {
      updateMultilink.dispose();
    };

    this.mutate( options );
  }

  equalityExplorer.register( 'EquationNode', EquationNode );

  /**
   * Gets the operator that describes the relationship between the left and right sides.
   * @param {ItemCreator[]} leftItemCreators
   * @param {ItemCreator[]} rightItemCreators
   * @returns {string}
   */
  function getRelationalOperator( leftItemCreators, rightItemCreators ) {

    // evaluate the left side
    var leftWeight = 0;
    for ( var i = 0; i < leftItemCreators.length; i++ ) {
      leftWeight += leftItemCreators[ i ].numberOfItemsOnScaleProperty.value * leftItemCreators[ i ].weight;
    }

    // evaluate the right side
    var rightWeight = 0;
    for ( i = 0; i < rightItemCreators.length; i++ ) {
      rightWeight += rightItemCreators[ i ].numberOfItemsOnScaleProperty.value * rightItemCreators[ i ].weight;
    }

    // determine the operator that describes the relationship between left and right sides
    var relationalSymbol = null;
    if ( leftWeight < rightWeight ) {
      relationalSymbol = '<';
    }
    else if ( leftWeight > rightWeight ) {
      relationalSymbol = '>';
    }
    else {
      relationalSymbol = '=';
    }

    return relationalSymbol;
  }

  /**
   * Creates one side of the equation
   * @param {ItemCreator[]} itemCreators
   * @param {number} iconScale - scale for Item icons
   * @param {Font} plusFont - font for plus operators
   * @param {Font} numberFont - font for coefficients and constants
   * @param {Font} variableFont - font for variables, like 'x'
   * @param {number} plusSpacing - space around plus operators
   * @param {number} coefficientSpacing - space between coefficients and icons
   * @returns {Node}
   */
  function createSideNode( itemCreators, iconScale, plusFont, numberFont, variableFont, plusSpacing, coefficientSpacing ) {

    var constantValue = 0;
    var xCoefficient = 0;

    var children = [];
    for ( var i = 0; i < itemCreators.length; i++ ) {

      var itemCreator = itemCreators[ i ];

      var numberOfItemsOnScale = itemCreator.numberOfItemsOnScaleProperty.value;
      if ( numberOfItemsOnScale > 0 ) {

        if ( itemCreator instanceof XItemCreator ) {

          // these Items contribute to the coefficient for 'x'
          xCoefficient += ( itemCreator.coefficient * numberOfItemsOnScale );
        }
        else if ( itemCreator instanceof ConstantItemCreator ) {

          if ( itemCreator.constantTerm ) {

            // these Items contribute to the constant term
            constantValue += ( numberOfItemsOnScale * itemCreator.weight );
          }
          else {

            // these Items are displayed as coefficient and icon
            if ( children.length > 0 ) {
              children.push( new Text( EqualityExplorerConstants.PLUS, { font: plusFont } ) );
            }
            children.push( createTermNode( numberOfItemsOnScale, itemCreator.icon, iconScale, numberFont, coefficientSpacing, false ) );
          }
        }
        else {
          throw new Error( 'unsupported subtype of ItemCreator' );
        }
      }
    }

    if ( xCoefficient !== 0 ) {
      assert && assert( children.length === 0, 'equation with a variable should have no terms so far' );
      var xIcon = new Text( xString, { font: variableFont } );
      children.push( createTermNode( xCoefficient, xIcon, 1, numberFont, coefficientSpacing, true ) );
    }

    if ( constantValue !== 0 ) {

      // put the constant term last
      if ( children.length > 0 ) {
        var operator = ( constantValue > 0 ) ? EqualityExplorerConstants.PLUS : EqualityExplorerConstants.MINUS;
        children.push( new Text( operator, { font: plusFont } ) );
        children.push( createConstantNode( Math.abs( constantValue ), numberFont ) );
      }
      else {
        children.push( createConstantNode( constantValue, numberFont ) );
      }
    }

    if ( children.length === 0 ) {
      children.push( new Text( '0', { font: numberFont } ) );
    }

    return new HBox( {
      spacing: plusSpacing,
      children: children
    } );
  }

  /**
   * Creates a term.
   * @param {number} coefficient
   * @param {Node} icon
   * @param {number} iconScale - scale for icon
   * @param {Font} font - font for coefficient or constant
   * @param {spacing} coefficientSpacing - horizontal space between coefficient and icon
   * @param {boolean} hideOne - whether to hide 1 and -1
   * @returns {Node}
   */
  function createTermNode( coefficient, icon, iconScale, font, coefficientSpacing, hideOne ) {

    // wrap the icon, since we're using scenery DAG feature
    var wrappedIcon = new Node( {
      children: [ icon ],
      scale: iconScale
    } );

    var termNode = null;

    if ( !hideOne || Math.abs( coefficient ) !== 1 ) {

      // show the coefficient
      var constantNode = createConstantNode( coefficient, font );
      termNode = new HBox( {
        spacing: coefficientSpacing,
        children: [ constantNode, wrappedIcon ]
      } );
    }
    else if ( coefficient === 1 ) {

      // 1x becomes x
      termNode = wrappedIcon;
    }
    else {

      // -1x becomes -x
      var signNode = new Text( '-', { font: font } );
      termNode = new HBox( {
        spacing: 2,
        children: [ signNode, wrappedIcon ]
      } );
    }

    return termNode;
  }

  /**
   * Creates a constant.
   * @param {number} constant
   * @param {Font} font
   * @returns {Node}
   */
  function createConstantNode( constant, font ) {
    return new Text( '' + constant, { font: font } );
  }

  return inherit( Node, EquationNode, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeEquationNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
