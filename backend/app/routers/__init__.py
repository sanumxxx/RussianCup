from .auth import router as auth_router
from .ratings import router as ratings_router
from .profiles import router as profiles_router
from .events import router as events_router

__all__ = ["auth_router", "ratings_router", "profiles_router", "events_router"]