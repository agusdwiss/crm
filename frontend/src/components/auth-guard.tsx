"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Cek token di cookie atau localStorage
        // Kita cek cookie sederhana
        const hasToken = document.cookie.includes("token=");

        if (!hasToken) {
            router.push("/login");
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) {
        // Bisa return Loading Spinner di sini
        return <div className="h-screen flex items-center justify-center">Memeriksa akses...</div>;
    }

    return <>{children}</>;
}
