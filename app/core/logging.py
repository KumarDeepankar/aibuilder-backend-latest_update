import logging
import logging.config
from pathlib import Path
from app.core.config import settings

def setup_logging():
    """Configure logging for the application"""
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "verbose": {
                "format": "%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s"
            },
            "simple": {
                "format": "%(levelname)s %(message)s"
            },
            "standard": {
                "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S"
            }
        },
        "handlers": {
            "console": {
                "level": settings.LOG_LEVEL,
                "class": "logging.StreamHandler",
                "formatter": "standard",
                "stream": "ext://sys.stdout"
            },
            "file": {
                "level": "INFO",
                "class": "logging.handlers.RotatingFileHandler",
                "filename": log_dir / "app.log",
                "maxBytes": 1024 * 1024 * 5,  # 5MB
                "backupCount": 5,
                "formatter": "standard",
                "encoding": "utf8"
            },
            "error_file": {
                "level": "ERROR",
                "class": "logging.handlers.RotatingFileHandler",
                "filename": log_dir / "errors.log",
                "maxBytes": 1024 * 1024 * 5,  # 5MB
                "backupCount": 5,
                "formatter": "verbose",
                "encoding": "utf8"
            }
        },
        "loggers": {
            "app": {
                "handlers": ["console", "file", "error_file"],
                "level": settings.LOG_LEVEL,
                "propagate": False
            },
            "uvicorn": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False
            },
            "sqlalchemy": {
                "handlers": ["file"],
                "level": "WARNING",
                "propagate": False
            }
        },
        "root": {
            "handlers": ["console"],
            "level": "WARNING"
        }
    }

    logging.config.dictConfig(logging_config)
    
    # Special handling for Uvicorn access logs
    uvicorn_access = logging.getLogger("uvicorn.access")
    uvicorn_access.handlers = []
    uvicorn_access.propagate = True