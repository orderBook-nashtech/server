import { Order } from "src/orders/entities/order.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Shipper {
    @PrimaryGeneratedColumn('uuid')
    shipperId: string;

    @Column()
    shipperName: string;

    @Column()
    phone: string;

    @OneToMany(() => Order, (order) => order.shipper)
    orders: Order[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
