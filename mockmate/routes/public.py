from flask import Blueprint, render_template, abort

bp = Blueprint("public", __name__)

@bp.get("/")
def index():
    return render_template("pages/dashboard.html")

@bp.get("/<page>")
def serve_page(page: str):
    """Render dynamic HTML pages with Jinja2, extending base.html"""
    try:
        return render_template(f"pages/{page}.html")
    except Exception:
        abort(404)
