import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Lock, Send } from "lucide-react";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import FormSection from "../ui/FormSection";
import { isEmail } from "../../helpers/validators";

const empty = {
    firstName: "", lastName: "", email: "", phone: "",
    street: "", houseNumber: "", addition: "", postcode: "", birthDate: "",
};

export default function VolunteerForm({ organisationName, onSubmit, onCancel }) {
    const [form, setForm] = useState(empty);
    const [consent, setConsent] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
    const emailError =
        emailTouched && !isEmail(form.email) ? "Vul een geldig e-mailadres in, bijvoorbeeld eva@example.nl." : "";
    const valid = form.firstName.trim() && form.lastName.trim() && isEmail(form.email) && consent;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (valid) onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
                <FormSection title="1. Gegevens van de vrijwilliger">
                    <div className="form-row">
                        <TextField id="firstName" label="Voornaam" required value={form.firstName} onChange={set("firstName")} />
                        <TextField id="lastName" label="Achternaam" required value={form.lastName} onChange={set("lastName")} />
                    </div>
                    <TextField
                        id="email" label="E-mailadres" type="email" required
                        value={form.email} onChange={set("email")}
                        onBlur={() => setEmailTouched(true)} error={emailError}
                    />
                    <TextField
                        id="birthDate" label="Geboortedatum" type="date"
                        max={new Date().toISOString().slice(0, 10)}
                        value={form.birthDate} onChange={set("birthDate")}
                    />
                    <TextField id="phone" label="Telefoonnummer" value={form.phone} onChange={set("phone")} />
                    <TextField id="street" label="Straatnaam" value={form.street} onChange={set("street")} />
                    <div className="form-row">
                        <TextField id="houseNumber" label="Huisnummer" value={form.houseNumber} onChange={set("houseNumber")} />
                        <TextField id="addition" label="Toevoeging" value={form.addition} onChange={set("addition")} />
                    </div>
                    <TextField id="postcode" label="Postcode" value={form.postcode} onChange={set("postcode")} />
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