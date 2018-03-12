// Copyright 2017-2018, University of Colorado Boulder

/**
 * Base type for a scene in Equality Explorer sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalanceScale = require( 'EQUALITY_EXPLORER/common/model/BalanceScale' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Snapshot = require( 'EQUALITY_EXPLORER/common/model/Snapshot' );
  var Snapshots = require( 'EQUALITY_EXPLORER/common/model/Snapshots' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var DRAG_BOUNDS_X_MARGIN = 20;
  var DRAG_BOUNDS_Y_MARGIN = 10;
  var DRAG_BOUNDS_MIN_Y = 100;
  var DRAG_BOUNDS_MAX_Y = EqualityExplorerConstants.SCREEN_VIEW_LAYOUT_BOUNDS.maxY - DRAG_BOUNDS_Y_MARGIN;

  /**
   * @param {string} debugName - internal name, not displayed to the user
   * @param {TermCreator[]} leftTermCreators - in the order that they appear in the left toolbox and left side of equations
   * @param {TermCreator[]} rightTermCreators - in the order that they appear in the right toolbox and right side of equations
   * @param {Object} [options]
   * @constructor
   */
  function Scene( debugName, leftTermCreators, rightTermCreators, options ) {

    assert && assert( leftTermCreators.length === rightTermCreators.length,
      'the same number of term creators are required on both sides of the scale' );

    var self = this;

    options = _.extend( {
      lockable: true, // is the lock feature supported for this scene?
      icon: null, // {Node|null} optional icon used to represent the scene in the scene control (radio buttons)
      maxWeight: 30, // maximum weight at which a plate 'bottoms out', and won't move when more weight is added to it,
      gridRows: 6, // {number} rows in the grid on the scale
      gridColumns: 6, // {number} columns in the grid on the scale
      iconSize: null // {Dimension2|null} size of term icons on the scale, computed if null
    }, options );

    phet.log && phet.log( debugName + ': maxWeight=' + options.maxWeight );

    // @public (read-only)
    this.debugName = debugName;

    // @private {Node|null} used to represent the scene. See ES5 getter.
    this._icon = options.icon;

    // @public (read-only) {TermCreator[]} creators for terms on left side of scale
    this.leftTermCreators = leftTermCreators;

    // @public (read-only) {TermCreator[]} creators for terms on right side of scale
    this.rightTermCreators = rightTermCreators;

    // @public (read-only)
    this.scale = new BalanceScale( this.leftTermCreators, this.rightTermCreators, {
      location: new Vector2( 355, 420 ), // determined empirically
      gridRows: options.gridRows,
      gridColumns: options.gridColumns,
      iconSize: options.iconSize,
      maxWeight: options.maxWeight
    } );

    // @public (read-only, for debugging) drag bounds for left plate
    this.leftDragBounds = new Bounds2( DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MIN_Y,
      this.scale.location.x - DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MAX_Y );
    leftTermCreators.forEach( function( termCreator ) {
      termCreator.dragBounds = self.leftDragBounds;
    } );

    // @public (read-only, for debugging) drag bounds for right plate
    this.rightDragBounds = new Bounds2( this.scale.location.x + DRAG_BOUNDS_X_MARGIN, DRAG_BOUNDS_MIN_Y,
      this.scale.location.x + DRAG_BOUNDS_X_MARGIN + this.leftDragBounds.width, DRAG_BOUNDS_MAX_Y );
    rightTermCreators.forEach( function( termCreator ) {
      termCreator.dragBounds = self.rightDragBounds;
    } );

    // @public collection of snapshots, for saving/restoring the state of a Scene
    this.snapshots = new Snapshots();

    // @public {BooleanProperty|null} locks equivalent terms, null if this feature is not supported
    this.lockedProperty = null;

    if ( options.lockable ) {

      this.lockedProperty = new BooleanProperty( false );

      for ( var i = 0; i < leftTermCreators.length; i++ ) {

        // Initialize lockedProperty
        leftTermCreators[ i ].lockedProperty = this.lockedProperty;
        rightTermCreators[ i ].lockedProperty = this.lockedProperty;

        // Associate each term creator with its equivalent term creator on the opposite side of the scale.
        assert && assert( leftTermCreators[ i ].isEquivalentTo( rightTermCreators[ i ] ),
          'equivalent term creators must have the same indices on both sides' );
        leftTermCreators[ i ].equivalentTermCreator = rightTermCreators[ i ];
        rightTermCreators[ i ].equivalentTermCreator = leftTermCreators[ i ];
      }
    }
  }

  equalityExplorer.register( 'Scene', Scene );

  return inherit( Object, Scene, {

    /**
     * Gets the icon used to represent this scene.
     * Since this icon is used in multiple places in the scenery DAG, it must be wrapped.
     * @returns {Node}
     * @public
     */
    get icon() {
      return new Node( { children: [ this._icon ] } );
    },

    // @public
    reset: function() {

      // delete all terms
      this.leftTermCreators.forEach( function( termCreator ) {
        termCreator.disposeAllTerms();
      } );
      this.rightTermCreators.forEach( function( termCreator ) {
        termCreator.disposeAllTerms();
      } );

      // clears all snapshots
      this.snapshots.reset();
    },

    /**
     * Updates time-dependent parts of the scene.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {

      // step all terms
      this.leftTermCreators.forEach( function( termCreator ) {
        termCreator.step( dt );
      } );
      this.rightTermCreators.forEach( function( termCreator ) {
        termCreator.step( dt );
      } );
    },

    /**
     * Creates a snapshot of the scene.
     * @returns {Snapshot}
     * @public
     */
    createSnapshot: function() {
      return new Snapshot( this );
    }
  } );
} );

