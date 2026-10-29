import { Link } from "react-router-dom";

export default function Button({ variant = "primary", icon: Icon, to, children, className = "", ...props }) {
    const cls = `btn btn--${variant} ${className}`;
    const content = (
        <>
            {Icon && <Icon size={18} />}
            {children}
        </>
    );
    return to ? (
        <Link to={to} className={cls} {...props}>{content}</Link>
    ) : (
        <button className={cls} {...props}>{content}</button>
    );
}