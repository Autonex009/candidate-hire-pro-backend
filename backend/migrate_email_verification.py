"""
Database migration to add email verification columns
Run this script to add the missing columns to your Supabase database
"""
import asyncio
from sqlalchemy import text
from app.database import engine

# SQL statements to add missing columns
MIGRATION_SQL = """
-- Add email verification columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_otp VARCHAR(6);
ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP WITH TIME ZONE;

-- Add password reset columns  
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMP WITH TIME ZONE;

-- Mark admin users as verified
UPDATE users SET is_verified = TRUE WHERE email = 'admin@autonex.ai';
"""


async def run_migration():
    print("🔄 Running database migration...")
    
    async with engine.begin() as conn:
        # Split SQL into individual statements and execute each
        statements = [s.strip() for s in MIGRATION_SQL.split(';') if s.strip() and not s.strip().startswith('--')]
        
        for stmt in statements:
            try:
                await conn.execute(text(stmt))
                print(f"✅ {stmt[:60]}...")
            except Exception as e:
                print(f"⚠️  {stmt[:40]}... - {str(e)[:50]}")
    
    print("\n✅ Migration complete!")


if __name__ == "__main__":
    asyncio.run(run_migration())
