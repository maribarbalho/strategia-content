CREATE TABLE catalog_assets (
 id TEXT PRIMARY KEY,
 owner_id TEXT NOT NULL,
 storage_key TEXT NOT NULL,
 content_type TEXT NOT NULL,
 bytes INTEGER NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX idx_catalog_assets_owner ON catalog_assets(owner_id);
