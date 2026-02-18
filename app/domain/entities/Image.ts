export interface Image {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  path: string;
}

export class ImageEntity {
  constructor(
    public readonly filename: string,
    public readonly originalName: string,
    public readonly mimeType: string,
    public readonly size: number,
    public readonly uploadedAt: string,
    public readonly path: string,
  ) {}

  static fromData(data: Image): ImageEntity {
    return new ImageEntity(
      data.filename,
      data.originalName,
      data.mimeType,
      data.size,
      data.uploadedAt,
      data.path,
    );
  }

  toData(): Image {
    return {
      filename: this.filename,
      originalName: this.originalName,
      mimeType: this.mimeType,
      size: this.size,
      uploadedAt: this.uploadedAt,
      path: this.path,
    };
  }

  isImageFile(): boolean {
    return this.mimeType.startsWith('image/');
  }

  getFileExtension(): string {
    return this.filename.split('.').pop() || '';
  }

  getDisplaySize(): string {
    const bytes = this.size;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}
