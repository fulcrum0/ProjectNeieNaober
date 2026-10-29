export default function TextField({ label, id, required, error, ...props }) {
    return (
        <div className={`field ${error ? "field--error" : ""}`}>
            <label htmlFor={id}>
                {label}
                {required && " *"}
            </label>
            <input id={id} {...props} />
            {error && <p className="field__error">{error}</p>}
        </div>
    );
}