import { useCallback, useEffect, useState } from "react";
import { api } from "../services/ApiClient";

// Haalt data op bij het openen van een scherm en opnieuw als het pad of de filters veranderen.
// reload() gebruik je na een wijziging, zodat de lijst weer klopt met de database.
export function useApi(path, params) {
    const key = path ? path + JSON.stringify(params || {}) : null;
    const [state, setState] = useState({ key: null, data: null, error: null });
    const [tick, setTick] = useState(0);

    useEffect(() => {
        if (!key) return;
        let active = true;

        api.get(path, params)
            .then((data) => active && setState({ key, data, error: null }))
            .catch((error) => active && setState({ key, data: null, error }));

        return () => {
            active = false;
        };
        // key bevat path en params al; zo laden we niet opnieuw bij elke render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, tick]);

    const reload = useCallback(() => setTick((t) => t + 1), []);
    const loading = Boolean(key) && state.key !== key;

    // Tijdens het laden van nieuwe filters de vorige data laten staan: rustiger voor het oog
    return { data: state.data, error: loading ? null : state.error, loading, reload };
}
