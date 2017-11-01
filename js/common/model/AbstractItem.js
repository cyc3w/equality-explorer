// Copyright 2017, University of Colorado Boulder

/**
 * Abstract base type for items that can be placed on the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerMovable = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerMovable' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function AbstractItem( icon, iconShadow, options ) {

    // @public (read-only)
    this.icon = icon;
    this.iconShadow = iconShadow;
    this.disposedEmitter = new Emitter(); // emit1 when dispose has completed

    EqualityExplorerMovable.call( this, options );
  }

  equalityExplorer.register( 'AbstractItem', AbstractItem );

  return inherit( EqualityExplorerMovable, AbstractItem, {

    /**
     * Gets the item's weight
     * @returns {number}
     * @public
     * @abstract
     */
    get weight() {
      throw new Error( 'weight getter must be implemented by subtype' );
    },

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposedEmitter.emit1( this );
      this.disposedEmitter.removeAllListeners();
      EqualityExplorerMovable.prototype.dispose.call( this );
    }
  } );
} );
