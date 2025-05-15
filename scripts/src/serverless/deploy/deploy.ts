import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { BASE_SERVER_URL, STAGE } from './constants';

interface DocsData {
  info?: {
    description?: string;
    version?: string;
    title?: string;
  };
  [key: string]: any;
}

interface FunctionMetadata {
  name: string;
  baseUrl: string;
  stage: string;
  type: string;
  endpoints: any[];
  metadata: {
    description?: string;
    version?: string;
    title?: string;
    docData?: DocsData;
    serverless: {
      stage: string;
      output: string;
    };
  };
}

/**
 * Extract base URL from serverless deployment output
 * @param {string} output - Serverless deployment output
 * @returns {string|null} - Base URL or null if not found
 */
function extractBaseUrl(output: string): string | null {
  // Look for the docs.json endpoint which is constant
  const docsUrlMatch = output.match(/GET - (https:\/\/[^\/]+)\/.*?\/docs\.json/);
  if (docsUrlMatch) {
    return docsUrlMatch[1].replace('/docs.json', '');
  }
  return null;
}

/**
 * Deploy a Serverless function
 * @param {string} packagePath - Directory of the package
 * @returns {Promise<boolean>} - Success status
 */
async function deployPackageSls(packagePath: string): Promise<boolean> {
  try {
    const slsPath = path.join(packagePath, 'sls');
    const serverlessYmlPath = path.join(slsPath, 'serverless.yml');
    if (!fs.existsSync(serverlessYmlPath)) {
      console.error(`serverless.yml not found for ${packagePath}`);
      return false;
    }

    console.log(`Deploying ${path.basename(packagePath)}`);

    // Change to function directory first
    process.chdir(slsPath);

    // Install dependencies if needed
    if (!fs.existsSync(path.join(slsPath, 'node_modules'))) {
      console.log('Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
    }

    // Build the function
    console.log('Building function...');
    execSync('npm run build', { stdio: 'inherit' });

    // Deploy using serverless framework
    console.log('Deploying with serverless framework...');
    const deployCommand = `npx serverless deploy --stage ${STAGE}`;
    console.log('Running command:', deployCommand);

    const output = execSync(deployCommand, { encoding: 'utf8' });
    console.log('Deployment output:', output);

    // Extract deployment information
    const packageName = path.basename(packagePath);
    console.log('packageName', packageName);
    const baseUrl = extractBaseUrl(output);

    if (baseUrl) {
      console.log(`Deployed base URL: ${baseUrl}`);
      let docsData: DocsData = JSON.parse(fs.readFileSync(path.join(slsPath, 'openapi.json'), 'utf8'));

      if (!BASE_SERVER_URL) {
        throw new Error('BASE_SERVER_URL is not set');
      }

      const functionMetadata: FunctionMetadata = {
        name: packageName,
        baseUrl: baseUrl,
        stage: STAGE.toUpperCase(),
        type: 'MIXED',
        endpoints: [],
        metadata: {
          description: docsData?.info?.description,
          version: docsData?.info?.version,
          title: docsData?.info?.title,
          docData: docsData,
          serverless: {
            stage: STAGE.toUpperCase(),
            output,
          },
        },
      };

      const createResponse = await fetch(`${BASE_SERVER_URL}/api/client-functions/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...functionMetadata }),
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create function metadata: ${createResponse.statusText}`);
      }

      console.log('Function metadata created successfully');
    }

    return true;
  } catch (error) {
    console.error(`Error deploying sls function for package ${path.basename(packagePath)}:`, error);
    return false;
  }
}

export default deployPackageSls; 