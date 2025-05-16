import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { getProjectRoot } from './getProjectRoot';

const execAsync = promisify(exec);

/**
 * Build the package
 */
export async function buildPackage(packageDir: string): Promise<boolean> {
  const originalDir = getProjectRoot(); // Store original CWD (likely monorepo root)
  try {
    // Change to package directory for install
    process.chdir(packageDir);
    const installCommand = await execAsync('npm install');
    if (installCommand.stderr) {
      console.warn(`⚠️ Some errors occurred while installing the package.`);
      console.warn(installCommand.stderr);
      // debug the error -> find a fix -> call fixPackage for this.
    }

    // Read package name AFTER install, while still in packageDir
    const packageJsonPath = path.join(packageDir, 'package.json'); // Use path.join
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageName = JSON.parse(packageJsonContent).name;
    if (!packageName) {
      throw new Error(`Could not find package name in ${packageJsonPath}`);
    }

    // Change back to original directory BEFORE build
    process.chdir(originalDir);

    console.log(`🔨 Building the package ${packageName} from root...`);
    const buildCmd = `npm run build -- --filter=${packageName}`;
    const buildCommand = await execAsync(buildCmd); // Run build from originalDir
    console.log(`✨ Build completed successfully for ${packageName}!`);
    // console.log(stdout);
    // console.log(stderr);
    if (buildCommand.stderr) {
      console.warn(
        `⚠️ Some errors occurred while building the package ${packageName}.`,
      );
      console.warn(buildCommand.stderr);
      // debug the error -> find a fix -> call fixPackage for this.
    }
    // No need to chdir back again, already in originalDir
    return true;
  } catch (error) {
    // Error handling should still work, but the error might originate from a different CWD
    console.error(`Error during build process for ${packageDir}:`, error);
    // Ensure error logs are written relative to the package directory
    const errorLogDir = path.join(packageDir, '.foxes');
    fs.mkdirSync(errorLogDir, { recursive: true });
    fs.writeFileSync(
      path.join(errorLogDir, `packagefox-bug-build-${Date.now()}.json`),
      JSON.stringify(
        {
          type: 'bug',
          occurredAt: 'build',
          error,
        },
        null,
        2,
      ),
    );
    console.warn(
      `⚠️ Could not automatically build the package at ${packageDir}. Please build it manually.`,
    );
    // Ensure we return to the original directory if an error occurred before the build started
    if (process.cwd() !== originalDir) {
      process.chdir(originalDir);
    }
    return false;
  }
}
