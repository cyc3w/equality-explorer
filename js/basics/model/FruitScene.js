// Copyright 2017, University of Colorado Boulder

/**
 * The 'Fruit' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsScene = require( 'EQUALITY_EXPLORER/basics/model/BasicsScene' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var NumberNode = require( 'EQUALITY_EXPLORER/common/view/NumberNode' );

  // images
  var appleImage = require( 'image!EQUALITY_EXPLORER/apple.png' );
  var orangeImage = require( 'image!EQUALITY_EXPLORER/orange.png' );

  /**
   * @constructor
   */
  function FruitScene() {

    // icons for each Item type, identical heights
    var oneNode = new NumberNode( 1, {
      radius: EqualityExplorerConstants.ITEM_HEIGHT,
      fill: 'rgb( 246, 229, 214 )'
    } );
    var appleNode = new Image( appleImage, {
      maxHeight: oneNode.height
    } );
    var orangeNode = new Image( orangeImage, {
      maxHeight: oneNode.height
    } );

    var itemCreatorsIndex = 0;
    var leftItemCreators = [
      new ItemCreator( 'apple', 3, appleNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'orange', 2, orangeNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'one', 1, oneNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ],
        constantTerm: true
      } )
    ];

    //TODO duplicate code
    itemCreatorsIndex = 0;
    var rightItemCreators = [
      new ItemCreator( 'apple', 3, appleNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.rightItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'orange', 2, orangeNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.rightItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'one', 1, oneNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.rightItems[ itemCreatorsIndex++ ],
        constantTerm: true
      } )
    ];

    BasicsScene.call( this, appleNode, leftItemCreators, rightItemCreators );
  }

  equalityExplorer.register( 'FruitScene', FruitScene );

  return inherit( BasicsScene, FruitScene );
} );
