import { createClient } from '@supabase/supabase-js';
import { embed } from './geminiEmbed';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const TABLE = 'api_embeddings';

/**
 * List APIs by project ID
 */
async function listByProject(projectId: string, stage: string | null = null, limit = 10) {
  const query = supabase
    .from(TABLE)
    .select('bot_project_id,base_url,endpoint_path,http_method,stage,is_public,updated_at')
    .eq('bot_project_id', projectId)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (stage && stage !== '*') {
    query.eq('stage', stage);
  }

  const { data, error } = await query;
  if (error) throw error;

  console.log(`\n🤖 APIs in project "${projectId}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    data!.map((r: any) => ({
      bot_project_id: r.bot_project_id,
      base_url: r.base_url,
      endpoint_path: r.endpoint_path,
      http_method: r.http_method,
      stage: r.stage,
      is_public: r.is_public,
    }))
  );
}

/**
 * List all public APIs
 */
async function listPublicApis(stage: string | null = null, limit = 10) {
  const query = supabase
    .from(TABLE)
    .select('bot_project_id,base_url,endpoint_path,http_method,stage,is_public,updated_at')
    .eq('is_public', true)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (stage && stage !== '*') {
    query.eq('stage', stage);
  }

  const { data, error } = await query;
  if (error) throw error;

  console.log(`\n🌍 Public APIs${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    data!.map((r: any) => ({
      bot_project_id: r.bot_project_id,
      base_url: r.base_url,
      endpoint_path: r.endpoint_path,
      http_method: r.http_method,
      stage: r.stage,
      is_public: r.is_public,
    }))
  );
}

/**
 * List all APIs in the system, regardless of project or visibility
 */
async function listAllApis(stage: string | null = null, limit = 10) {
  const query = supabase
    .from(TABLE)
    .select('bot_project_id,base_url,endpoint_path,http_method,stage,is_public,updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (stage && stage !== '*') {
    query.eq('stage', stage);
  }

  const { data, error } = await query;
  if (error) throw error;

  console.log(`\n🌍 All APIs${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    data!.map((r: any) => ({
      bot_project_id: r.bot_project_id,
      base_url: r.base_url,
      endpoint_path: r.endpoint_path,
      http_method: r.http_method,
      stage: r.stage,
      is_public: r.is_public,
    }))
  );
}

/**
 * Perform semantic search on APIs by project
 */
async function searchByProject(projectId: string, query: string, stage: string | null = null, limit = 10) {
  console.log(`\n🔍 Embedding query: "${query}"…`);
  const qEmb = await embed(query);
  console.log('🧠 Query embedding obtained');

  console.log(`🤖 Project API search in "${projectId}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}…`);

  const { data, error } = await supabase.rpc('match_apis_by_project', {
    query_embedding: qEmb,
    project_id: projectId,
    k: limit,
    stage_filter: stage === '*' ? null : stage,
  });
  if (error) throw error;

  console.log(`\n🎯 Top ${limit} project results for "${query}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    (data as any[]).map(r => ({
      bot_project_id: r.bot_project_id,
      base_url: r.base_url,
      endpoint_path: r.endpoint_path,
      http_method: r.http_method,
      stage: r.stage,
      is_public: r.is_public,
      similarity: r.similarity,
    }))
  );
}

/**
 * Perform semantic search on public APIs
 */
async function searchPublicApis(query: string, stage: string | null = null, limit = 10) {
  console.log(`\n🔍 Embedding query: "${query}"…`);
  const qEmb = await embed(query);
  console.log('🧠 Query embedding obtained');

  console.log(`🌍 Public API search${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}…`);

  const { data, error } = await supabase.rpc('match_apis', {
    query_embedding: qEmb,
    k: limit,
    stage_filter: stage === '*' ? null : stage,
    public_only: true,
  });
  if (error) throw error;

  console.log(`\n🎯 Top ${limit} public results for "${query}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    (data as any[]).map(r => ({
      bot_project_id: r.bot_project_id,
      base_url: r.base_url,
      endpoint_path: r.endpoint_path,
      http_method: r.http_method,
      stage: r.stage,
      is_public: r.is_public,
      similarity: r.similarity,
    }))
  );
}

