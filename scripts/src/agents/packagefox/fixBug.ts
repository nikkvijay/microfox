import path from 'path';
import { PackageFoxRequest } from '../../process-issue';
import fs from 'fs';
import { fixPackage } from './fixPackage';

export const fixBug = async (
  packageName: string,
  request: PackageFoxRequest,
) => {
  const dirName = packageName.replace('@microfox/', '');
  const packageDir = path.join(
    process.cwd().replace('/scripts', ''),
    './packages',
    dirName,
  );

  const errorLogDir = path.join(packageDir, '.foxes');
  fs.mkdirSync(errorLogDir, { recursive: true });
  fs.writeFileSync(
    path.join(errorLogDir, `packagefox-bug-build-${Date.now()}.json`),
    JSON.stringify(
      {
        type: 'bug',
        occurredAt: 'build',
        logs: request.logs,
        notes: request.notes,
        error: request.error,
      },
      null,
      2,
    ),
  );

  await fixPackage();
};
