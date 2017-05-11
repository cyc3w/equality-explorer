// Copyright 2017, University of Colorado Boulder

//TODO SnapshotsAccordionBox needs to be wide enough to support 3 terms on each side of the equation
/***
 * Accordion box that allows the student to save and restore snapshots, specific configurations of a scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var mySnapshotsString = require( 'string!EQUALITY_EXPLORER/mySnapshots' );

  // constants
  var NUMBER_FONT = new PhetFont( 16 );
  var BUTTON_X_MARGIN = 8;
  var BUTTON_Y_MARGIN = 5;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function SnapshotsAccordionBox( options ) {

    options = _.extend( {
      numberOfSnapshots: 5,
      fill: 'white',
      titleNode: new Text( mySnapshotsString, {
        font: new PhetFont( 18 )
        //TODO maxWidth
      } ),
      titleAlignX: 'left',
      titleXSpacing: 8,
      buttonLength: 20,
      buttonXMargin: 10,
      buttonYMargin: 8,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,
      contentXMargin: 10,
      contentYMargin: 10
    }, options );

    var vBoxChildren = [];

    var snapshotIcon = new FontAwesomeNode( 'camera', { scale: 0.3 } );
    var trashIcon = new FontAwesomeNode( 'trash', { scale: 0.3 } );
    var maxIconWidth = Math.max( snapshotIcon.width, trashIcon.width );
    var maxIconHeight = Math.max( snapshotIcon.height, trashIcon.height );

    // Create a row for each snapshot
    for ( var i = 0; i < options.numberOfSnapshots; i++ ) {

      var numberLabel = new Text( i + 1, {
        font: NUMBER_FONT
      } );

      var numberButton = new RectangularPushButton( {
        content: new Text( i + 1, {
          font: NUMBER_FONT,
          xMargin: 5,
          yMargin: 2
        } ),
        baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
        touchAreaXDilation: 5,
        touchAreaYDilation: 5,
        center: numberLabel.center,
        visible: false
      } );

      var numbersParent = new Node( {
        children: [ numberLabel, numberButton ]
      } );

      var equationNode = new Rectangle( 0, 0, 160, 50 ); //TODO use EquationNode

      var snapshotButton = new RectangularPushButton( {
        content: snapshotIcon,
        baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
        xMargin: BUTTON_X_MARGIN + ( maxIconWidth - snapshotIcon.width ),
        yMargin: BUTTON_Y_MARGIN + ( maxIconHeight - snapshotIcon.height ),
        touchAreaXDilation: 5,
        touchAreaYDilation: 5
      } );

      var trashButton = new RectangularPushButton( {
        content: trashIcon,
        center: snapshotButton.center,
        baseColor: 'white',
        xMargin: BUTTON_X_MARGIN + ( maxIconWidth - trashIcon.width ),
        yMargin: BUTTON_Y_MARGIN + ( maxIconHeight - trashIcon.height ),
        touchAreaXDilation: 5,
        touchAreaYDilation: 5,
        visible: false
      } );

      var buttonsParent = new Node( {
        children: [ trashButton, snapshotButton ]
      } );

      //TODO placeholder that shows worst case snapshot, 3 terms on each side
      if ( i === 0 ) {
        numberButton.visible = true;
        snapshotButton.visible = false;
        trashButton.visible = true;
        var equationText = new Text( '-40x + 40 = -40x + 40', {
          font: new PhetFont( 30 ),
          center: equationNode.center,
          maxWidth: equationNode.width
        } );
        equationNode.addChild( equationText );
      }

      var hBox = new HBox( {
        spacing: 10,
        children: [ numbersParent, equationNode, buttonsParent ]
      } );

      vBoxChildren.push( hBox );
    }

    var contentNode = new VBox( {
      children: vBoxChildren
    } );

    AccordionBox.call( this, contentNode, options );
  }

  equalityExplorer.register( 'SnapshotsAccordionBox', SnapshotsAccordionBox );

  return inherit( AccordionBox, SnapshotsAccordionBox );
} );
