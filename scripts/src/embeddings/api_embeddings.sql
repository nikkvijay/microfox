-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create enum type for stages if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deployment_stage') THEN
    CREATE TYPE deployment_stage AS ENUM ('DEV', 'STAGING', 'PREVIEW', 'PROD');
  END IF;
END
$$;

-- Main embeddings table
CREATE TABLE IF NOT EXISTS api_embeddings (
  id                         UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                    TEXT             NULL,
  bot_project_id             TEXT             NULL,
  origin_client_request_id   TEXT             NULL,
  base_url                   TEXT             NOT NULL,
  schema_path                TEXT             NULL,                 -- e.g. "/docs.json"
  endpoint_path              TEXT             NOT NULL,             -- e.g. "/api/send-message"
  http_method                TEXT             NOT NULL,             -- e.g. "POST"
  doc_text                   TEXT             NOT NULL,             -- concatenated context sent to embedder
  embedding                  VECTOR(768)      NULL,                 -- Gemini/text-embedding-004
  is_public                  BOOLEAN          NOT NULL DEFAULT FALSE,
  stage                      deployment_stage NOT NULL DEFAULT 'STAGING',
  metadata                   JSONB            NULL,
  created_at                 TIMESTAMPTZ      NOT NULL DEFAULT now(),
  updated_at                 TIMESTAMPTZ      NOT NULL DEFAULT now()
);

-- ANN index for fast similarity search
CREATE INDEX IF NOT EXISTS idx_api_embeddings_embedding
  ON api_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Filter indexes
CREATE INDEX IF NOT EXISTS idx_api_embeddings_project
  ON api_embeddings(bot_project_id);

CREATE INDEX IF NOT EXISTS idx_api_embeddings_request
  ON api_embeddings(origin_client_request_id);

CREATE INDEX IF NOT EXISTS idx_api_embeddings_public
  ON api_embeddings(is_public);

CREATE INDEX IF NOT EXISTS idx_api_embeddings_stage
  ON api_embeddings(stage);
