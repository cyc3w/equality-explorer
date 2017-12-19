// Copyright 2017, University of Colorado Boulder

/**
 * Displays an equation or inequality.
 * Designed to support multiple variables, but has only been tested extensively with 1 variable.
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
  var VariableItemCreator = require( 'EQUALITY_EXPLORER/common/model/VariableItemCreator' );

  /**
   * @param {AbstractItemCreator[]} leftItemCreators - left side of equation, terms appear in this order
   * @param {AbstractItemCreator[]} rightItemCreators - right side of equation, terms appear in this order
   * @param {Object} [options]
   * @constructor
   */
  function EquationNode( leftItemCreators, rightItemCreators, options ) {

    var self = this;

    options = _.extend( {

      // Update the view when the model changes?
      // Set this to false to create a static equation.
      updateEnabled: true,

      // icons
      iconScale: 0.75,

      // fonts sizes
      fontSize: 14,
      relationalOperatorFontSize: 14,

      // horizontal spacing
      coefficientSpacing: 2, // space between coefficient and icon
      plusSpacing: 8, // space around plus operator
      relationalOperatorSpacing: 20 // space around the relational operator

    }, options );

    // fonts for various parts of the equation
    var variableFont = new MathSymbolFont( options.fontSize );
    var relationalOperatorFont = new PhetFont( { size: options.relationalOperatorFontSize, weight: 'bold' } );
    var font = new PhetFont( options.fontSize ); // font for everything else

    Node.call( this );

    // Correct initial operator will be set in multilink below
    var relationalOperatorNode = new Text( '=', { font: relationalOperatorFont } );

    // updates the equation
    var update = function() {

      relationalOperatorNode.text = getRelationalOperator( leftItemCreators, rightItemCreators );

      var leftSideNode = createSideNode( leftItemCreators, variableFont, font,
        options.iconScale, options.coefficientSpacing, options.plusSpacing );

      var rightSideNode = createSideNode( rightItemCreators, variableFont, font,
        options.iconScale, options.coefficientSpacing, options.plusSpacing );

      self.children = [ leftSideNode, relationalOperatorNode, rightSideNode ];

      // Layout, with origin at center of relational operator
      relationalOperatorNode.centerX = 0;
      relationalOperatorNode.centerY = 0;
      leftSideNode.right = relationalOperatorNode.left - options.relationalOperatorSpacing;
      leftSideNode.centerY = relationalOperatorNode.centerY;
      rightSideNode.left = relationalOperatorNode.right + options.relationalOperatorSpacing;
      rightSideNode.centerY = relationalOperatorNode.centerY;
    };

    if ( options.updateEnabled ) {

      // dynamic equation

      // {AbstractItemCreator[]} all AbstractItemCreator instances
      var itemCreators = leftItemCreators.concat( rightItemCreators );

      // {Property[]} dependencies that require the equation to be updated
      var updateDependencies = [];
      itemCreators.forEach( function( itemCreator ) {
        updateDependencies.push( itemCreator.numberOfItemsOnScaleProperty );
        if ( itemCreator.weightProperty ) {
          updateDependencies.push( itemCreator.weightProperty );
        }
      } );

      // dispose required
      var updateMultilink = new Multilink( updateDependencies, update );
    }
    else {

      // static equation
      update();
    }

    // @private
    this.disposeEquationNode = function() {
      updateMultilink && updateMultilink.dispose();
    };

    this.mutate( options );
  }

  equalityExplorer.register( 'EquationNode', EquationNode );

  /**
   * Gets the operator that describes the relationship between the left and right sides.
   * @param {AbstractItemCreator[]} leftItemCreators
   * @param {AbstractItemCreator[]} rightItemCreators
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
    var relationalOperator = null;
    if ( leftWeight < rightWeight ) {
      relationalOperator = EqualityExplorerConstants.LESS_THAN;
    }
    else if ( leftWeight > rightWeight ) {
      relationalOperator = EqualityExplorerConstants.GREATER_THAN;
    }
    else {
      relationalOperator = EqualityExplorerConstants.EQUALS;
    }

    return relationalOperator;
  }

  /**
   * Creates one side of the equation
   * @param {AbstractItemCreator[]} itemCreators
   * @param {Font} variableFont - font for variables, like 'x'
   * @param {Font} font - font for everything except variables
   * @param {number} iconScale - scale for item icons
   * @param {number} coefficientSpacing - space between coefficients and icons
   * @param {number} plusSpacing - space around plus operators
   * @returns {Node}
   */
  function createSideNode( itemCreators, variableFont, font, iconScale, coefficientSpacing, plusSpacing ) {

    var constantValue = 0;
    var coefficients = {}; // map from variable symbol to coefficient value, e.g. { x: 5 }

    var children = [];
    for ( var i = 0; i < itemCreators.length; i++ ) {

      var itemCreator = itemCreators[ i ];

      var numberOfItemsOnScale = itemCreator.numberOfItemsOnScaleProperty.value;
      if ( numberOfItemsOnScale > 0 ) {

        if ( itemCreator.constructor === VariableItemCreator ) {

          // these items contribute to the coefficient for their associated variable
          if ( !coefficients.hasOwnProperty( itemCreator.symbol ) ) {
            coefficients[ itemCreator.symbol ] = 0;
          }

          coefficients[ itemCreator.symbol ] += ( itemCreator.sign * numberOfItemsOnScale );
        }
        else if ( itemCreator.constructor === ConstantItemCreator ) {

          // these items contribute their weight to the constant term
          constantValue += ( itemCreator.weight * numberOfItemsOnScale );
        }
        else {

          // these items are displayed as a coefficient and icon
          if ( children.length > 0 ) {
            children.push( new Text( EqualityExplorerConstants.PLUS, { font: font } ) );
          }
          children.push( createTermNode( numberOfItemsOnScale, itemCreator.icon, iconScale, font, coefficientSpacing, false ) );
        }
      }
    }

    // Create a term for each variable that has a non-zero coefficient.
    for ( var property in coefficients ) {
      if ( coefficients.hasOwnProperty( property ) && coefficients[ property ] > 0 ) {
        var coefficient = coefficients[ property ];
        assert && assert( coefficient > 0, 'expected coefficient > 0' );
        var variableNode = new Text( property, { font: variableFont } );
        children.push( createTermNode( coefficient, variableNode, 1, font, coefficientSpacing, true ) );
      }
    }

    if ( constantValue !== 0 ) {

      // put the constant term last
      if ( children.length > 0 ) {

        // if there were variable terms, replace the constant's sign with an operator
        var operator = ( constantValue > 0 ) ? EqualityExplorerConstants.PLUS : EqualityExplorerConstants.MINUS;
        children.push( new Text( operator, { font: font } ) );
        children.push( createConstantNode( Math.abs( constantValue ), font ) );
      }
      else {

        // if there were no variable terms, keep the constant's sign
        children.push( createConstantNode( constantValue, font ) );
      }
    }

    // if there were no terms, then this side of the equation evaluated to zero
    if ( children.length === 0 ) {
      children.push( new Text( '0', { font: font } ) );
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
   * @param {number} coefficientSpacing - horizontal space between coefficient and icon
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
