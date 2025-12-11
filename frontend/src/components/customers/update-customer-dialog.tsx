"use client";

import { useEffect, useState } from "react";
import { Customer, CreateCustomerDto } from "@/types/customer";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/map-picker"), { ssr: false });

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";

interface UpdateCustomerDialogProps {
    customer: Customer;
    onSuccess: (updatedCustomer: Customer) => void;
}

export default function UpdateCustomerDialog({ customer, onSuccess }: UpdateCustomerDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateCustomerDto>({
        name: "",
        package: "",
        pppoeUsername: "",
        pppoePassword: "",
        location: "",
        latitude: -7.452459,
        longitude: 110.440814,
        status: "AKTIF",
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name,
                package: customer.package || "",
                pppoeUsername: customer.pppoeUsername || "",
                pppoePassword: customer.pppoePassword || "",
                location: customer.location || "",
                latitude: customer.latitude ? Number(customer.latitude) : -7.452459,
                longitude: customer.longitude ? Number(customer.longitude) : 110.440814,
                status: customer.status,
            });
        }
    }, [customer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleStatusChange = (value: string) => {
        setFormData({ ...formData, status: value as any });
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData({ ...formData, latitude: lat, longitude: lng });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.patch<Customer>(`/customers/${customer.id}`, formData);
            setOpen(false);
            onSuccess(response.data);
        } catch (error) {
            console.error("Failed to update customer", error);
            alert("Gagal mengupdate data pelanggan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Edit className="mr-2 h-4 w-4" /> Edit Informasi
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Data Pelanggan</DialogTitle>
                        <DialogDescription>
                            Ubah informasi pelanggan di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4 md:grid-cols-2">
                        {/* Kolom Kiri - Informasi Dasar */}
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="package">Paket</Label>
                                <Input
                                    id="package"
                                    value={formData.package}
                                    onChange={handleChange}
                                    placeholder="Misal: 50 Mbps"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pppoeUsername">PPPoE User</Label>
                                <Input
                                    id="pppoeUsername"
                                    value={formData.pppoeUsername}
                                    onChange={handleChange}
                                    placeholder="username_pppoe"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pppoePassword">PPPoE Pass</Label>
                                <Input
                                    id="pppoePassword"
                                    value={formData.pppoePassword}
                                    onChange={handleChange}
                                    placeholder="password_pppoe"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Lokasi (Teks)</Label>
                                <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    onValueChange={handleStatusChange}
                                    value={formData.status}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AKTIF">AKTIF</SelectItem>
                                        <SelectItem value="ISOLIR">ISOLIR</SelectItem>
                                        <SelectItem value="PEMUTUSAN">PEMUTUSAN</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Kolom Kanan - Peta */}
                        <div className="space-y-2">
                            <Label>Titik Lokasi</Label>
                            <div className="rounded-md border overflow-hidden">
                                <MapPicker
                                    latitude={formData.latitude}
                                    longitude={formData.longitude}
                                    onLocationSelect={handleLocationSelect}
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                Klik pada peta untuk mengubah lokasi pelanggan.<br />
                                Lat: {formData.latitude?.toFixed(6)}, Long: {formData.longitude?.toFixed(6)}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}
