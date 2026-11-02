// Een duidelijke melding in gewone taal (FE-3). role="alert" zodat een schermlezer hem voorleest.
export default function Alert({ type = "info", title, children }) {
    if (!title && !children) return null;
    return (
        <div className={`alert alert--${type}`} role={type === "error" ? "alert" : "status"}>
            {title && <strong>{title}</strong>}
            {children && <div>{children}</div>}
        </div>
    );
}
