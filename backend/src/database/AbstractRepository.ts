import { v4 as uuidv4 } from 'uuid';

class AbstractRepository {
  protected generateUUID(): string {
    return uuidv4();
  }
}

export default AbstractRepository;
