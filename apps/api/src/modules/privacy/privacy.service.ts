import { Injectable } from '@nestjs/common';

@Injectable()
export class PrivacyService {
  public export(userKey: string) {
    return { userKey, postgres: {}, redis: {}, clickhouse: {} };
  }

  public erase(userKey: string) {
    return { userKey, postgresAnonymized: true, redisAnonymized: true, clickhouseAnonymized: true };
  }
}
