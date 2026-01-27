export interface BackendErrorResponse {
  error?: string;
  message?: string;
  code?: string;
  details?: any;
}

export class ErrorService extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errorCode?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = "ErrorService";
  }
}

export class BackendErrorService {
  /**
   * Handles HTTP error responses from the backend
   * @param response - The HTTP Response object
   * @returns Promise that rejects with a ErrorService
   */
  static async handleErrorResponse(response: Response): Promise<never> {
    const statusCode = response.status;
    const text = await response.text().catch(() => "");

    // Try to parse JSON error response
    let errorData: BackendErrorResponse | null = null;
    try {
      if (text) {
        errorData = JSON.parse(text);
      }
    } catch (parseError) {
      // If parsing fails, errorData remains null
    }

    // Extract error message from various possible formats
    const errorMessage = this.extractErrorMessage(errorData, statusCode, text);

    // Extract error code if available
    const errorCode = errorData?.code;

    // Create and throw ErrorService
    throw new ErrorService(errorMessage, statusCode, errorCode, errorData?.details);
  }

  /**
   * Extracts a user-friendly error message from the error response
   */
  private static extractErrorMessage(
    errorData: BackendErrorResponse | null,
    statusCode: number,
    fallbackText: string
  ): string {
    // Priority 1: Use error field from JSON
    if (errorData?.error && typeof errorData.error === "string") {
      return errorData.error;
    }

    // Priority 2: Use message field from JSON
    if (errorData?.message && typeof errorData.message === "string") {
      return errorData.message;
    }

    // Priority 3: Use status code specific messages
    const statusMessage = this.getStatusMessage(statusCode);
    if (statusMessage) {
      return statusMessage;
    }

    // Priority 4: Use fallback text or generic message
    if (fallbackText) {
      // Try to extract meaningful text from the response
      return fallbackText;
    }

    return `Request failed with status ${statusCode}`;
  }

  /**
   * Returns user-friendly messages for common HTTP status codes
   */
  private static getStatusMessage(statusCode: number): string | null {
    const statusMessages: Record<number, string> = {
      400: "Invalid request. Please check your input and try again.",
      401: "Unauthorized. Please log in and try again.",
      403: "You don't have permission to perform this action.",
      404: "The requested resource was not found.",
      409: "A conflict occurred. The resource may already exist or be in use.",
      422: "Validation failed. Please check your input.",
      429: "Too many requests. Please try again later.",
      500: "Server error. Please try again later.",
      502: "Bad gateway. The server is temporarily unavailable.",
      503: "Service unavailable. Please try again later.",
    };

    return statusMessages[statusCode] || null;
  }

  /**
   * Checks if an error is a ErrorService instance
   */
  static isBackendError(error: unknown): error is ErrorService {
    return error instanceof ErrorService;
  }

  /**
   * Gets a user-friendly error message from any error
   */
  static getErrorMessage(error: unknown): string {
    if (this.isBackendError(error)) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "An unexpected error occurred. Please try again.";
  }
}

