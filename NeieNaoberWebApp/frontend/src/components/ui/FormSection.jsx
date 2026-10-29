export default function FormSection({ title, children }) {
    return (
        <section className="form-section">
            <header className="form-section__head">{title}</header>
            <div className="form-section__body">{children}</div>
        </section>
    );
}