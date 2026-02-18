
export interface IImageRepository {
  getAll(): Promise<string[]>;
  getByFilename(filename: string): Promise<string | null>;
  create(file: File): Promise<string>;
  update(filename: string, file: File): Promise<string>;
  delete(filename: string): Promise<void>;
}
