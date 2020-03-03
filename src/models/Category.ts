import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

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
