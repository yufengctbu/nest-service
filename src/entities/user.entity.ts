import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { TimeEntityBase } from './lib/time-entity-base';

@Entity()
export class User extends TimeEntityBase {
    @PrimaryGeneratedColumn('increment', { comment: 'user id' })
    id: number;

    @Column('varchar', { unique: true, length: 30, nullable: false, comment: 'username' })
    username: string;

    @Column('varchar', { nullable: false, length: 80, comment: 'password' })
    password: string;

    @Column('varchar', { nullable: false, length: 100, comment: 'email' })
    email: string;
}
