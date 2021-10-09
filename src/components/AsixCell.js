function AxisCell({ type, children, currentRowId, rowId, rowIndex, currentCellIndex, cellId, cellIndex }) {
    let isSelected = false;
    if(type === "row") {
        isSelected = currentRowId === rowId;
    } else if(type === "cell") {
        isSelected = currentCellIndex === cellIndex;
    }

    let axisCellStyles = {};
    if(isSelected) {
        axisCellStyles.backgroundColor = '#E9EAED';
    } else {
        axisCellStyles.backgroundColor = '#F8F9FA';
    }

    return (
        <div 
            style={axisCellStyles} 
            className={`axis-cell ${type}-axis`} 
            data-row-id={rowId} 
            data-row-index={rowIndex}
            data-cell-index={cellIndex}
            data-cell-id={cellId}>
            {children}
        </div>
    )
}

export default AxisCell;