/**
 * Perform semantic search on all APIs
 */
async function searchAllApis(query: string, stage: string | null = null, limit = 10) {
  console.log(`\n🔍 Embedding query: "${query}"…`);
  const qEmb = await embed(query);
  console.log('🧠 Query embedding obtained');

  console.log(`🌍 Global API search${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}…`);

  const { data, error } = await supabase.rpc('match_apis', {
    query_embedding: qEmb,
    k: limit,
    stage_filter: stage === '*' ? null : stage,
    public_only: false,
  });
  if (error) throw error;

  console.log(`\n🎯 Top ${limit} global results for "${query}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    (data as any[]).map(r => ({
      bot_project_id: r.bot_project_id,
      base_url: r.base_url,
      endpoint_path: r.endpoint_path,
      http_method: r.http_method,
      stage: r.stage,
      is_public: r.is_public,
      similarity: r.similarity,
    }))
  );
}

async function main() {
  // Parse arguments
  const args = process.argv.slice(2);
  
  // Get action (the only required argument)
  if (args.length === 0) {
    showUsage();
    process.exit(1);
  }

  const action = args[0].toLowerCase();
  
  // The next arguments depend on the action
  switch (action) {
    case 'project': {
      // project <projectId> [stage] ["query"]
      const projectId = args[1];
      if (!projectId) {
        console.error('❌ Missing project ID');
        showUsage();
        process.exit(1);
      }
      
      let stage: string | null = null;
      let query: string | null = null;
      
      // Check if the next arg is a stage or a query
      if (args[2] && !args[2].startsWith('"') && !args[2].startsWith("'")) {
        stage = args[2];
        query = args[3];
      } else {
        query = args[2];
      }
      
      if (query) {
        await searchByProject(projectId, query, stage);
      } else {
        await listByProject(projectId, stage);
      }
      break;
    }
    
    case 'public': {
      // public [stage] ["query"]
      let stage: string | null = null;
      let query: string | null = null;
      
      // Check if the next arg is a stage or a query
      if (args[1] && !args[1].startsWith('"') && !args[1].startsWith("'")) {
        stage = args[1];
        query = args[2];
      } else {
        query = args[1];
      }
      
      if (query) {
        await searchPublicApis(query, stage);
      } else {
        await listPublicApis(stage);
      }
      break;
    }
    
    case 'all': {
      // all [stage] ["query"]
      let stage: string | null = null;
      let query: string | null = null;
      
      // Check if the next arg is a stage or a query
      if (args[1] && !args[1].startsWith('"') && !args[1].startsWith("'")) {
        stage = args[1];
        query = args[2];
      } else {
        query = args[1];
      }
      
      if (query) {
        await searchAllApis(query, stage);
      } else {
        await listAllApis(stage);
      }
      break;
    }
    
    default:
      console.error(`❌ Unknown action: ${action}`);
      showUsage();
      process.exit(1);
  }

  console.log('\n✅ Done');
}

function showUsage() {
  console.error(
    '❌ Usage:\n' +
    ' 1) Project APIs:         ts-node queryApis.ts project <projectId> [stage] ["query"]\n' +
    ' 2) Public APIs:          ts-node queryApis.ts public [stage] ["query"]\n' +
    ' 3) All APIs:             ts-node queryApis.ts all [stage] ["query"]\n' +
    '\nExamples:\n' +
    ' - List project APIs:     ts-node queryApis.ts project my-chatbot\n' +
    ' - All stages explicitly: ts-node queryApis.ts project my-chatbot "*"\n' +
    ' - Search project APIs:   ts-node queryApis.ts project my-chatbot "send message"\n' +
    ' - With specific stage:   ts-node queryApis.ts project my-chatbot PROD "send message"\n' +
    ' - List public APIs:      ts-node queryApis.ts public\n' +
    ' - Search all APIs:       ts-node queryApis.ts all "user authentication"'
  );
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
}); 