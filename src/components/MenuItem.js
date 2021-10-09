function MenuItem({onClick, children}) {
    return (
        <div onClick={onClick} className="menu-item">{children}</div>
    )
}

export default MenuItem;