// Copyright 2017, University of Colorado Boulder

/**
 * The sole scene in the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantItemCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantItemCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );
  var SnapshotWithVariable = require( 'EQUALITY_EXPLORER/common/model/SnapshotWithVariable' );
  var XItemCreator = require( 'EQUALITY_EXPLORER/common/model/XItemCreator' );

  /**
   * @constructor
   */
  function VariablesScene() {

    var self = this;

    // @public (read-only) range of variable 'x'
    this.xRange = EqualityExplorerConstants.X_RANGE;

    // @public (read-only) the value of the variable 'x'
    this.xProperty = new NumberProperty( this.xRange.defaultValue );

    // validate xProperty, unlink unnecessary
    this.xProperty.link( function( x ) {
      assert && assert( self.xRange.contains( x ), 'x out of range: ' + x );
    } );

    Scene.call( this, 'variables',
      createItemCreators( this.xProperty, EqualityExplorerQueryParameters.leftVariables ),
      createItemCreators( this.xProperty, EqualityExplorerQueryParameters.rightVariables )
    );
  }

  equalityExplorer.register( 'VariablesScene', VariablesScene );

  /**
   * Creates the item creators for this scene.
   * @param {Property.<number>} xProperty
   * @param {number} numberOfItemsOnScale
   * @returns {AbstractItemCreator[]}
   */
  function createItemCreators( xProperty, numberOfItemsOnScale ) {
    assert && assert( numberOfItemsOnScale.length === 4 );
    var index = 0;

    var positiveXCreator = new XItemCreator( xProperty.value, 1, ItemIcons.POSITIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      numberOfItemsOnScale: numberOfItemsOnScale[ index++ ]
    } );

    var negativeXCreator = new XItemCreator( -xProperty.value, -1, ItemIcons.NEGATIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      numberOfItemsOnScale: numberOfItemsOnScale[ index++ ]
    } );

    // unlink unnecessary
    xProperty.lazyLink( function( x ) {
      positiveXCreator.weightProperty.value = x;
      negativeXCreator.weightProperty.value = -x;
    } );

    return [
      positiveXCreator,
      negativeXCreator,
      new ConstantItemCreator( 1, ItemIcons.POSITIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ index++ ]
      } ),
      new ConstantItemCreator( -1, ItemIcons.NEGATIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( Scene, VariablesScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.xProperty.reset();
      Scene.prototype.reset.call( this );
    },

    /**
     * Saves a snapshot of the scene.
     * @returns {SnapshotWithVariable}
     * @public
     * @override
     */
    save: function() {
      return new SnapshotWithVariable( this );
    },

    /**
     * Restores a snapshot of the scene.
     * @param {SnapshotWithVariable} snapshot
     * @public
     * @override
     */
    restore: function( snapshot ) {
      assert && assert( snapshot instanceof SnapshotWithVariable, 'oops, not a SnapshotWithVariable' );
      Scene.prototype.restore.call( this, snapshot );
      this.xProperty.value = snapshot.x;
    }
  } );
} );
