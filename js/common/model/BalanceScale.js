// Copyright 2017, University of Colorado Boulder

/**
 * Model of a balance scale.
 * Consists of 2 plates that sit on either ends of a beam.
 * The center of the beam is balanced on a fulcrum.
 * Origin is at the point where the beam is balanced on the fulcrum.
 * Items are arranged in a 2D (xy) grid on each plate.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Plate = require( 'EQUALITY_EXPLORER/common/model/Plate' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {AbstractItemCreator[]} leftItemCreators
   * @param {AbstractItemCreator[]} rightItemCreators
   * @param {Object} [options]
   * @constructor
   */
  function BalanceScale( leftItemCreators, rightItemCreators, options ) {

    var self = this;

    options = _.extend( {
      location: new Vector2( 0, 0 ), // location of the point where the beam balances on the fulcrum
      beamWidth: 450, // width of the balance beam
      maxAngle: 22 * ( Math.PI / 180 ), // degrees to radians
      maxWeight: 30, // weight at which a plate 'bottoms out'

      // height of vertical support that connects plate to beam
      plateSupportHeight: 70,
      plateDiameter: 300, // diameter of the plates
      plateXInset: 45, // inset of the plates from the ends of the beam

      // options related to the plate's 2D grid
      gridRows: 6, // {number} rows in the grid
      gridColumns: 6, // {number} columns in grid
      gridXMargin: 2, // horizontal space between stacks of items
      gridYMargin: 0  // vertical space between items in each stack

    }, options );

    assert && assert( options.beamWidth - ( 2 * options.plateXInset ) > options.plateDiameter, 'plates will overlap' );

    // @public (read-only)
    this.location = options.location;

    // @public (read-only)
    this.beamWidth = options.beamWidth;
    this.maxAngle = options.maxAngle;

    // @private
    this.leftItemCreators = leftItemCreators;
    this.rightItemCreators = rightItemCreators;

    // {AbstractItemCreator[]} all AbstractItemCreator instances
    var itemCreators = leftItemCreators.concat( rightItemCreators );

    // Find the maximum width and height of all item icons
    var maxIconWidth = 0;
    var maxIconHeight = 0;
    itemCreators.forEach( function( itemCreator ) {
      maxIconWidth = Math.max( maxIconWidth, itemCreator.icon.width );
      maxIconHeight = Math.max( maxIconHeight, itemCreator.icon.height );
    } );

    // size of each cell in the grid
    var cellSize = new Dimension2(
      maxIconWidth + ( 2 * options.gridXMargin ),
      maxIconHeight + ( 2 * options.gridYMargin ) );
    assert && assert( options.gridColumns * cellSize.width <= options.plateDiameter, 'grid is wider than plate' );

    // options that apply to both plates
    var plateOptions = {
      supportHeight: options.plateSupportHeight,
      diameter: options.plateDiameter,
      gridRows: options.gridRows,
      gridColumns: options.gridColumns,
      cellSize: cellSize
    };

    // @public (read-only)
    this.leftPlate = new Plate( leftItemCreators, plateOptions );
    this.rightPlate = new Plate( rightItemCreators, plateOptions );

    // @public {DerivedProperty.<number>} angle of the scale in radians, zero is balanced
    this.angleProperty = new DerivedProperty( [ this.leftPlate.weightProperty, this.rightPlate.weightProperty ],
      function( leftWeight, rightWeight ) {

        // compute the weight difference between the 2 plates
        var weightDelta = ( rightWeight - leftWeight );

        // constrain to maxWeight so the scale bottoms out
        if ( weightDelta > options.maxWeight ) {
          weightDelta = options.maxWeight;
        }
        else if ( weightDelta < -options.maxWeight ) {
          weightDelta = -options.maxWeight;
        }

        var angle = ( weightDelta / options.maxWeight ) * options.maxAngle;
        assert && assert( Math.abs( angle ) <= options.maxAngle, 'angle out of range: ' + angle );
        return angle;
      } );

    // Move the plates when the angle changes. unlink unnecessary
    this.angleProperty.link( function( angle ) {

      // hoist reusable vars
      var dx = 0;
      var dy = 0;

      // move the right plate
      var rightLocation = null;
      var absXInset = Math.abs( options.plateXInset );
      if ( angle === 0 ) {
        rightLocation = new Vector2( self.location.x + ( self.beamWidth / 2 ) - absXInset,
          self.location.y - options.plateSupportHeight );
      }
      else {
        var hypotenuse = ( self.beamWidth / 2 ) - absXInset;
        dx = Math.cos( angle ) * hypotenuse;
        dy = Math.sin( angle ) * hypotenuse;
        rightLocation = new Vector2( self.location.x + dx, self.location.y + dy - options.plateSupportHeight );
      }
      self.rightPlate.locationProperty.value = rightLocation;

      // move the left plate, relative to the right plate
      dx = rightLocation.x - self.location.x;
      dy = ( rightLocation.y + options.plateSupportHeight ) - self.location.y;
      self.leftPlate.locationProperty.value =
        new Vector2( self.location.x - dx, self.location.y - dy - options.plateSupportHeight );
    } );

    // dependencies for numberOfItemsProperty
    var numberOfItemsDependencies = [];
    leftItemCreators.forEach( function( leftItemCreator ) {
      numberOfItemsDependencies.push( leftItemCreator.numberOfItemsOnScaleProperty );
    } );
    rightItemCreators.forEach( function( leftItemCreator ) {
      numberOfItemsDependencies.push( leftItemCreator.numberOfItemsOnScaleProperty );
    } );

    // @public {DerivedProperty.<number>} total number of items on the scale (both plates)
    this.numberOfItemsProperty = new DerivedProperty( numberOfItemsDependencies,
      function() {
        var sum = 0;
        for ( var i = 0; i < numberOfItemsDependencies.length; i++ ) {
          sum += numberOfItemsDependencies[ i ].value;
        }
        return sum;
      } );
  }

  equalityExplorer.register( 'BalanceScale', BalanceScale );

  return inherit( Object, BalanceScale, {

    /**
     * Organizes items on the scale, grouping like items together.
     * @public
     */
    organize: function() {
      this.leftPlate.organize();
      this.rightPlate.organize();
    },

    /**
     * Disposes of all items that are on the scale.
     * @public
     */
    disposeAllItems: function() {
      this.leftItemCreators.forEach( function( itemCreator ) {
        itemCreator.disposeItemsOnScale();
      } );
      this.rightItemCreators.forEach( function( itemCreator ) {
        itemCreator.disposeItemsOnScale();
      } );
    }
  } );
} );
