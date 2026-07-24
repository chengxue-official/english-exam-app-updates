export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "*"
      }
    });
  }

  const url = new URL(context.request.url);
  const pathParts = url.pathname.split('/');
  // pathParts[0] = ""
  // pathParts[1] = "ocr-storage"
  // pathParts[2] = "paddleocr-store-6.bj.bcebos.com"
  const host = pathParts[2];
  const remainingPath = pathParts.slice(3).join('/');
  
  const targetUrl = `https://${host}/${remainingPath}${url.search}`;
  
  const headers = new Headers(context.request.headers);
  headers.delete("Origin");
  headers.delete("Referer");
  
  const response = await fetch(targetUrl, {
    method: context.request.method,
    headers: headers,
    body: context.request.body
  });
  
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  return newResponse;
}