// Copyright 2017, University of Colorado Boulder

/**
 * Base type for a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @param {string} debugName - internal name, not displayed to the user, no i18n required
   * @param {Node} icon - icon used to represent the scene
   * @param {AbstractItemCreator[]} leftItemCreators
   * @param {AbstractItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function BasicsScene( debugName, icon, leftItemCreators, rightItemCreators, options ) {

    options = options || {};

    assert && assert( !options.icon, 'this type defines its icon' );
    options.icon = new Node( { children: [ icon ] } ); // wrap the icon, since we're using scenery's DAG feature

    Scene.call( this, debugName, leftItemCreators, rightItemCreators, options );
  }

  equalityExplorer.register( 'BasicsScene', BasicsScene );

  return inherit( Scene, BasicsScene );
} );

