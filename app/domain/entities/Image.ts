
export interface ImageUploadResponse {
  message: string;
  filename: string;
  originalName: string;
  url: string;
}

export interface ImageUpdateResponse {
  message: string;
  filename: string;
  url: string;
}

export interface ImageListResponse {
  images: string[];
}
