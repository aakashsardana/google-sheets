import { useCallback, useEffect, useState } from "react";
import {nanoid} from 'nanoid';
import Cell from "./Cell";
import Row from "./Row";
import AxisCell from "./AsixCell";
import Menu from "./Menu";
import MenuItem from "./MenuItem";

function processRows(rowCount, columnCount) {
    let layout = {
        rows: {},
        rowsOrder: []
    };
    for(let i = 0; i < rowCount; i++) {
        const rowId = nanoid();
        layout.rowsOrder.push(rowId);
        layout.rows[rowId] = [];
        for(let j = 0; j < columnCount; j++) {
            const columnId = nanoid();
            layout.rows[rowId].push(columnId);
        }
    }
    return layout;
}

function Sheet({initialRows = 20, initialColumns = 20}) {
    const [sheetLayout, setSheetLayout] = useState(() => processRows(initialRows, initialColumns));
    const [currentRowAndCell, setCurrentRowAndCell] = useState({});
    const [currentRowMenuClicked, setCurrentRowMenuClicked] = useState({});
    const [showMenu, setShowMenu] = useState(false);
    const [clickedAxisType, setClickedAxisType] = useState(null);
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
    

    const { rowsOrder, rows } = sheetLayout;
    
    const {currentRowIndex, currentRowId, currentCellId, currentCellIndex} = currentRowAndCell;
    
    const handleContextClick = useCallback((e) => {
        e.preventDefault();
        if(e.target.classList.contains('row-axis')) {
            const rowId = e.target.dataset.rowId;
            const rowIndex = e.target.dataset.rowIndex;
            setCurrentRowMenuClicked({rowId, rowIndex});
            setClickedAxisType("row")
            setShowMenu(true);
            setMenuPosition({x: e.x, y: e.y});
        } else if(e.target.classList.contains('cell-axis')) {
            const cellIndex = e.target.dataset.cellIndex;
            setCurrentRowMenuClicked({cellIndex});
            setClickedAxisType("cell")
            setShowMenu(true);
            setMenuPosition({x: e.x, y: e.y});
        } else {
            setShowMenu(false);
            setMenuPosition({});
            setCurrentRowMenuClicked({});
        }
    }, [])

    const handleClickOutside = useCallback((e) => {
        if(showMenu) {
            setShowMenu(false);
        }
    }, [showMenu])

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener("contextmenu", handleClickOutside);
        }
    }, [handleClickOutside]);

    useEffect(() => {
        document.addEventListener("contextmenu", handleContextClick)

        return () => {
            document.removeEventListener("contextmenu", handleContextClick);
        }
    }, [handleContextClick])

    function handleCellFocus(e, cellId, cellIndex, rowId, rowIndex) {
        setCurrentRowAndCell({
            currentRowIndex: rowIndex,
            currentRowId: rowId,
            currentCellId: cellId,
            currentCellIndex: cellIndex
        })
    }

    function handleCellBlur(e) {
        setCurrentRowAndCell({})
    }

    function handleInsertRow(insertAbove) {
        let newRowsOrder = [...rowsOrder];
        let newRows = {...rows}

        const newRowid = nanoid();
        const {rowIndex, rowId} = currentRowMenuClicked;
        const columnCount = rows[rowId].length;

        let indexToInsert;
        if(insertAbove) {
            indexToInsert = rowIndex - 1;
        } else {
            indexToInsert = rowIndex + 1;
        }

        newRowsOrder.splice(indexToInsert, 0, newRowid);
        newRows[newRowid] = [];

        for(let i = 0; i < columnCount; i++) {
            const columnId = nanoid();
            newRows[newRowid].push(columnId);
        }

        const newLayout = {
            rows: newRows,
            rowsOrder: newRowsOrder
        }

        setSheetLayout(newLayout);
    }

    function handleInsertColumn(insertLeft) {
        let newRows = {...rows}
        const {cellIndex} = currentRowMenuClicked;

        let indexToInsert;
        if(insertLeft) {
            indexToInsert = cellIndex;
        } else {
            indexToInsert = cellIndex + 1;
        }

        for(let i = 0; i < rowsOrder.length; i++) {
            const cells = [...newRows[rowsOrder[i]]];
            const columnId = nanoid();
            cells.splice(indexToInsert, 0, columnId)
            newRows[rowsOrder[i]] = cells;
        }
        const newLayout = {
            rows: newRows,
            rowsOrder
        }


        setSheetLayout(newLayout);
    }

    return (
        <>
            <div className="sheet-container">
                {rowsOrder.map((rowId, index) => {
                    const row = rows[rowId];
                    const rowIndex = index;
                    return (
                        <Row key={rowId}>
                            <AxisCell type="row" currentRowId={currentRowId} rowIndex={rowIndex} rowId={rowId}>{index + 1}</AxisCell>
                            {row.map((cellId, index) => {
                                const cellIndex = index;
                                return (
                                    <div key={cellId}>
                                        {rowIndex === 0 ? <AxisCell type="cell" currentRowId={currentRowId} currentCellIndex={currentCellIndex} currentCellId={currentCellId} cellId={cellId} cellIndex={cellIndex} rowIndex={rowIndex}  rowId={rowId}>{index + 1}</AxisCell> : null}
                                        <Cell
                                            id={cellId} 
                                            rowId={rowId}
                                            cellIndex={cellIndex}
                                            rowIndex={rowIndex} 
                                            handleCellFocus={handleCellFocus} 
                                            handleCellBlur={handleCellBlur}     
                                        />
                                    </div>
                                )
                            })}
                        </Row>
                    )
                })}
            </div>
            {showMenu && clickedAxisType === "row" ? (
                <Menu menuPosition={menuPosition}>
                    <MenuItem onClick={() => handleInsertRow(true)}>Insert 1 above</MenuItem>
                    <MenuItem onClick={() => handleInsertRow(false)}>Insert 1 below</MenuItem>
                </Menu>
            ) : null}

            {showMenu && clickedAxisType === "cell" ? (
                <Menu menuPosition={menuPosition}>
                    <MenuItem onClick={() => handleInsertColumn(true)}>Insert 1 left</MenuItem>
                    <MenuItem onClick={() => handleInsertColumn(false)}>Insert 1 right</MenuItem>
                </Menu>
            ) : null}
        </>
    )
}

export default Sheet;