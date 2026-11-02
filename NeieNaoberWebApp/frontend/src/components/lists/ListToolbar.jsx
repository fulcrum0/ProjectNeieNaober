import { useState } from "react";
import { Search } from "lucide-react";
import Button from "../ui/Button";

// Zoeken gebeurt op de server (alle pagina's), daarom pas na Enter of de knop "Zoeken"
export default function ListToolbar({ placeholder, query, onSearch, children }) {
    const [text, setText] = useState(query || "");

    const submit = (e) => {
        e.preventDefault();
        onSearch(text.trim());
    };

    return (
        <div className="table-toolbar">
            <form className="table-toolbar__search" onSubmit={submit} role="search">
                <div className="table-toolbar__actions">
                    <label className="search">
                        <Search size={18} />
                        <input placeholder={placeholder} aria-label={placeholder} value={text} onChange={(e) => setText(e.target.value)} />
                    </label>
                    <Button type="submit" variant="outline">Zoeken</Button>
                </div>
            </form>
            {children && <div className="table-toolbar__actions">{children}</div>}
        </div>
    );
}
