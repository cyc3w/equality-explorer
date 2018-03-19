// Copyright 2017-2018, University of Colorado Boulder

/**
 * The sole scene in the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @constructor
   */
  function NumbersScene() {
    Scene.call( this, 'numbers',
      createTermCreators( EqualityExplorerQueryParameters.leftNumbers ),
      createTermCreators( EqualityExplorerQueryParameters.rightNumbers )
    );
  }

  equalityExplorer.register( 'NumbersScene', NumbersScene );

  /**
   * Creates the term creators for this scene.
   * @param {number} initialNumberOfTermsOnPlate
   * @returns {TermCreator[]}
   */
  function createTermCreators( initialNumberOfTermsOnPlate ) {

    assert && assert( initialNumberOfTermsOnPlate.length === 2,
      'incorrect number of elements in initialNumberOfTermsOnPlate: ' + initialNumberOfTermsOnPlate.length );
    var index = 0;

    return [

      // 1
      new ConstantTermCreator( {
        defaultConstantValue: Fraction.withInteger( 1 ),
        initialNumberOfTermsOnPlate: initialNumberOfTermsOnPlate[ index++ ]
      } ),

      // -1
      new ConstantTermCreator( {
        defaultConstantValue: Fraction.withInteger( -1 ),
        initialNumberOfTermsOnPlate: initialNumberOfTermsOnPlate[ index++ ]
      } )
    ];
  }

  return inherit( Scene, NumbersScene );
} );
