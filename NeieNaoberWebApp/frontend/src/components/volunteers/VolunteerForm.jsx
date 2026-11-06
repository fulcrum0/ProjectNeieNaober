import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Lock, Send } from "lucide-react";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import FormSection from "../ui/FormSection";
import { isBirthDate, isEmail, isInfix, isName, isPhone, isPostcode } from "../../helpers/validators";
import { DUPLICATE_MESSAGES, findDuplicateField } from "../../helpers/volunteerUtils";

const empty = {
    firstName: "", infix: "", lastName: "", email: "", phone: "",
    street: "", houseNumber: "", addition: "", postcode: "", birthDate: "",
};

// Wat de gebruiker kan typen: letters in een telefoon- of huisnummer komen er niet eens in
const inputFilters = {
    phone: (v) => v.replace(/[^0-9+ -]/g, ""),
    houseNumber: (v) => v.replace(/\D/g, ""),
    postcode: (v) => v.toUpperCase().replace(/[^0-9A-Z ]/g, ""),
};

// Geeft per veld de foutmelding terug, of "" als het goed is
function validate(form, existing) {
    const required = (v, check, message, emptyMessage) => (!v.trim() ? emptyMessage : check(v) ? "" : message);
    const optional = (v, check, message) => (v.trim() && !check(v) ? message : "");

    const errors = {
        firstName: required(form.firstName, isName, "Een voornaam bevat alleen letters.", "Vul de voornaam in."),
        infix: optional(form.infix, isInfix, 'Een tussenvoegsel bevat alleen letters, zoals "van der".'),
        lastName: required(form.lastName, isName, "Een achternaam bevat alleen letters.", "Vul de achternaam in."),
        email: optional(form.email, isEmail, "Vul een geldig e-mailadres in, bijvoorbeeld eva@example.nl."),
        birthDate: optional(form.birthDate, isBirthDate, "Vul een geldige geboortedatum in (niet in de toekomst)."),
        phone: optional(form.phone, isPhone, "Vul een geldig telefoonnummer in, bijvoorbeeld 06 1234 5678."),
        postcode: optional(form.postcode, isPostcode, "Vul een postcode in zoals 9481 AB."),
    };

    // Minstens één manier om de vrijwilliger te bereiken: niet iedereen heeft e-mail
    if (!form.email.trim() && !form.phone.trim()) {
        errors.email = errors.phone = "Vul een e-mailadres of telefoonnummer in.";
    }

    const duplicate = findDuplicateField(form, existing);
    if (duplicate && !errors[duplicate]) errors[duplicate] = DUPLICATE_MESSAGES[duplicate];
    return errors;
}

export default function VolunteerForm({ organisationName, existing = [], onSubmit, onCancel }) {
    const [form, setForm] = useState(empty);
    const [consent, setConsent] = useState(false);
    const [touched, setTouched] = useState({});

    const errors = validate(form, existing);
    const hasErrors = Object.values(errors).some(Boolean);
    const valid = !hasErrors && consent;

    const field = (key) => ({
        id: key,
        value: form[key],
        onChange: (e) => setForm({ ...form, [key]: (inputFilters[key] ?? String)(e.target.value) }),
        onBlur: () => setTouched((t) => ({ ...t, [key]: true })),
        error: touched[key] ? errors[key] : "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (valid) onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
                <FormSection title="1. Gegevens van de vrijwilliger">
                    <TextField label="Voornaam" required autoComplete="given-name" {...field("firstName")} />
                    <div className="form-row">
                        <TextField label="Tussenvoegsel" optional maxLength={20} {...field("infix")} />
                        <TextField label="Achternaam" required autoComplete="family-name" {...field("lastName")} />
                    </div>
                    <p className="muted small">Vul minstens een e-mailadres of telefoonnummer in. *</p>
                    <TextField label="E-mailadres" type="email" autoComplete="email" {...field("email")} />
                    <TextField
                        label="Telefoonnummer" type="tel" inputMode="tel" maxLength={20}
                        placeholder="06 1234 5678" {...field("phone")}
                    />
                    <TextField
                        label="Geboortedatum" type="date" optional
                        min="1900-01-01" max={new Date().toISOString().slice(0, 10)}
                        {...field("birthDate")}
                    />
                    <TextField label="Straatnaam" optional {...field("street")} />
                    <div className="form-row">
                        <TextField label="Huisnummer" inputMode="numeric" optional maxLength={5} {...field("houseNumber")} />
                        <TextField label="Toevoeging" optional maxLength={10} {...field("addition")} />
                    </div>
                    <TextField label="Postcode" optional maxLength={7} placeholder="9481 AB" {...field("postcode")} />
                </FormSection>

                <FormSection title="2. Organisatie en privacy">
                    <TextField id="org" label="Organisatie" value={organisationName} readOnly disabled />
                    <h3 className="form-section__subtitle">Privacyvoorwaarden en organisatieverantwoordelijkheid *</h3>
                    <p className="muted">
                        VIP! Tynaarlo verwerkt deze gegevens voor vrijwilligersregistratie, controle en contact. Alleen bevoegde
                        medewerkers krijgen toegang. De organisatie is verantwoordelijk voor het verkrijgen van toestemming van de
                        vrijwilliger voordat de gegevens worden ingediend. Goedgekeurde registraties kunnen in de jaarlijst voor de
                        gemeente worden opgenomen.
                    </p>
                    <p className="muted small">
                        De organisatie moet vooraf toestemming van de vrijwilliger verkrijgen. De privacyverklaring beschrijft de
                        verwerking, rechten en verantwoordelijkheden.
                    </p>
                    <Link to="/privacy" target="_blank" className="ext-link">
                        Lees de openbare privacyverklaring en registratievoorwaarden <ExternalLink size={14} />
                    </Link>
                    <label className="consent">
                        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                        <span>
                            Ik bevestig namens de organisatie dat toestemming van de vrijwilliger is verkregen en ik accepteer de
                            privacyvoorwaarden en de verantwoordelijkheid van de organisatie voor deze registratie. *
                        </span>
                    </label>
                </FormSection>
            </div>

            <div className="form-actions">
                <Button type="button" variant="outline" onClick={onCancel}>Terug naar overzicht</Button>
                <div className="form-actions__right">
                    {!valid && <Lock size={20} />}
                    <Button type="submit" icon={Send} disabled={!valid}>Registratie versturen</Button>
                </div>
            </div>
        </form>
    );
}
