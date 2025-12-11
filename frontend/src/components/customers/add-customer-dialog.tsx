"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { CreateCustomerDto } from "@/types/customer";
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

interface AddCustomerDialogProps {
    onSuccess: () => void;
}

export default function AddCustomerDialog({ onSuccess }: AddCustomerDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateCustomerDto>({
        name: "",
        package: "",
        pppoeUsername: "",
        pppoePassword: "",
        location: "",
        latitude: -6.200000,
        longitude: 106.816666,
        status: "AKTIF",
    });

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
            await api.post("/customers", formData);
            setOpen(false);
            setFormData({
                name: "",
                package: "",
                pppoeUsername: "",
                pppoePassword: "",
                location: "",
                latitude: -7.452459,
                longitude: 110.440814,
                status: "AKTIF",
            });
            onSuccess();
        } catch (error) {
            console.error("Failed to create customer", error);
            alert("Gagal menyimpan data pelanggan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Tambah Pelanggan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
                        <DialogDescription>
                            Masukkan detail informasi pelanggan di sini. Klik simpan jika sudah selesai.
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
                                    defaultValue={formData.status}
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
                                Klik pada peta untuk menentukan lokasi pelanggan.<br />
                                Lat: {formData.latitude?.toFixed(6)}, Long: {formData.longitude?.toFixed(6)}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Data"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}
