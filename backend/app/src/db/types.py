
from sqlalchemy import JSON
from sqlalchemy.dialects.postgresql import JSONB

# JSONB on Postgres (indexable, fast), plain JSON elsewhere (lets tests run on SQLite).
JsonB = JSON().with_variant(JSONB(), "postgresql")