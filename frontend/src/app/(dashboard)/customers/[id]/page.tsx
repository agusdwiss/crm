"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Customer } from "@/types/customer";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import UpdateCustomerDialog from "@/components/customers/update-customer-dialog";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/map-view"), { ssr: false });

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchCustomer(id as string);
        }
    }, [id]);

    const fetchCustomer = async (customerId: string) => {
        try {
            const response = await api.get<Customer>(`/customers/${customerId}`);
            setCustomer(response.data);
        } catch (error) {
            console.error("Failed to fetch customer detail", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) return;

        try {
            await api.delete(`/customers/${customer?.id}`);
            router.push("/");
        } catch (error) {
            console.error("Failed to delete customer", error);
            alert("Gagal menghapus pelanggan");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "AKTIF":
                return "bg-green-500 hover:bg-green-600";
            case "ISOLIR":
                return "bg-red-500 hover:bg-red-600";
            case "PEMUTUSAN":
                return "bg-gray-500 hover:bg-gray-600";
            default:
                return "bg-blue-500";
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading customer details...</div>;
    }

    if (!customer) {
        return <div className="p-8 text-center">Data pelanggan tidak ditemukan.</div>;
    }

    return (
        <main className="min-h-screen bg-gray-50/50 p-8">
            <div className="mx-auto max-w-4xl space-y-8">
                <Button variant="outline" onClick={() => router.push("/")} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dashboard
                </Button>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">{customer.name}</CardTitle>
                                <CardDescription>ID Pelanggan: #{customer.id}</CardDescription>
                            </div>
                            <Badge className={`text-sm px-4 py-1 ${getStatusColor(customer.status)}`}>
                                {customer.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Paket Internet</h3>
                                <p className="text-lg font-semibold">{customer.package || "-"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Lokasi</h3>
                                <p className="text-lg">{customer.location || "-"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Tanggal Bergabung</h3>
                                <p className="text-lg">
                                    {new Date(customer.createdAt).toLocaleDateString("id-ID", {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <Separator />


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">PPPoE Username</h3>
                                <p className="font-mono text-lg">{customer.pppoeUsername || "-"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">PPPoE Password</h3>
                                <p className="font-mono text-lg">{customer.pppoePassword || "-"}</p>
                            </div>
                        </div>


                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Lokasi Koordinat Pelanggan</h3>
                            <div className="h-[400px] w-full rounded-md border overflow-hidden">
                                {customer.latitude && customer.longitude ? (
                                    <MapView
                                        latitude={Number(customer.latitude)}
                                        longitude={Number(customer.longitude)}
                                        popupText={customer.name}
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        Data koordinat belum tersedia
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1 font-mono">
                                Lat: {customer.latitude || "-"}, Long: {customer.longitude || "-"}
                            </p>
                        </div>

                        <Separator />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus Pelanggan
                            </Button>
                            <UpdateCustomerDialog customer={customer} onSuccess={setCustomer} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
