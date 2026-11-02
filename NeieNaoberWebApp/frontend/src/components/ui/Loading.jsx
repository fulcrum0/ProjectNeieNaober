export default function Loading({ text = "Laden..." }) {
    return (
        <p className="muted loading" role="status">
            {text}
        </p>
    );
}
