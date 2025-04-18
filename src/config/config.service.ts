import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) { }

    get nodeEnv(): string {
        return this.configService.get<string>('NODE_ENV');
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    get port(): number {
        return this.configService.get<number>('PORT');
    }

    get database() {
        return {
            uri: this.configService.get<string>('MONGODB_URI'),
            dbName: this.configService.get<string>('MONGODB_DB_NAME'),
        };
    }

    get cors() {
        return {
            allowedOrigins: this.configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [],
        };
    }

    get security() {
        return {
            csrfSecret: this.configService.get<string>('CSRF_SECRET'),
            jsonLimit: this.configService.get<string>('JSON_LIMIT'),
        };
    }

    get throttling() {
        return {
            ttl: this.configService.get<number>('THROTTLE_TTL'),
            limit: this.configService.get<number>('THROTTLE_LIMIT'),
        };
    }
}