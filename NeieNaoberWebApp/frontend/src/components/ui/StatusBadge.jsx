import { isConcept } from "../../helpers/volunteerUtils";

export default function StatusBadge({ volunteer }) {
    return isConcept(volunteer)
        ? <span className="badge badge--concept">Concept</span>
        : <span className="badge badge--sent">Verstuurd</span>;
}
