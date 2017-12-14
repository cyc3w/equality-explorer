// Copyright 2017, University of Colorado Boulder

/**
 * The 'Animals' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsScene = require( 'EQUALITY_EXPLORER/basics/model/BasicsScene' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );
  var MysteryItemCreator = require( 'EQUALITY_EXPLORER/common/model/MysteryItemCreator' );

  /**
   * @constructor
   */
  function AnimalsScene() {
    BasicsScene.call( this, 'animals', ItemIcons.TURTLE_NODE,
      createItemCreators( EqualityExplorerQueryParameters.leftBasics ),
      createItemCreators( EqualityExplorerQueryParameters.rightBasics ), {
        maxWeight: 50
      } );
  }

  equalityExplorer.register( 'AnimalsScene', AnimalsScene );

  /**
   * Creates the item creators for this scene.
   * @param {number[]} initialNumberOfItemsOnScale
   * @returns {AbstractItemCreator[]}
   */
  function createItemCreators( initialNumberOfItemsOnScale ) {
    assert && assert( initialNumberOfItemsOnScale.length === 3 );
    var index = 0;
    return [
      new MysteryItemCreator( 11, ItemIcons.DOG_NODE, ItemIcons.DOG_SHADOW_NODE, {
        initialNumberOfItemsOnScale: initialNumberOfItemsOnScale[ index++ ]
      } ),
      new MysteryItemCreator( 4, ItemIcons.TURTLE_NODE, ItemIcons.TURTLE_SHADOW_NODE, {
        initialNumberOfItemsOnScale: initialNumberOfItemsOnScale[ index++ ]
      } ),
      new MysteryItemCreator( 6, ItemIcons.CAT_NODE, ItemIcons.CAT_SHADOW_NODE, {
        initialNumberOfItemsOnScale: initialNumberOfItemsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( BasicsScene, AnimalsScene );
} );
