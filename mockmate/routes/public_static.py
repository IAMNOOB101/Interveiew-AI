
import os
import re
from flask import Blueprint, send_from_directory, current_app, abort, redirect, request, url_for

bp = Blueprint('public_static_bp', __name__)


_VALID_PAGE = re.compile(r"^[a-zA-Z0-9_\-]+$")


def _pages_dir():
    # current_app.root_path -> Mockmate/mockmate; pages live at Mockmate/views/templates/pages
    return os.path.abspath(os.path.join(current_app.root_path, '..', 'views', 'templates', 'pages'))


@bp.get('/')
def index():
    # Serve dashboard at root
    return redirect('/dashboard')


@bp.get('/<page>')
def serve_page(page: str):
    """Serve a static HTML page located at views/templates/pages/<page>.html.

    Examples: /dashboard -> dashboard.html, /interview1 -> interview1.html
    """
    # If caller requested a path containing a dot, treat it as a potential legacy
    # .html request (e.g. '/dashboard.html'). Redirect to the canonical route.
    if '.' in page:
        # Only handle .html specifically; otherwise it's invalid
        if not page.lower().endswith('.html'):
            abort(404)

        name = os.path.splitext(os.path.basename(page))[0]
        if not _VALID_PAGE.match(name):
            abort(404)

        base = _pages_dir()
        filename = f"{name}.html"
        if not os.path.exists(os.path.join(base, filename)):
            abort(404)

        # preserve query string
        qs = request.query_string.decode('utf-8')
        target = '/' + name
        if qs:
            target = f"{target}?{qs}"
        return redirect(target, code=301)

    if not _VALID_PAGE.match(page):
        abort(404)

    # Redirect to dynamic route for Jinja2 rendering
    return redirect(f'/{page}', code=302)


@bp.get('/<path:legacy>')
def legacy_redirect(legacy: str):
    """Redirect legacy requests like '/dashboard.html' or '/pages/dashboard.html' to '/dashboard'.

    If the path ends with .html and the corresponding canonical route exists (pages/<name>.html),
    redirect permanently to the canonical route without the extension. This helps clients
    that still request .html links or older bookmarks.
    """
    # Only handle .html legacy requests here; leave other paths to 404 or other view functions
    if not legacy.lower().endswith('.html'):
        # Not a legacy HTML request — let Flask try other rules (return 404)
        abort(404)

    # Strip extension and any leading directories, keep only the last name
    name = os.path.splitext(os.path.basename(legacy))[0]
    if not _VALID_PAGE.match(name):
        abort(404)

    # Ensure the target page exists
    base = _pages_dir()
    filename = f"{name}.html"
    if not os.path.exists(os.path.join(base, filename)):
        abort(404)

    # Build canonical URL and redirect
    target = '/' + name
    # If the request had query string, preserve it
    qs = request.query_string.decode('utf-8')
    if qs:
        target = f"{target}?{qs}"
    return redirect(target, code=301)

