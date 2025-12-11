import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CustomerStatus {
    AKTIF = 'AKTIF',
    ISOLIR = 'ISOLIR',
    PEMUTUSAN = 'PEMUTUSAN',
}

@Entity({ name: 'customers' })
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ nullable: true })
    package: string;

    @Column({ name: 'pppoe_username', nullable: true })
    pppoeUsername: string;

    @Column({ name: 'pppoe_password', nullable: true })
    pppoePassword: string;

    @Column({ nullable: true })
    location: string;

    @Column({
        type: 'enum',
        enum: CustomerStatus,
        default: CustomerStatus.AKTIF,
    })
    status: CustomerStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
