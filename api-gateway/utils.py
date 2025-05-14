import requests
from flask import Request, Response


def proxy_request(target_url: str, incoming_request: Request) -> Response:
    # Build proxied URL
    path = incoming_request.path
    params = incoming_request.query_string.decode()
    url = f"{target_url}{path}" + (f"?{params}" if params else "")

    # Forward headers and body
    headers = {k: v for k, v in incoming_request.headers if k != 'Host'}
    resp = requests.request(
        method=incoming_request.method,
        url=url,
        headers=headers,
        data=incoming_request.get_data(),
        cookies=incoming_request.cookies,
        allow_redirects=False,
        stream=True
    )

    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    response_headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]

    return Response(resp.content, resp.status_code, response_headers)
