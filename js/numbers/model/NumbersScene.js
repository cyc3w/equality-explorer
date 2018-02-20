// Copyright 2017, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var LockableScene = require( 'EQUALITY_EXPLORER/common/model/LockableScene' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );

  /**
   * @constructor
   */
  function NumbersScene() {
    LockableScene.call( this, 'numbers',
      createTermCreators( EqualityExplorerQueryParameters.leftNumbers ),
      createTermCreators( EqualityExplorerQueryParameters.rightNumbers )
    );
  }

  equalityExplorer.register( 'NumbersScene', NumbersScene );

  /**
   * Creates the term creators for this scene.
   * @param {number} initialNumberOfTermsOnScale
   * @returns {TermCreator[]}
   */
  function createTermCreators( initialNumberOfTermsOnScale ) {

    assert && assert( initialNumberOfTermsOnScale.length === 2 );
    var index = 0;

    return [

      // 1
      new ConstantTermCreator( {
        defaultValue: ReducedFraction.withInteger( 1 ),
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),

      // -1
      new ConstantTermCreator( {
        defaultValue: ReducedFraction.withInteger( -1 ),
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( LockableScene, NumbersScene );
} );
