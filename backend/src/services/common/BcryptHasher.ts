import bcrypt from 'bcrypt';
import { IHasher } from '../../interfaces/common/IHasher';

export class BcryptHasher implements IHasher {
  async hash(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
  }
}
