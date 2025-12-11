"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: "", password: "", name: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/auth/register", formData);
            alert("Registrasi berhasil! Silakan login.");
            router.push("/login");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Registrasi gagal. Username mungkin sudah dipakai.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-gray-200 p-3 rounded-full w-fit mb-2">
                        <UserPlus className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Daftar Akun Baru</CardTitle>
                    <CardDescription>Buat akun untuk mengakses CRM.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="wowo"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Wowo Susanto"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="pt-6 flex flex-col space-y-2">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                        </Button>
                        <div className="text-sm text-center text-gray-500">
                            Sudah punya akun?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Login di sini
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </main>
    );
}
