"""Deprecated compatibility stub.

This file previously contained a large legacy app object. The new package
`Mockmate.mockmate` provides `create_app()` and is the canonical application
entrypoint. This module intentionally keeps a minimal compatibility layer so
old imports do not break while removing the legacy inline server code.
"""

from Mockmate.mockmate import create_app

__all__ = ["create_app"]

# Note: keep the file minimal. Use `from Mockmate.mockmate import create_app`.

# File intentionally minimal — see Mockmate.mockmate.create_app
