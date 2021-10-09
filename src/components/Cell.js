function Cell({ id, rowId, rowIndex, cellIndex, handleCellFocus, handleCellBlur }) {
    return (
        <div className="cell" id={id}>
            <input 
                onFocus={(e) => handleCellFocus(e, id, cellIndex, rowId, rowIndex)} 
                onBlur={e => handleCellBlur(e)}
                className="cell__input" type="text" />
        </div>
    )
}

export default Cell;