import { useNavigate } from "react-router-dom";

export default function useNavHandler() {
    const navigate = useNavigate();
    return (e) => navigate(e.currentTarget.dataset.to);
}