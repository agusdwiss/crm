export type CustomerStatus = 'AKTIF' | 'ISOLIR' | 'PEMUTUSAN';

export interface Customer {
    id: number;
    name: string;
    address?: string;
    package?: string;
    ipAddress?: string;
    location?: string;
    status: CustomerStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomerDto {
    name: string;
    address?: string;
    package?: string;
    ipAddress?: string;
    location?: string;
    status?: CustomerStatus;
}
