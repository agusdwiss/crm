"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export default function Header() {
    const router = useRouter();

    const handleLogout = () => {
        // Hapus token dari cookie dan localStorage
        document.cookie = "token=; path=/; max-age=0";
        localStorage.removeItem("token");

        // Redirect ke halaman login
        router.push("/login");
        router.refresh(); // Refresh agar middleware/layout update state
    };

    return (
        <header className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                </div>
                <h1 className="font-bold text-lg text-gray-800">Dashboard</h1>
            </div>
            <div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                    <LogOut className="h-4 w-4" />
                    Keluar
                </Button>
            </div>
        </header>
    );
}
