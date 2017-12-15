// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScreenView = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SceneControl = require( 'EQUALITY_EXPLORER/common/view/SceneControl' );
  var SceneNode = require( 'EQUALITY_EXPLORER/common/view/SceneNode' );

  /**
   * @param {BasicsModel} model
   * @constructor
   */
  function BasicsScreenView( model ) {

    var self = this;

    EqualityExplorerScreenView.call( this, model );

    // @private create the view for each scene
    this.sceneNodes = [];
    model.scenes.forEach( function( scene ) {
      var sceneNode = new SceneNode( scene, self.layoutBounds, {
        sceneProperty: model.sceneProperty,
        lockVisible: false
      } );
      self.sceneNodes.push( sceneNode );
      self.addChild( sceneNode );
    } );

    // Get the bounds of the Snapshot accordion box, relative to this ScreenView
    var sceneNode = this.sceneNodes[ 0 ];
    var globalBounds = sceneNode.snapshotsAccordionBox.parentToGlobalBounds( sceneNode.snapshotsAccordionBox.bounds );
    var localBounds = this.globalToLocalBounds( globalBounds );

    // Center the scene control in the space below the Snapshots accordion box  
    var sceneControl = new SceneControl( model.scenes, model.sceneProperty, {
      centerX: localBounds.centerX,
      centerY: localBounds.bottom + ( this.resetAllButton.top - localBounds.bottom ) / 2
    } );
    this.addChild( sceneControl );
  }

  equalityExplorer.register( 'BasicsScreenView', BasicsScreenView );

  return inherit( EqualityExplorerScreenView, BasicsScreenView, {

    /**
     * Resets things that are specific to the view.
     * @public
     */
    reset: function() {
      this.sceneNodes.forEach( function( sceneNode ) {
        sceneNode.reset();
      } );
    }
  } );
} );