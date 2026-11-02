import { useState } from "react";
import { Save } from "lucide-react";
import TextField from "../ui/TextField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import FormSection from "../ui/FormSection";
import Alert from "../ui/Alert";

// Alleen de velden die de gemeente nodig heeft (TO 6, AVG): geen telefoon, e-mail of geboortedatum
const FIELDS = ["aanhef", "voornaam", "tussenvoegsel", "achternaam", "straat", "huisnummer", "postcode", "woonplaats"];
const REQUIRED = ["voornaam", "achternaam", "straat", "huisnummer", "postcode", "woonplaats"];

const empty = Object.fromEntries(FIELDS.map((f) => [f, ""]));

const AANHEF_OPTIONS = [
    { value: "", label: "Geen" },
    { value: "dhr.", label: "dhr." },
    { value: "mevr.", label: "mevr." },
];

// Eerste controle in de browser voor snelle hulp; Laravel controleert altijd nog een keer (TO 6)
function checkClientSide(form) {
    const errors = {};
    for (const field of REQUIRED) {
        if (!String(form[field] || "").trim()) errors[field] = "Dit veld is verplicht.";
    }
    if (form.postcode && !/^[1-9][0-9]{3}\s?[A-Za-z]{2}$/.test(form.postcode.trim())) {
        errors.postcode = "Vul een postcode in zoals 9481 AB.";
    }
    if (/^(dhr|mevr)\b/i.test(form.voornaam.trim())) {
        errors.voornaam = "Zet dhr. of mevr. niet bij de voornaam. Kies de aanhef.";
    }
    if (form.huisnummer && !/^[1-9][0-9]*/.test(form.huisnummer.trim())) {
        errors.huisnummer = "Vul een huisnummer in dat begint met een cijfer, zoals 12 of 12a.";
    }
    return errors;
}

export default function VolunteerForm({ initial, onSubmit, onCancel, submitLabel = "Opslaan", aside, disabled, externalKeys = [] }) {
    const [form, setForm] = useState({ ...empty, ...pick(initial) });
    const [errors, setErrors] = useState({});
    const [general, setGeneral] = useState([]);
    const [busy, setBusy] = useState(false);

    const set = (key) => (e) => {
        setForm({ ...form, [key]: e.target.value });
        if (errors[key]) setErrors({ ...errors, [key]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const clientErrors = checkClientSide(form);
        setErrors(clientErrors);
        setGeneral([]);
        if (Object.keys(clientErrors).length) return;

        setBusy(true);
        try {
            await onSubmit({ ...form, aanhef: form.aanhef || null, tussenvoegsel: form.tussenvoegsel || null });
        } catch (error) {
            // Meldingen per veld onder het veld; de rest (bijv. "al 3 keer aangemeld") bovenaan
            const fieldErrors = {};
            const other = [];
            for (const [key, messages] of Object.entries(error.errors || {})) {
                if (FIELDS.includes(key)) fieldErrors[key] = messages[0];
                else if (!externalKeys.includes(key)) other.push(messages[0]);
            }
            setErrors(fieldErrors);
            // Geen meldingen per veld (bijv. geen internet of 500)? Dan de algemene melding tonen
            setGeneral(Object.keys(error.errors || {}).length ? other : [error.message]);
        } finally {
            setBusy(false);
        }
    };

    const field = (id, label, props = {}) => (
        <TextField id={id} label={label} required={REQUIRED.includes(id)} value={form[id]} onChange={set(id)} error={errors[id]} {...props} />
    );

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className={aside ? "form-grid" : ""}>
                <FormSection title="Gegevens van de vrijwilliger">
                    <div className="form-row">
                        <SelectField id="aanhef" label="Aanhef" value={form.aanhef} onChange={set("aanhef")} options={AANHEF_OPTIONS} error={errors.aanhef} />
                        {field("tussenvoegsel", "Tussenvoegsel", { placeholder: "bijv. van der" })}
                    </div>
                    <div className="form-row">
                        {field("voornaam", "Voornaam", { autoComplete: "off" })}
                        {field("achternaam", "Achternaam", { autoComplete: "off" })}
                    </div>
                    {field("straat", "Straat")}
                    <div className="form-row">
                        {field("huisnummer", "Huisnummer", { placeholder: "bijv. 12a" })}
                        {field("postcode", "Postcode", { placeholder: "bijv. 9481 AB" })}
                    </div>
                    {field("woonplaats", "Woonplaats")}
                </FormSection>
                {aside}
            </div>

            {general.length > 0 && (
                <Alert type="error" title="Niet opgeslagen">
                    {general.map((m) => (
                        <p key={m}>{m}</p>
                    ))}
                </Alert>
            )}

            <div className="form-actions">
                {onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Annuleren</Button> : <span />}
                <Button type="submit" icon={Save} disabled={busy || disabled}>
                    {busy ? "Bezig..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}

function pick(initial) {
    if (!initial) return {};
    return Object.fromEntries(FIELDS.map((f) => [f, initial[f] ?? ""]));
}
