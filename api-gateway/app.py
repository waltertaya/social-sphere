from flask import Flask, request
from flask_cors import CORS
from config import config
from utils import proxy_request

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/v2/*": {
        "origins": config.cors.get("origins", []),
        "methods": ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
        "allow_headers": ["Authorization","Content-Type"],
        "supports_credentials": True
    }}
)

# Health check: simple route for debugging
@app.route('/health')
def health():
    return {'status': 'ok'}

# Public proxy (authentication service)
@app.route('/api/v2/auth/<path:subpath>', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'])
def auth_proxy(subpath):
    return proxy_request(config.services['auth'], request)

# Protected proxy (backend service)
@app.route('/api/v2/bd/<path:subpath>', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'])
def backend_proxy(subpath):
    return proxy_request(config.services['backend'], request)

if __name__ == '__main__':
    app.run(host=config.server['host'], port=config.server['port'])
