import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column('double', { precision: 5, scale: 2 })
    price: number;

    @Column({ type: 'int', width: 11 })
    category_id: number;

    @Column({
        type: 'tinyint',
        width: 1,
    })
    in_sale: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    added_time: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    last_updated: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    removed_time: Date;
}
