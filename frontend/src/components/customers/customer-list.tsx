"use client";

import { useEffect, useState } from "react";
import { Customer } from "@/types/customer";
import api from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import AddCustomerDialog from "./add-customer-dialog";

export default function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await api.get<Customer[]>("/customers");
            setCustomers(response.data);
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-500 hover:bg-green-600";
            case "SUSPENDED":
                return "bg-red-500 hover:bg-red-600";
            case "INACTIVE":
                return "bg-gray-500 hover:bg-gray-600";
            default:
                return "bg-blue-500";
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Daftar Pelanggan</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={fetchCustomers}>
                        <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <AddCustomerDialog onSuccess={fetchCustomers} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Paket</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Lokasi</TableHead>
                                <TableHead className="text-right">Bergabung</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.length === 0 && !loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Belum ada data pelanggan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow
                                        key={customer.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => window.location.href = `/customers/${customer.id}`}
                                    >
                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                        <TableCell>{customer.package || "-"}</TableCell>
                                        <TableCell>{customer.ipAddress || "-"}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(customer.status)}>
                                                {customer.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{customer.location || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            {new Date(customer.createdAt).toLocaleDateString("id-ID")}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
