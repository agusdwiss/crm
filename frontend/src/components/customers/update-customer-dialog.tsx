"use client";

import { useEffect, useState } from "react";
import { Customer, CreateCustomerDto } from "@/types/customer";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
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
        address: "",
        package: "",
        ipAddress: "",
        location: "",
        status: "ACTIVE",
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name,
                address: customer.address || "",
                package: customer.package || "",
                ipAddress: customer.ipAddress || "",
                location: customer.location || "",
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
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Data Pelanggan</DialogTitle>
                        <DialogDescription>
                            Ubah informasi pelanggan di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nama
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Alamat
                            </Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="package" className="text-right">
                                Paket
                            </Label>
                            <Input
                                id="package"
                                value={formData.package}
                                onChange={handleChange}
                                className="col-span-3"
                                placeholder="Misal: 50 Mbps"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ipAddress" className="text-right">
                                IP Address
                            </Label>
                            <Input
                                id="ipAddress"
                                value={formData.ipAddress}
                                onChange={handleChange}
                                className="col-span-3"
                                placeholder="192.168.x.x"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right">
                                Lokasi
                            </Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Select
                                onValueChange={handleStatusChange}
                                value={formData.status}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
