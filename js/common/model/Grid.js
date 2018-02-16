// Copyright 2017-2018, University of Colorado Boulder

/**
 * A grid that contains terms. The grid is filled from the bottom up, so that there are no empty cells
 * below an occupied cell. Origin is at the bottom center.
 *
 * A cell in the grid is identified by an integer index. The client doesn't need to know how to interpret
 * this index. It gets an index from the grid, and uses the index to refer to the cell.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractTerm = require( 'EQUALITY_EXPLORER/common/model/AbstractTerm' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var NO_ITEM = null;

  /**
   * @param {Property.<Vector2>} locationProperty
   * @param {Object} [options]
   * @constructor
   */
  function Grid( locationProperty, options ) {

    var self = this;

    options = _.extend( {
      rows: 10,
      columns: 10,
      cellWidth: 5,
      cellHeight: 5
    }, options );

    // @private (read-only)
    this.locationProperty = locationProperty;

    // @public (read-only)
    this.rows = options.rows;
    this.columns = options.columns;
    this.numberOfCells = options.rows * options.columns;

    // @private
    this.cellWidth = options.cellWidth;
    this.cellHeight = options.cellHeight;

    // @private The 2D grid is stored as a 1D array, in row-major order (left-to-right, top-to-bottom).
    // Each entry in this array is a cell in the grid.  Empty cells contain NO_ITEM.
    this.cells = [];
    for ( var index = 0; index < this.numberOfCells; index++ ) {
      this.cells[ index ] = NO_ITEM;
    }

    // @private bounds of the grid, initialized in locationProperty listener
    this.bounds = new Bounds2( 0, 1, 0, 1 );

    // When the grid moves, move all terms that are in the grid. unlink unnecessary
    this.locationProperty.link( function( location ) {

      // recompute the grid's bounds, origin (x,y) is at bottom center
      self.bounds.setMinMax(
        location.x - ( self.columns * self.cellWidth / 2 ), // minX
        location.y - ( self.rows * self.cellHeight ), // minY
        location.x + ( self.columns * self.cellWidth / 2 ), // maxX
        location.y // maxY
      );

      // move the terms
      for ( var index = 0; index < self.cells.length; index++ ) {
        if ( self.cells[ index ] !== NO_ITEM ) {
          self.cells[ index ].moveTo( self.getLocationForCell( index ) );
        }
      }
    } );
  }

  equalityExplorer.register( 'Grid', Grid );

  return inherit( Object, Grid, {

    /**
     * Is the specified cell empty?
     * @param {number} index - the cell's index
     * @returns {boolean}
     * @public
     */
    isEmptyCell: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      return ( this.cells[ index ] === NO_ITEM );
    },

    /**
     * Clears the specified cell
     * @param index - the cell's index
     * @public
     */
    clearCell: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      this.cells[ index ] = NO_ITEM;
    },

    /**
     * Clears all cells.
     * @public
     */
    clearAllCells: function() {
      for ( var index = 0; index < this.cells.length; index++ ) {
        this.cells[ index ] = NO_ITEM;
      }
    },

    /**
     * Gets the index of the cell that corresponds to a location.
     * @param {Vector2} location
     * @returns {number} -1 if the location is outside the grid
     * @private
     */
    getCellAtLocation: function( location ) {
      var index = -1;
      if ( this.containsLocation( location ) ) {

        // row and column of the cell that contains location
        var row = Math.floor( ( location.y - this.bounds.minY  ) / this.cellHeight );
        var column = Math.floor( ( location.x - this.bounds.minX ) / this.cellWidth );

        index = this.rowColumnToIndex( row, column );
      }
      return index;
    },

    /**
     * Is the specified location inside the grid?
     * This needs to be fast, since it's called during a drag cycle.
     * @param {Vector2} location
     * @returns {boolean}
     * @private
     */
    containsLocation: function( location ) {
      return this.bounds.containsPoint( location );
    },

    /**
     * Gets the index for the cell that a term occupies.
     * @param {AbstractTerm} term
     * @returns {number} the cell's index, -1 if the term doesn't occupy a cell
     * @public
     */
    getCellForTerm: function( term ) {
      assert && assert( term instanceof AbstractTerm, 'invalid term' );
      return this.cells.indexOf( term );
    },

    /**
     * Gets the term that occupies a specified cell.
     * @param {number} index - the cell's index
     * @returns {AbstractTerm|null} - null if the cell is empty
     * @public
     */
    getTermForCell: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      return this.cells[ index ];
    },

    /**
     * Gets the term at a specified location in the grid.
     * @param {Vector2} location
     * @returns {AbstractTerm|null} null if location is outside the grid, or the cell at location is empty
     * @public
     */
    getTermAtLocation: function( location ) {
      var term = null;
      var index = this.getCellAtLocation( location );
      if ( index !== -1 ) {
        term = this.getTermForCell( index );
      }
      return term;
    },

    /**
     * Puts a term in the specified cell. The cell must be empty.
     * @param {AbstractTerm} term
     * @param {number} index - the cell's index
     * @public
     */
    putTerm: function( term, index ) {
      assert && assert( term instanceof AbstractTerm, 'invalid term' );
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      assert && assert( this.isEmptyCell( index ), 'cell is occupied, index: ' + index );
      this.cells[ index ] = term;
      term.moveTo( this.getLocationForCell( index ) );
    },

    /**
     * Removes a term from the grid. Any terms above it move down to fill the empty cell.
     * @param {AbstractTerm} term
     * @public
     */
    removeTerm: function( term ) {
      assert && assert( term instanceof AbstractTerm, 'invalid term' );
      var index = this.getCellForTerm( term );
      assert && assert( index !== -1, 'term not found: ' + term.toString() );
      this.clearCell( index );
      this.shiftDown( index );
    },

    /**
     * Shifts all term that are above a cell down 1 cell, to fill the empty cell caused by removing a term.
     * @param {index} index - index of the cell that was occupied by the removed term
     * @private
     */
    shiftDown: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      assert && assert( this.isEmptyCell( index ), 'cell is not empty: ' + index );

      // row and column of the removed term
      var removedRow = this.indexToRow( index );
      var removedColumn = this.indexToColumn( index );

      // start with the row above the removed term, and work up
      for ( var row = removedRow - 1; row >= 0; row-- ) {

        var currentIndex = this.rowColumnToIndex( row, removedColumn );

        if ( !this.isEmptyCell( currentIndex ) ) {

          // remove term from it's current cell
          var term = this.cells[ currentIndex ];
          this.clearCell( currentIndex );

          // move term down 1 row
          var newIndex = this.rowColumnToIndex( row + 1, removedColumn );
          this.putTerm( term, newIndex );
        }
      }
    },

    /**
     * Gets the location of a specific cell. A cell's location is in the center of the cell.
     * @param {number} index - the cell's index
     * @returns {Vector2}
     * @public
     */
    getLocationForCell: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );

      var row = this.indexToRow( index );
      var column = this.indexToColumn( index );

      var x = this.bounds.minX + ( column * this.cellWidth ) + ( 0.5 * this.cellWidth );
      var y = this.bounds.minY + ( row * this.cellHeight ) + ( 0.5 * this.cellHeight );
      return new Vector2( x, y );
    },

    /**
     * Finds the first empty cell, starting at bottom row, right-to-left.
     * @returns {number} - cell index, -1 if the grid is full
     * @public
     */
    getFirstEmptyCell: function() {
      return this.cells.lastIndexOf( NO_ITEM );
    },

    /**
     * Gets the closest empty cell to a specified location.
     * @param {Vector2} location
     * @returns {number} - the cell's index, -1 if the grid is full
     * @public
     */
    getClosestEmptyCell: function( location ) {

      var closestIndex = this.getFirstEmptyCell();

      if ( closestIndex !== -1 ) {

        var closestDistance = this.getLocationForCell( closestIndex ).distance( location );

        // Find the closest cell based on distance
        for ( var index = 0; index < this.cells.length; index++ ) {
          if ( this.isEmptyCell( index ) ) {
            var currentDistance = this.getLocationForCell( index ).distance( location );
            if ( currentDistance < closestDistance ) {
              closestDistance = currentDistance;
              closestIndex = index;
            }
          }
        }

        // Now look below the closest cell to see if there are any empty cells in the same column.
        // This makes terms "fall" to the cell that is closest to the bottom of the grid.
        var closestRow = this.indexToRow( closestIndex );
        var closestColumn = this.indexToColumn( closestIndex );
        for ( var row = this.rows - 1; row > closestRow; row-- ) {
          var indexBelow = this.rowColumnToIndex( row, closestColumn );
          if ( this.isEmptyCell( indexBelow ) ) {
            closestIndex = indexBelow;
            break;
          }
        }
      }

      return closestIndex;
    },

    /**
     * Is the specified cell valid?
     * @param {number} index - the cell's index
     * @returns {boolean}
     * @private
     */
    isValidCell: function( index ) {
      return ( Util.isInteger( index ) && index >= 0 && index < this.cells.length );
    },

    /**
     * Converts a cell index to a row number.
     * @param {number} index
     * @returns {number}
     * @private
     */
    indexToRow: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      var row = Math.ceil( ( index + 1 ) / this.columns ) - 1;
      assert && assert( row >= 0 && row < this.rows );
      return row;
    },

    /**
     * Converts a cell index to a column number.
     * @param {number} index
     * @returns {number}
     * @private
     */
    indexToColumn: function( index ) {
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      var column = index % this.columns;
      assert && assert( column >= 0 && column < this.columns );
      return column;
    },

    /**
     * Converts row and column to a cell index.
     * @param {number} row
     * @param {number} column
     * @returns {number}
     * @public
     */
    rowColumnToIndex: function( row, column ) {
      assert && assert( row >= 0 && row < this.rows, 'row out of range: ' + row );
      assert && assert( column >= 0 && column < this.columns, 'column out of range: ' + column );
      var index = ( row * this.columns ) + column;
      assert && assert( this.isValidCell( index ), 'invalid cell index: ' + index );
      return index;
    }
  } );
} );