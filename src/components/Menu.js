function Menu({menuPosition, children}) {
    const {x, y} = menuPosition;
    let menuStyles = {
        left: `${x}px`,
        top: `${y}px`
    }
    return <div style={menuStyles} className="menu">{children}</div>
}

export default Menu;