import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> | { slug?: string[] } }
) {
  // Support both Next.js 14 (sync) and Next.js 15 (async) params
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams.slug || [];
  
  const targetHost = "https://elshami.vercel.app";
  const path = slug.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const targetUrl = `${targetHost}/${path}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": request.headers.get("user-agent") || "Mozilla/5.0",
        "Accept": request.headers.get("accept") || "*/*",
      },
      cache: "no-store",
    });

    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    let body: any;

    // Intelligent Path Rewriting for HTML and CSS
    if (contentType.includes("text/html") || contentType.includes("text/css") || contentType.includes("application/javascript")) {
        let text = await response.text();
        const originUrl = request.nextUrl.origin;
        const proxyPrefix = `${originUrl}/api/proxy/`;

        // 1. Replace absolute paths (/...) with proxied paths (/api/proxy/...)
        // We target src="/, href="/, and url("/ but avoid absolute http/https links
        text = text.replace(/(src|href|url)\s*=\s*(['"])\//gi, `$1=$2${proxyPrefix}`);
        
        // 2. Handle CSS url() specifically
        text = text.replace(/url\((['"]?)\//gi, `url($1${proxyPrefix}`);

        // 3. Inject <base> only for HTML
        if (contentType.includes("text/html")) {
            const headMatch = text.match(/<head[^>]*>/i);
            if (headMatch && headMatch.index !== undefined) {
              const insertPos = headMatch.index + headMatch[0].length;
              const baseTag = `\n    <base href="${proxyPrefix}">`;
              text = text.slice(0, insertPos) + baseTag + text.slice(insertPos);
            }
        }
        body = text;
    } else {
        body = await response.blob();
    }

    const headers = new Headers(response.headers);
    
    // STRIP SECURITY HEADERS TO ALLOW EMBEDDING
    headers.delete("x-frame-options");
    headers.delete("content-security-policy");
    headers.delete("content-security-policy-report-only");
    headers.delete("report-to");
    headers.delete("x-content-type-options");
    
    // IMPORTANT: Remove encoding headers because 'fetch' has already decompressed the body
    headers.delete("content-encoding");
    headers.delete("content-length");
    
    // ALLOW CORS
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    
    // Set content type specifically if we modified the body
    if (contentType.includes("text/html")) {
        headers.set("Content-Type", "text/html; charset=utf-8");
    }

    return new NextResponse(body, {
        status: response.status,
        headers: headers,
    });
  } catch (error: any) {
    return new NextResponse(`Transparent Proxy failed: ${error.message}`, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: any }) {
    return GET(request, { params });
}

export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    });
}
