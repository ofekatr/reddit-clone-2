import { IsEmail, Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm";
import bcrypt from 'bcrypt';
import { classToPlain, Exclude } from 'class-transformer';

@Entity("users")
export class User extends BaseEntity {

    constructor(user: Partial<User>) {
        super();
        Object.assign(this, user);
    }

    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Index()
    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Index()
    @Column({ unique: true })
    @Length(3, 255, { message: 'Username must be at least 3 characters long.'})
    username: string;

    @Column()
    @Exclude()
    @Length(6, 255,{ message: 'Password must be at least 6 characters long.'})
    password: string;

    @Column()
    @CreateDateColumn()
    createAt: Date;

    @Column()
    @UpdateDateColumn()
    updateAt: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6);
    }

    toJason() {
        return classToPlain(this);
    }
}
