// Copyright 2017, University of Colorado Boulder

/**
 * Panel that contains the items that can be dragged out onto the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreatorNode = require( 'EQUALITY_EXPLORER/common/view/ItemCreatorNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {ItemCreator[]} itemCreators
   * @param {WeighingPlatform} weighingPlatform
   * @param {Node} itemsLayer
   * @param {number[]} numberOfItemsOnScale
   * @param {Object} [options]
   * @constructor
   */
  function ItemsPanel( itemCreators, weighingPlatform, itemsLayer, numberOfItemsOnScale, options ) {

    options = _.extend( {

      // supertype options
      lineWidth: 2,
      cornerRadius: 6
    }, options );

    var backgroundNode = new Rectangle( 0, 0, 275, 50 );

    var itemCreatorNodes = [];
    for ( var i = 0; i < itemCreators.length; i++ ) {
      itemCreatorNodes.push( new ItemCreatorNode( itemCreators[ i ], weighingPlatform, itemsLayer ) );
    }

    var hBox = new HBox( {
      spacing: 50,
      align: 'center',
      children: itemCreatorNodes,
      center: backgroundNode.center
    } );

    var content = new Node( {
      children: [ backgroundNode, hBox ]
    } );

    Panel.call( this, content, options );

    // Populate the scale after the sim is loaded, so that ItemCreatorNodes have valid locations.
    // This feature is for debugging and testing, not intended for production.
    // See the leftItem and rightItem query parameters.
    var populateScale = function() {
      for ( var i = 0; i < itemCreatorNodes.length; i++ ) {
        itemCreatorNodes[i].populateScale( numberOfItemsOnScale[ i ] );
      }
      phet.joist.sim.frameStartedEmitter.removeListener( populateScale );
    };
    phet.joist.sim.frameStartedEmitter.addListener( populateScale );
  }

  equalityExplorer.register( 'ItemsPanel', ItemsPanel );

  return inherit( Panel, ItemsPanel );
} );
