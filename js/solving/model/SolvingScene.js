// Copyright 2017, University of Colorado Boulder

//TODO lots of duplication with VariablesScene
/**
 * The sole scene in the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );
  var Property = require( 'AXON/Property' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @constructor
   */
  function SolvingScene() {

    var self = this;

    Scene.call( this, 'solving', createItemCreators(), createItemCreators() );

    // @public  (read-only) the value of the variable 'x'
    this.xProperty = new Property( EqualityExplorerConstants.X_RANGE.defaultValue );
    this.xProperty.link( function( x ) {

      //TODO this is a temporary hack
      self.leftItemCreators[ 0 ].weightProperty.value = x;
      self.leftItemCreators[ 1 ].weightProperty.value = -x;
      self.rightItemCreators[ 0 ].weightProperty.value = x;
      self.rightItemCreators[ 1 ].weightProperty.value = -x;
    } );

    // @public
    this.operatorProperty = new Property( EqualityExplorerConstants.PLUS );
    this.operandProperty = new Property( 1 );
  }

  equalityExplorer.register( 'SolvingScene', SolvingScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @returns {ItemCreator[]}
   */
  function createItemCreators() {
    return [
      new ItemCreator( 'x', 1, ItemIcons.X_SHADOW_NODE, { variableTerm: true } ),
      new ItemCreator( '-x', -1, ItemIcons.NEGATIVE_X_NODE, ItemIcons.X_SHADOW_NODE, { variableTerm: true } ),
      new ItemCreator( '1', 1, ItemIcons.POSITIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, { constantTerm: true } ),
      new ItemCreator( '-1', -1, ItemIcons.NEGATIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, { constantTerm: true } )
    ];
  }

  return inherit( Scene, SolvingScene, {

    // @public
    reset: function() {
      this.xProperty.reset();
      this.operatorProperty.reset();
      this.operandProperty.reset();
      Scene.prototype.reset.call( this );
    }
  } );
} );
