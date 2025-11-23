import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, 
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}


    async signupLocal(dto: AuthDto): Promise<Tokens> {

        const existing = await this.prisma.user.findUnique({
            where: {
                    email: dto.email,
            }
        });

        if (existing) throw new BadRequestException("User with this email already exists");

        const hash = await this.hashData(dto.password)

        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
            },
        });

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRt(newUser.id, tokens.refresh_token);

        return tokens;
    }

    async signinLocal(dto: AuthDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        })

        if (!user) throw new ForbiddenException("Access Denied")

        const passwordMatches = await bcrypt.compare(dto.password, user.hash)

        if(!passwordMatches) throw new ForbiddenException("Access Denied")
        
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRt(user.id, tokens.refresh_token);
        return tokens;
    }

    async logout(userId: number) {
        const result = await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: { not: null },
            },
            data: { hashedRt: null },
        });

        
        if (result.count === 0) {
            throw new ForbiddenException("User already logged out");
        }

        return { message: "Logged out successfully" };
    }

    
    async refreshToken(userId: number, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.hashedRt)
            throw new ForbiddenException("Access Denied");

        const rtMatches = await bcrypt.compare(rt, user.hashedRt);
        if (!rtMatches)
            throw new ForbiddenException("Access Denied");

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRt(user.id, tokens.refresh_token);

        return tokens;
    }


    async updateRt(userId: number, rt: string) {
        const hash = await this.hashData(rt);
        await this.prisma.user.update({
            where:{
                id: userId,
            },
            data:{
                hashedRt: hash,
            }
        })
    }

    hashData(data: string){
        return bcrypt.hash(data, 10);
    }

    async getTokens(userId: number, email: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
        this.jwtService.signAsync({
            sub: userId,
            email: email
        }, {
            secret: this.configService.get<string>('AT_SECRET')!,
            expiresIn: 60 * 15,
        }),
        this.jwtService.signAsync({
            sub: userId,
            email: email
        }, {
            secret: this.configService.get<string>('RT_SECRET')!,
            expiresIn: 60 * 60 * 24 * 7,
        }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        }
    }

}
