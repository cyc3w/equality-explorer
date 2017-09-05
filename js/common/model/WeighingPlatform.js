// Copyright 2017, University of Colorado Boulder

/**
 * Platform where Items are placed to be weighed on a balance scale.
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
  var Item = require( 'EQUALITY_EXPLORER/common/model/Item' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {DerivedProperty.<Vector2>} locationProperty
   * @param {ItemCreator[]} itemCreators
   * @param {Object} [options]
   * @constructor
   */
  function WeighingPlatform( locationProperty, itemCreators, options ) {

    var self = this;

    options = _.extend( {
      supportHeight: 10,
      diameter: 20,
      gridSize: new Dimension2( 1, 1 ),
      cellSize: new Dimension2( 5, 5 )
    }, options );

    // @public (read-only)
    this.locationProperty = locationProperty;
    this.supportHeight = options.supportHeight;
    this.diameter = options.diameter;
    this.gridSize = options.gridSize;
    this.cellSize = options.cellSize;

    // @private {Item[][]} null indicates an empty cell
    // Indexed from upper-left of the grid, in row-major order.
    this.cells = [];
    for ( var row = 0; row < this.gridSize.height; row++ ) {
      var rowOfCells = [];
      for ( var column = 0; column < this.gridSize.width; column++ ) {
        rowOfCells.push( null );
      }
      this.cells.push( rowOfCells );
    }

    // {Property} dependencies that require weight to be updated
    var weightDependencies = [];
    itemCreators.forEach( function( itemCreator ) {
      weightDependencies.push( itemCreator.weightProperty );
      weightDependencies.push( itemCreator.numberOfItemsOnScaleProperty );
    } );

    // @public the total weight of the Items that are on the platform
    this.weightProperty = new DerivedProperty( weightDependencies, function() {
      var weight = 0;
      itemCreators.forEach( function( itemCreator ) {
        weight += ( itemCreator.numberOfItemsOnScaleProperty.value * itemCreator.weightProperty.value );
      } );
      return weight;
    } );

    // @private
    this.removeItemBound = this.removeItem.bind( this );

    // When the platform moves, adjust the location of all Items.
    this.locationProperty.link( function( location ) {
      self.updateItemLocations();
    } );
  }

  equalityExplorer.register( 'WeighingPlatform', WeighingPlatform );


  return inherit( Object, WeighingPlatform, {

    /**
     * Gets the number of cells in the grid. This is the capacity of the platform.
     * @returns {number}
     */
    get numberOfCells() {
      return this.gridSize.width * this.gridSize.height;
    },

    /**
     * Organizes Items on the platform, as specified in #4
     * @public
     */
    organize: function() {
      //TODO organize Items on the platform, see #4
      //TODO cancel drag for all Items on the platform, in case the user is manually organizing
    },

    /**
     * Adds an Item to a specific cell in the grid.
     * @param {Item} item
     * @param {row:number, column:number} cell
     * @public
     */
    addItem: function( item, cell ) {
      assert && this.assertValidCell( cell );
      assert && assert( this.isEmptyCell( cell ), 'cell is occupied: ' + this.cellToString( cell ) );
      assert && assert( !this.containsItem( item ), 'item is already in grid: ' + item.toString() );
      this.putItemInCell( item, cell );
      item.disposedEmitter.addListener( this.removeItemBound );
    },

    /**
     * Removes an Item from the platform.
     * @param {Item} item
     * @public
     */
    removeItem: function( item ) {
      var cell = this.getCellForItem( item );
      assert && assert( cell, 'item not found: ' + item.toString() );
      item.disposedEmitter.removeListener( this.removeItemBound );
      this.putItemInCell( null, cell );
      this.shiftDown( cell );
    },

    /**
     * Shifts all Items in a column down 1 cell, to fill empty cell caused by removing an Item.
     * @param {row:number, column: number} cell - the cell that was occupied by the removed Item
     */
    shiftDown: function( cell ) {
      for ( var row = cell.row - 1; row >= 0; row-- ) {

        var currentCell = this.toCell( row, cell.column );

        if ( !this.isEmptyCell( currentCell ) ) {

          // remove Item from it's current cell
          var item = this.getItemInCell( currentCell );
          this.putItemInCell( null, currentCell );

          // move Item down 1 row
          var newCell = this.toCell( row + 1, cell.column );
          assert && assert( this.isEmptyCell( newCell ), 'cell is not empty: ' + this.cellToString( newCell ) );
          this.putItemInCell( item, newCell );
          item.moveTo( this.getCellLocation( newCell ) );
        }
      }
    },

    /**
     * Is the specific cell empty?
     * @param {row:number, column:number} cell
     * @returns {boolean}
     */
    isEmptyCell: function( cell ) {
      assert && this.assertValidCell( cell );
      return ( this.getItemInCell( cell ) === null );
    },

    /**
     * Gets the cell that an Item occupies.
     * @param item
     * @returns {row:number, column:number} null item doesn't occupy a cell
     */
    getCellForItem: function( item ) {
      var cell = null;
      for ( var row = 0; row < this.gridSize.height && !cell; row++ ) {
        var column = this.cells[ row ].indexOf( item );
        if ( column !== -1 ) {
          cell = this.toCell( row, column );
        }
      }
      return cell;
    },

    /**
     * Does the grid contain the specified Item?
     * @param {Item} item
     * @returns {boolean}
     * @public
     */
    containsItem: function( item ) {
      return ( this.getCellForItem( item ) !== null );
    },

    /**
     * Gets the closest empty cell to a specified location.
     * @param {Vector2} location
     * @returns {row:number, column:number}
     * @public
     */
    getClosestEmptyCell: function( location ) {

      var closestCell = this.getFirstEmptyCell();
      if ( !closestCell ) {
        return null;
      }

      var closestDistance = this.getCellLocation( closestCell ).distance( location );

      var currentCell = null; // the cell we're currently examining

      // Find the closest cell based on distance
      for ( var row = 0; row < this.gridSize.height; row++ ) {
        for ( var column = 0; column < this.gridSize.width; column++ ) {
          var cell = { row: row, column: column };
          if ( this.isEmptyCell( cell ) ) {
            currentCell = cell;
            var currentDistance = this.getCellLocation( currentCell ).distance( location );
            if ( currentDistance < closestDistance ) {
              closestDistance = currentDistance;
              closestCell = currentCell;
            }
          }
        }
      }

      // Now look below the closest cell to see if there are any empty cells in the same row.
      // This accounts for gravity, so Items fall to the cell that is closest to the bottom of the grid.
      for ( row = this.gridSize.height - 1; row > closestCell.row; row-- ) {
        currentCell = this.toCell( row, closestCell.column );
        if ( this.isEmptyCell( currentCell ) ) {
          closestCell = currentCell;
          break;
        }
      }

      return closestCell;
    },

    /**
     * Gets the location of a specific cell, in global coordinates.
     * A cell's location is in the center of the cell.
     *
     * @param {row:number, column:number} cell
     * @returns {Vector2}
     * @public
     */
    getCellLocation: function( cell ) {
      assert && this.assertValidCell( cell );

      var upperLeft = this.getGridUpperLeft();
      var x = upperLeft.x + ( cell.column * this.cellSize.width ) + ( 0.5 * this.cellSize.width );
      var y = upperLeft.y + ( cell.row * this.cellSize.height ) + ( 0.5 * this.cellSize.height );
      return new Vector2( x, y );
    },

    /**
     * Gets the location of the upper-left corner of the grid, in global coordinates.
     * @returns {Vector2}
     * @private
     */
    getGridUpperLeft: function() {
      var x = this.locationProperty.value.x - ( this.gridSize.width * this.cellSize.width ) / 2;
      var y = this.locationProperty.value.y - ( this.gridSize.height * this.cellSize.height );
      return new Vector2( x, y );
    },

    /**
     * Examines the grid from left to right, top to bottom, and returns the first empty cell.
     * @returns {row:number, column:number} null if the grid is full
     * @private
     */
    getFirstEmptyCell: function() {
      var emptyCell = null;
      for ( var row = this.gridSize.height - 1; row >= 0; row-- ) {
        for ( var column = 0; column < this.gridSize.width && !emptyCell; column++ ) {
          var cell = this.toCell( row, column );
          if ( this.isEmptyCell( cell ) ) {
            emptyCell = cell;
          }
        }
      }
      return emptyCell;
    },

    /**
     * Validates the data structure used to represent a cell. Intended to be called when assertions are enabled.
     * @param {*} cell
     */
    assertValidCell: function( cell ) {
      if ( assert ) {
        assert( cell );
        assert( typeof cell.row === 'number' );
        assert( typeof cell.column === 'number' );
        assert( cell.row >= 0 && cell.row < this.gridSize.height, 'row out of bounds: ' + cell.row );
        assert( cell.column >= 0 && cell.column < this.gridSize.width, 'column out of bounds: ' + cell.column );
      }
    },

    /**
     * String representation of the data structure used to represent a cell.
     * @param {row:number, column:number} cell
     * @returns {string}
     */
    cellToString: function( cell ) {
      assert && this.assertValidCell( cell );
      return StringUtils.fillIn( '[{{row}},{{column}}]', cell );
    },

    /**
     * Gets the Item in a cell.
     * @param {row:number, column:number} cell
     * @returns {Item|null} null if the cell is empty
     * @private
     */
    getItemInCell: function( cell ) {
      assert && this.assertValidCell( cell );
      return this.cells[ cell.row ][ cell.column ];
    },

    /**
     * Puts an Item in a cell.
     * @param {Item|null} item
     * @param {row:number, column:number} cell
     * @private
     */
    putItemInCell: function( item, cell ) {
      assert && assert( item === null || item instanceof Item );
      this.cells[ cell.row ][ cell.column ] = item;
    },

    /**
     * Converts row and column to a cell data structure.
     * @param {number} row
     * @param {number} column
     * @returns {{row:number, column:number}}
     * @private
     */
    toCell: function( row, column ) {
      return { row: row, column: column };
    },

    /**
     * Synchronize Item locations with their respective cell locations.
     * @private
     */
    updateItemLocations: function() {
      for ( var row = 0; row < this.gridSize.height; row++ ) {
        for ( var column = 0; column < this.gridSize.width; column++ ) {
          var cell = this.toCell( row, column );
          var item = this.getItemInCell( cell );
          item && item.moveTo( this.getCellLocation( cell ) );
        }
      }
    }
  } );
} );
