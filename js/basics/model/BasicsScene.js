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
  var Property = require( 'AXON/Property' );

  /**
   * @param {Node} icon
   * @param {ItemCreator[]} itemCreators
   * @constructor
   */
  function BasicsScene( icon, itemCreators ) {

    // @public (read-only) Node used to represent the scene
    this.icon = new Node( { children: [ icon ] } );

    // @public (read-only)
    this.itemCreators = itemCreators;

    // @public (read-only)
    this.scaleAngleProperty = new Property( 0 );

    // @private
    this.rotationMultiplier = 1;

    // @public
    this.equationAccordionBoxExpandedProperty = new Property( true ); //TODO move to view
    this.snapshotsAccordionBoxExpandedProperty = new Property( true ); //TODO move to view

    // @public whether the couplers that connects the 2 sides of the scale are coupled
    this.coupledProperty = new Property( false );
  }

  equalityExplorer.register( 'BasicsScene', BasicsScene );

  return inherit( Object, BasicsScene, {

    // @public
    reset: function() {
      this.scaleAngleProperty.reset();
      this.equationAccordionBoxExpandedProperty.reset();
      this.snapshotsAccordionBoxExpandedProperty.reset();
      this.coupledProperty.reset();
    },

    // @public
    step: function( dt ) {
      this.rotateScale();
    },

    // @private for demo purposes only
    rotateScale: function() {

      var maxAngle = Math.PI / 15; // maximum rotation
      var deltaAngle = maxAngle / 80; // rotation per step

      var newAngle = this.scaleAngleProperty.value + ( this.rotationMultiplier * deltaAngle );

      if ( newAngle >= maxAngle ) {
        newAngle = maxAngle;
        this.rotationMultiplier = -1;
      }
      else if ( newAngle <= -maxAngle ) {
        newAngle = -maxAngle;
        this.rotationMultiplier = 1;
      }

      assert && assert( Math.abs( newAngle ) <= maxAngle );
      this.scaleAngleProperty.value = newAngle;
    }
  } );
} );

