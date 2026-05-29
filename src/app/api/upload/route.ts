import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// This route issues signed upload tokens and receives completion webhooks.
// The actual file bytes go directly from the browser to Vercel Blob —
// the serverless function never sees the payload, so there's no 4.5MB limit.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Called when the browser requests an upload token — verify auth here.
        const session = await getServerSession(authOptions);
        if (!session) throw new Error("Unauthorized");
        return {
          allowedContentTypes: ["image/*", "audio/*"],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Webhook from Vercel Blob after the direct upload finishes.
        console.log("blob upload completed:", blob.url);
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
