export default function SelectField({ label, id, required, error, options, ...props }) {
    return (
        <div className={`field ${error ? "field--error" : ""}`}>
            <label htmlFor={id}>
                {label}
                {required && " *"}
            </label>
            <select id={id} {...props}>
                {options.map(({ value, label: text }) => (
                    <option key={value} value={value}>
                        {text}
                    </option>
                ))}
            </select>
            {error && <p className="field__error">{error}</p>}
        </div>
    );
}
