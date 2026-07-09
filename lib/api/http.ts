import { NextResponse, type NextRequest } from "next/server";

/**
 * Logs an error and returns a normalized JSON error response. Centralizes the
 * `error instanceof Error ? error.message : fallback` pattern repeated across
 * every API route.
 */
export function jsonError(error: unknown, fallback: string, status = 500): NextResponse {
  console.error(fallback, error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : fallback },
    { status }
  );
}

/**
 * Reads a single uploaded file from a multipart form request. Returns the file
 * or `null` when the field is missing or not a file, letting callers respond
 * with their own 400 message.
 */
export async function getUploadedFile(request: NextRequest, field = "file"): Promise<File | null> {
  const formData = await request.formData();
  const file = formData.get(field);
  return file instanceof File ? file : null;
}
