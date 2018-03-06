// Copyright 2017-2018, University of Colorado Boulder

//TODO some duplication with VariablesScene. Should this be a subtype of VariablesScene?
/**
 * The sole scene in the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LockableScene = require( 'EQUALITY_EXPLORER/common/model/LockableScene' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var SnapshotWithVariable = require( 'EQUALITY_EXPLORER/common/model/SnapshotWithVariable' );
  var StringProperty = require( 'AXON/StringProperty' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );

  // string
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  // constants
  var COMBINE_LIKE_TERMS = true; // combine like terms when they are placed on the scale

  /**
   * @constructor
   */
  function SolvingScene() {

    // @public (read-only) range of variable 'x'
    this.xRange = EqualityExplorerConstants.VARIABLE_RANGE;

    // @public (read-only) the value of the variable 'x'
    this.xProperty = new NumberProperty( this.xRange.defaultValue, {
      numberType: 'Integer',
      range: this.xRange
    } );

    // @public (read-only) set of operators for universal operation
    this.operators = [
      MathSymbols.PLUS,
      MathSymbols.MINUS,
      MathSymbols.TIMES,
      MathSymbols.DIVIDE
    ];

    // @public (read-only) operator for 'universal operation'
    this.operatorProperty = new StringProperty( MathSymbols.PLUS, {
      validValues: this.operators
    } );

    // @public (read-only) range for universal operand
    this.operandRange = new RangeWithValue( -10, 10, 1 );

    // @public (read-only) universal operand
    this.operandProperty = new NumberProperty( this.operandRange.defaultValue, {
      numberType: 'Integer',
      range: this.operandRange
    } );

    LockableScene.call( this, 'solving',
      createTermCreators( this.xProperty ),
      createTermCreators( this.xProperty ), {
        gridRows: 1,
        gridColumns: 2,
        iconSize: new Dimension2( EqualityExplorerConstants.BIG_TERM_DIAMETER + 10, EqualityExplorerConstants.BIG_TERM_DIAMETER )
      } );
  }

  equalityExplorer.register( 'SolvingScene', SolvingScene );

  /**
   * Creates the term creators for this scene.
   * @param {NumberProperty} xProperty
   * @returns {TermCreator[]}
   */
  function createTermCreators( xProperty ) {

    return [

      // x
      new VariableTermCreator( xString, xProperty, {
        defaultCoefficient: ReducedFraction.withInteger( 1 ),
        combineLikeTerms: COMBINE_LIKE_TERMS
      } ),

      // -x
      new VariableTermCreator( xString, xProperty, {
        defaultCoefficient: ReducedFraction.withInteger( -1 ),
        combineLikeTerms: COMBINE_LIKE_TERMS
      } ),

      // 1
      new ConstantTermCreator( {
        defaultConstantValue: ReducedFraction.withInteger( 1 ),
        combineLikeTerms: COMBINE_LIKE_TERMS
      } ),

      // -1
      new ConstantTermCreator( {
        defaultConstantValue: ReducedFraction.withInteger( -1 ),
        combineLikeTerms: COMBINE_LIKE_TERMS
      } )
    ];
  }

  return inherit( LockableScene, SolvingScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.xProperty.reset();
      this.operatorProperty.reset();
      this.operandProperty.reset();
      LockableScene.prototype.reset.call( this );
    },

    /**
     * Saves a snapshot of the scene. Restore is handled by the snapshot.
     * @returns {SnapshotWithVariable}
     * @public
     * @override
     */
    save: function() {
      return new SnapshotWithVariable( this );
    }
  } );
} );
