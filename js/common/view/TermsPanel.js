// Copyright 2017, University of Colorado Boulder

/**
 * Panel that contains the terms that can be dragged out onto the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var TermCreatorNode = require( 'EQUALITY_EXPLORER/common/view/TermCreatorNode' );

  // constants
  var CONTENT_SIZE = new Dimension2( 250, 50 );

  /**
   * @param {AbstractTermCreator[]} termCreators - creators for terms, appear in this order left-to-right
   * @param {Plate} plate - associated plate on the scale
   * @param {Node} termsLayer - parent for TermNodes that will be created
   * @param {Object} [options]
   * @constructor
   */
  function TermsPanel( termCreators, plate, termsLayer, options ) {

    options = _.extend( {
      
      spacing: 45, // horizontal space between TermCreatorNodes

      // supertype options
      lineWidth: 1,
      cornerRadius: 6
    }, options );

    var backgroundNode = new Rectangle( 0, 0, CONTENT_SIZE.width, CONTENT_SIZE.height );

    var termCreatorNodes = [];
    for ( var i = 0; i < termCreators.length; i++ ) {
      termCreatorNodes.push( new TermCreatorNode( termCreators[ i ], plate, termsLayer ) );
    }

    var hBox = new HBox( {
      spacing: options.spacing,
      align: 'center',
      children: termCreatorNodes,
      center: backgroundNode.center,
      maxWidth: CONTENT_SIZE.width,
      maxHeight: CONTENT_SIZE.height
    } );

    var content = new Node( {
      children: [ backgroundNode, hBox ]
    } );

    Panel.call( this, content, options );
  }

  equalityExplorer.register( 'TermsPanel', TermsPanel );

  return inherit( Panel, TermsPanel );
} );
