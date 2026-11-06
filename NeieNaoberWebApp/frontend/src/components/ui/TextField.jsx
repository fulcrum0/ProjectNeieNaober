export default function TextField({ label, id, required, optional, error, ...props }) {
    return (
        <div className={`field ${error ? "field--error" : ""}`}>
            <label htmlFor={id}>
                {label}
                {required && " *"}
                {optional && <span className="field__optional"> (optioneel)</span>}
            </label>
            <input id={id} aria-invalid={Boolean(error)} {...props} />
            {error && <p className="field__error">{error}</p>}
        </div>
    );
}
