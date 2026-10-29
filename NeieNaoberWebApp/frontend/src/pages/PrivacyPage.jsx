import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import FormSection from "../components/ui/FormSection";
import PolicyBlock from "../components/privacy/PrivacyBlock";
import { useAuth } from "../context/AuthContext";
import { privacyIntro, privacySections } from "../data/privacyContent";

export default function PrivacyPage() {
    const { user } = useAuth();
    return (
        <div className="privacy">
            <Button variant="outline" icon={ArrowLeft} to={user ? "/" : "/login"}>
                {user ? "Terug" : "Terug naar inloggen"}
            </Button>
            <h1 className="page-title privacy__title">Privacyverklaring</h1>
            <p className="muted privacy__intro">{privacyIntro}</p>
            {privacySections.map((s, i) => (
                <FormSection key={s.title} title={`${i + 1}. ${s.title}`}>
                    {s.blocks.map((b, j) => (
                        <PolicyBlock key={j} block={b} />
                    ))}
                </FormSection>
            ))}
        </div>
    );
}