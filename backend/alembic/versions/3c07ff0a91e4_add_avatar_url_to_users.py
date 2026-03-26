"""add avatar_url to users

Revision ID: 3c07ff0a91e4
Revises: 20260325_0001
Create Date: 2026-03-25 13:43:34.140319
"""

from alembic import op
import sqlalchemy as sa


revision = "3c07ff0a91e4"
down_revision = "20260325_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("avatar_url", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "avatar_url")