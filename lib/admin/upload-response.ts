export async function readAdminUploadError(
  res: Response,
  fallback = "Upload failed.",
): Promise<string> {
  if (res.status === 413) {
    return "Upload too large for the server. Refresh the page and try again — large files are compressed in your browser before upload.";
  }

  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? fallback;
  } catch {
    if (res.status >= 500) return "Server error during upload. Try a smaller file or try again.";
    return fallback;
  }
}
