export interface UploadValidationOptions {
  /** Maximum allowed file size in bytes. */
  maxBytes: number;
  /** Allowed MIME types. When omitted, any type is accepted. */
  allowedTypes?: readonly string[];
}

export interface UploadValidationError {
  message: string;
  status: number;
}

export interface UploadValidationSuccess {
  file: File;
}

export type UploadValidationResult = UploadValidationSuccess | UploadValidationError;

export function isUploadValidationError(
  result: UploadValidationResult
): result is UploadValidationError {
  return "status" in result;
}

/** 10 MB — safe upper bound for images decoded in-memory by sharp/jsQR. */
export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;

/** 32 MB — the VirusTotal public file-scan API upload limit. */
export const MAX_MALWARE_UPLOAD_BYTES = 32 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
] as const;

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`;
}

/**
 * Validates a value pulled from multipart form data as an uploaded file,
 * enforcing that it is a real File within the configured size and MIME-type
 * bounds. Returns either the validated file or a structured error suitable for
 * a JSON API response.
 */
export function validateUploadedFile(
  value: FormDataEntryValue | null,
  fieldName: string,
  options: UploadValidationOptions
): UploadValidationResult {
  if (!(value instanceof File) || value.size === 0) {
    return { message: `Please upload a valid ${fieldName}.`, status: 400 };
  }

  if (value.size > options.maxBytes) {
    return {
      message: `File is too large. Maximum allowed size is ${formatBytes(options.maxBytes)}.`,
      status: 413,
    };
  }

  if (options.allowedTypes && options.allowedTypes.length > 0) {
    if (!options.allowedTypes.includes(value.type)) {
      return {
        message: `Unsupported file type "${value.type || "unknown"}". Allowed types: ${options.allowedTypes.join(", ")}.`,
        status: 415,
      };
    }
  }

  return { file: value };
}
