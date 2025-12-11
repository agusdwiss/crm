import AuthGuard from "@/components/auth-guard";
import Header from "@/components/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
