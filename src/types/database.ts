export type DatabaseProvider = 'json' | 'invalid';

export interface DatabaseOptions {
  provider: DatabaseProvider;
  path: string
}