import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { BASE_SERVER_URL, MODE } from './constants';

/**
 * Remove a Serverless function
 * @param {string} packagePath - Directory of the package
 * @returns {Promise<boolean>} - Success status
 */
async function removePackageSls(packagePath: string): Promise<boolean> {
  try {
    const slsPath = path.join(packagePath, 'sls');
    const serverlessYmlPath = path.join(slsPath, 'serverless.yml');
    if (!fs.existsSync(serverlessYmlPath)) {
      console.error(`serverless.yml not found for ${packagePath}`);
      return false;
    }

    const packageName = path.basename(packagePath);
    console.log(`Removing ${packageName}`);

    // Change to function directory
    process.chdir(slsPath);

    // Remove using serverless framework
    const removeCommand = `serverless remove --stage ${MODE}`;
    console.log('Running command:', removeCommand);

    execSync(removeCommand, { stdio: 'inherit' });
    console.log('Function removed successfully');

    const deleteResponse = await fetch(
      `${BASE_SERVER_URL}/api/client-functions/public?package_name=${packageName}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!deleteResponse.ok) {
      throw new Error(`Failed to delete function from database: ${deleteResponse.statusText}`);
    }

    console.log('Function deleted successfully from database');

    return true;
  } catch (error) {
    console.error(`Error removing sls function for package ${path.basename(packagePath)}:`, error);
    return false;
  }
}

export default removePackageSls; 