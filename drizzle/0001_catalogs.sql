CREATE TABLE catalogos (
 id TEXT PRIMARY KEY,
 owner_id TEXT NOT NULL,
 owner_name TEXT NOT NULL,
 draft TEXT NOT NULL,
 published TEXT,
 status TEXT NOT NULL DEFAULT 'revisao' CHECK(status IN ('revisao','ajustes','aprovado')),
 revision INTEGER NOT NULL DEFAULT 1,
 published_revision INTEGER,
 feedback TEXT NOT NULL DEFAULT '',
 origem_dado TEXT NOT NULL DEFAULT 'real' CHECK(origem_dado IN ('real','ficticio')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX idx_catalogos_owner ON catalogos(owner_id);
