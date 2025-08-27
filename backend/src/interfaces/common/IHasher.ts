export interface IHasher {
  hash(data: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}
