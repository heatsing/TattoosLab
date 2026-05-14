import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User, UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import type { StringValue } from "ms";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    authProvider: User["authProvider"];
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
  };
  tokens: TokenPair;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("This email is already in use.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email,
        name: dto.name?.trim() || null,
        authProvider: "LOCAL",
        passwordHash,
      },
    });

    return this.buildAuthResponse(user, true);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user?.passwordHash || user.authProvider !== "LOCAL") {
      throw new UnauthorizedException("Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return this.buildAuthResponse(user, true);
  }

  async refresh(dto: RefreshTokenDto): Promise<{ tokens: TokenPair }> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(dto.refreshToken, {
        secret: this.configService.getOrThrow<string>("API_JWT_REFRESH_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Refresh token is invalid.");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException("Refresh token is invalid.");
    }

    const refreshTokenMatches = await bcrypt.compare(
      dto.refreshToken,
      user.refreshTokenHash
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException("Refresh token is invalid.");
    }

    const tokens = await this.signTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { tokens };
  }

  async logout(userId: string): Promise<{ success: true }> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash: null,
      },
    });

    return { success: true };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException("User not found.");
    }

    return {
      user: this.toSafeUser(user),
    };
  }

  private async buildAuthResponse(
    user: User,
    updateLastLogin: boolean
  ): Promise<AuthResponse> {
    const tokens = await this.signTokens(user);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    const updatedUser = updateLastLogin
      ? await this.prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })
      : user;

    return {
      user: this.toSafeUser(updatedUser),
      tokens,
    };
  }

  private toSafeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  private async signTokens(user: User): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("API_JWT_ACCESS_SECRET"),
      expiresIn: this.getJwtExpiresIn("API_JWT_ACCESS_TTL", "15m"),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("API_JWT_REFRESH_SECRET"),
      expiresIn: this.getJwtExpiresIn("API_JWT_REFRESH_TTL", "30d"),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async storeRefreshToken(userId: string, refreshToken: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash,
      },
    });
  }

  private getJwtExpiresIn(
    key: "API_JWT_ACCESS_TTL" | "API_JWT_REFRESH_TTL",
    fallback: StringValue
  ): number | StringValue {
    const configuredValue = this.configService.get<string>(key, fallback);

    if (/^\d+$/.test(configuredValue)) {
      return Number(configuredValue);
    }

    return configuredValue as StringValue;
  }
}