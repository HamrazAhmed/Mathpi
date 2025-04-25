'use client'

import { fetchCredits } from "@/lib/getCredits";
import { useEffect } from "react"

const CreditsWrapper = ({ children }: { children: React.ReactNode }) => {

    useEffect(() => {
        if (!sessionStorage.getItem("credits")) {
            fetchCredits().then(() => console.log("tokens loaded"));
        }
    }, []);

    return (
        <div>
            {children}
        </div>
    )
}

export default CreditsWrapper