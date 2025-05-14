import time
import uuid
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, request, Response, g
from flask_cors import CORS
from pythonjsonlogger import jsonlogger
from config import config
from utils import proxy_request
from flask_talisman import Talisman

# Initialize Flask app
app = Flask(__name__)

Talisman(
    app,
    content_security_policy=None,  # APIs usually don't need CSP
    force_https=False, # force_https=True,
    frame_options="DENY"
)

# CORS configuration
CORS(
    app,
    resources={
        r"/api/v2/*": {
            "origins": config.cors.get("origins", []),
            "methods": ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
            "allow_headers": ["Authorization","Content-Type"],
            "supports_credentials": True
        }
    },
    automatic_options=False
)

# Logging setup
handler = RotatingFileHandler(
    filename=config.logging['file'],
    maxBytes=10 * 1024 * 1024,
    backupCount=5
)
handler.setLevel(config.logging.get('level', 'INFO'))
formatter = jsonlogger.JsonFormatter(
    fmt='%(levelname)s %(asctime)s %(message)s'
)
handler.setFormatter(formatter)
app.logger.addHandler(handler)
app.logger.setLevel(config.logging.get('level', 'INFO'))

# Request tracing and timing
@app.before_request
def start_request():
    g.trace_id = str(uuid.uuid4())
    g.start_time = time.time()
    # Short-circuit CORS preflights
    if request.method == 'OPTIONS':
        return Response(status=200)

@app.after_request
def after_request(response):
    start = getattr(g, 'start_time', None)
    if start is None:
        # no trace_id/start_time — probably a CORS preflight or early abort
        return response

    duration = time.time() - start
    log_data = {
        'level': 'info',
        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%S%z'),
        'trace_id': g.trace_id,
        'method': request.method,
        'path': request.path,
        'status': response.status_code,
        'duration': duration,
        'client_ip': request.remote_addr or '',
        'user_id': getattr(g, 'user_id', '')
    }
    app.logger.info("request", extra=log_data)
    return response

# Health check
@app.route('/health')
def health():
    return {'status': 'ok'}

# Auth proxy
@app.route('/api/v2/auth/<path:subpath>', methods=['GET','POST','PUT','PATCH','DELETE','OPTIONS'])
def auth_proxy(subpath):
    try:
        return proxy_request(config.services['auth'], request)
    except Exception as e:
        app.logger.error(
            'proxy error',
            extra={
                'trace_id': g.trace_id,
                'target': config.services['auth'],
                'error': str(e)
            }
        )
        return Response('Upstream error', status=502)

# Backend proxy
@app.route('/api/v2/bd/<path:subpath>', methods=['GET','POST','PUT','PATCH','DELETE','OPTIONS'])
def backend_proxy(subpath):
    try:
        return proxy_request(config.services['backend'], request)
    except Exception as e:
        app.logger.error(
            'proxy error',
            extra={
                'trace_id': g.trace_id,
                'target': config.services['backend'],
                'error': str(e)
            }
        )
        return Response('Upstream error', status=502)

if __name__ == '__main__':
    app.run(host=config.server['host'], port=config.server['port'])
