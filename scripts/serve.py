"""Quiet localhost server for static browser checks."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

parser = argparse.ArgumentParser()
parser.add_argument('--directory', default='public')
parser.add_argument('--port', type=int, default=4173)
args = parser.parse_args()
ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=args.directory)).serve_forever()
