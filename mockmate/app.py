"""Deprecated compatibility stub for package.

Use `from Mockmate.mockmate import create_app` instead of this module.
This file intentionally kept minimal to avoid duplicate app state.
"""

from . import create_app

__all__ = ["create_app"]

# Minimal compatibility export only.
