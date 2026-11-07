CREATE TABLE "servicos" (
"servico_id" TEXT PRIMARY KEY,
"nome_servico" TEXT,
"descricao" TEXT,
"categoria" TEXT,
"preco_base" REAL,
"prazo_estimado_dias" REAL,
"inclui_implantacao" REAL,
"status" TEXT,
"origem_dado" TEXT NOT NULL DEFAULT 'real' CHECK(origem_dado IN ('real','ficticio')),
origem_planilha TEXT,
auth_user_id TEXT,
criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX "idx_servicos_origem" ON "servicos" (origem_dado);
--> statement-breakpoint
CREATE TABLE "clientes" (
"cliente_id" TEXT PRIMARY KEY,
"segmento" TEXT,
"cidade" TEXT,
"uf" TEXT,
"porte" TEXT,
"canal_aquisicao" TEXT,
"data_cadastro" TEXT,
"status_cliente" TEXT,
"compras_total" REAL,
"receita_total" REAL,
"ticket_medio" REAL,
"ultima_compra" TEXT,
"recencia_dias" REAL,
"objecao_principal" TEXT,
"aceita_contato_marketing" REAL,
"origem_dado" TEXT NOT NULL DEFAULT 'real' CHECK(origem_dado IN ('real','ficticio')),
origem_planilha TEXT,
auth_user_id TEXT,
criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX "idx_clientes_origem" ON "clientes" (origem_dado);
--> statement-breakpoint
CREATE UNIQUE INDEX idx_clientes_auth ON clientes(auth_user_id) WHERE auth_user_id IS NOT NULL;
--> statement-breakpoint
CREATE TABLE "leads_funil" (
"lead_id" TEXT PRIMARY KEY,
"data_entrada" TEXT,
"segmento" TEXT,
"cidade" TEXT,
"canal_entrada" TEXT,
"campanha_id" TEXT,
"status_funil" TEXT,
"data_primeira_resposta" REAL,
"tempo_primeira_resposta_min" REAL,
"data_proposta" TEXT,
"valor_proposta" REAL,
"data_fechamento" TEXT,
"cliente_id" TEXT,
"motivo_perda" TEXT,
"origem_dado" TEXT NOT NULL DEFAULT 'real' CHECK(origem_dado IN ('real','ficticio')),
origem_planilha TEXT,
auth_user_id TEXT,
criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX "idx_leads_funil_origem" ON "leads_funil" (origem_dado);
--> statement-breakpoint
CREATE TABLE "pedidos" (
"pedido_id" TEXT PRIMARY KEY,
"cliente_id" TEXT,
"servico_id" TEXT,
"data_pedido" TEXT,
"data_entrega_prevista" TEXT,
"data_entrega_real" TEXT,
"status_pedido" TEXT,
"valor_bruto" REAL,
"desconto" REAL,
"valor_liquido" REAL,
"custo_variavel" REAL,
"margem_contribuicao" REAL,
"margem_percentual" REAL,
"forma_pagamento" TEXT,
"canal_venda" TEXT,
"origem_dado" TEXT NOT NULL DEFAULT 'real' CHECK(origem_dado IN ('real','ficticio')),
"origem_pedido" TEXT,
"campanha_id_atribuida" TEXT,
origem_planilha TEXT,
auth_user_id TEXT,
criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX "idx_pedidos_origem" ON "pedidos" (origem_dado);
--> statement-breakpoint
CREATE TABLE "campanhas" (
"campanha_id" TEXT PRIMARY KEY,
"data_inicio" TEXT,
"data_fim" TEXT,
"plataforma" TEXT,
"nome_campanha" TEXT,
"objetivo" TEXT,
"investimento" REAL,
"impressoes" REAL,
"cliques" REAL,
"leads" REAL,
"clientes_novos" REAL,
"receita_atribuida" REAL,
"cpc" REAL,
"ctr" REAL,
"cvr_lead_cliente" REAL,
"cac" REAL,
"roas" REAL,
"origem_dado" TEXT NOT NULL DEFAULT 'real' CHECK(origem_dado IN ('real','ficticio')),
origem_planilha TEXT,
auth_user_id TEXT,
criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX "idx_campanhas_origem" ON "campanhas" (origem_dado);
--> statement-breakpoint
CREATE TABLE "interacoes_whatsapp" (
"interacao_id" TEXT PRIMARY KEY,
"lead_id" TEXT,
"cliente_id" TEXT,
"data_hora_entrada" REAL,
"data_hora_primeira_resposta" REAL,
"tempo_resposta_min" REAL,
"tipo_contato" TEXT,
"assunto" TEXT,
"resultado" TEXT,
"atendimento_por" TEXT,
"origem_dado" TEXT NOT NULL DEFAULT 'real' CHECK(origem_dado IN ('real','ficticio')),
origem_planilha TEXT,
auth_user_id TEXT,
criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX "idx_interacoes_whatsapp_origem" ON "interacoes_whatsapp" (origem_dado);
--> statement-breakpoint
CREATE TABLE "conteudos" (
"conteudo_id" TEXT PRIMARY KEY,
"data_publicacao" TEXT,
"canal" TEXT,
"formato" TEXT,
"tema" TEXT,
"objetivo" TEXT,
"cta" TEXT,
"impressoes" REAL,
"alcance" REAL,
"engajamentos" REAL,
"cliques" REAL,
"leads_gerados" REAL,
"status" TEXT,
"origem_dado" TEXT NOT NULL DEFAULT 'real' CHECK(origem_dado IN ('real','ficticio')),
origem_planilha TEXT,
auth_user_id TEXT,
criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX "idx_conteudos_origem" ON "conteudos" (origem_dado);
--> statement-breakpoint
CREATE TABLE "metricas_mensais" (
"mes_referencia" TEXT PRIMARY KEY,
"visitas_site" REAL,
"leads" REAL,
"propostas_enviadas" REAL,
"clientes_novos" REAL,
"pedidos_pagos" REAL,
"receita" REAL,
"ticket_medio" REAL,
"investimento_midia" REAL,
"cvr_visita_cliente" REAL,
"taxa_proposta_fechamento" REAL,
"cac" REAL,
"roas" REAL,
"tempo_medio_resposta_min" REAL,
"margem_contribuicao_percentual" REAL,
"origem_dado" TEXT NOT NULL DEFAULT 'real' CHECK(origem_dado IN ('real','ficticio')),
"pedidos_vindos_anuncios" REAL,
origem_planilha TEXT,
auth_user_id TEXT,
criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX "idx_metricas_mensais_origem" ON "metricas_mensais" (origem_dado);
--> statement-breakpoint
CREATE TABLE "evidencias_dossie" (
"ficha_id" TEXT PRIMARY KEY,
"tema" TEXT,
"evidencia_esperada" TEXT,
"tipo_evidencia" TEXT,
"local_arquivo" TEXT,
"decisao_registrada" TEXT,
"prazo" TEXT,
"metrica_controle" TEXT,
"status_ficha" TEXT,
"origem_dado" TEXT NOT NULL DEFAULT 'real' CHECK(origem_dado IN ('real','ficticio')),
origem_planilha TEXT,
auth_user_id TEXT,
criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX "idx_evidencias_dossie_origem" ON "evidencias_dossie" (origem_dado);
--> statement-breakpoint
CREATE TABLE importacoes (lote_id TEXT PRIMARY KEY, arquivo TEXT NOT NULL, resumo TEXT NOT NULL, criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);