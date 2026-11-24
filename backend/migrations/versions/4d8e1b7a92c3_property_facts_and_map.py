"""Add property facts and map coordinates.

Revision ID: 4d8e1b7a92c3
Revises: 0c122aa88d05
Create Date: 2026-11-24 09:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '4d8e1b7a92c3'
down_revision: Union[str, Sequence[str], None] = '0c122aa88d05'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('properties', sa.Column('land_area_sqm', sa.Numeric(precision=12, scale=2), nullable=True))
    op.add_column('properties', sa.Column('total_floors', sa.Integer(), nullable=True))
    op.add_column('properties', sa.Column('total_units', sa.Integer(), nullable=True))
    op.add_column('properties', sa.Column('parking_slots', sa.Integer(), nullable=True))
    op.add_column('properties', sa.Column('latitude', sa.Double(), nullable=True))
    op.add_column('properties', sa.Column('longitude', sa.Double(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    for column in ('longitude', 'latitude', 'parking_slots', 'total_units', 'total_floors', 'land_area_sqm'):
        op.drop_column('properties', column)
