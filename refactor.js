const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Create missing features structure
const featuresToCreate = [
  'jobs', 'skills', 'roadmap', 'github'
];
for (const feature of featuresToCreate) {
  const base = path.join(srcDir, 'features', feature);
  ensureDir(path.join(base, 'components'));
  ensureDir(path.join(base, 'hooks'));
  ensureDir(path.join(base, 'services'));
  ensureDir(path.join(base, 'repositories'));
  ensureDir(path.join(base, 'types'));
  const indexFile = path.join(base, 'index.ts');
  if (!fs.existsSync(indexFile)) {
    fs.writeFileSync(indexFile, '// Export feature components, types, etc. here\n');
  }
}

// Existing features to add directories to
const featuresToUpdate = {
  'assessments': ['types', 'repositories'],
  'compatibility': ['types', 'repositories', 'hooks'],
  'auth': ['types', 'hooks', 'repositories']
};

for (const [feature, dirs] of Object.entries(featuresToUpdate)) {
  const base = path.join(srcDir, 'features', feature);
  for (const dir of dirs) {
    ensureDir(path.join(base, dir));
  }
}

// 2. Move files
const filesToMove = [
  // Services
  { src: 'src/services/jobs.service.ts', dest: 'src/features/jobs/services/jobs.service.ts' },
  { src: 'src/services/users.service.ts', dest: 'src/features/auth/services/users.service.ts' },
  { src: 'src/services/assessments.service.ts', dest: 'src/features/assessments/services/assessments.service.ts' },
  { src: 'src/services/compatibility.service.ts', dest: 'src/features/compatibility/services/compatibility.service.ts' },
  // Types
  { src: 'src/types/assessment.types.ts', dest: 'src/features/assessments/types/assessment.types.ts' },
  { src: 'src/types/job.types.ts', dest: 'src/features/jobs/types/job.types.ts' },
  { src: 'src/types/compatibility.types.ts', dest: 'src/features/compatibility/types/compatibility.types.ts' },
  { src: 'src/types/user.types.ts', dest: 'src/features/auth/types/user.types.ts' },
  // Hooks
  { src: 'src/hooks/use-mobile.tsx', dest: 'src/hooks/useMobile.tsx' },
  { src: 'src/hooks/use-toast.ts', dest: 'src/hooks/useToast.ts' },
];

for (const move of filesToMove) {
  const srcPath = path.join(rootDir, move.src);
  const destPath = path.join(rootDir, move.dest);
  
  if (fs.existsSync(srcPath)) {
    // Ensure destination directory exists
    ensureDir(path.dirname(destPath));
    
    // Move file
    fs.renameSync(srcPath, destPath);
    console.log(`Moved: ${move.src} -> ${move.dest}`);
  } else {
    console.log(`Not found: ${move.src}`);
  }
}

// 3. Create index.ts in src/types/ and re-export user.types.ts
const typesIndexContent = `export * from '@/features/assessments/types/assessment.types';
export * from '@/features/jobs/types/job.types';
export * from '@/features/compatibility/types/compatibility.types';
export * from '@/features/auth/types/user.types';
`;
fs.writeFileSync(path.join(srcDir, 'types', 'index.ts'), typesIndexContent);

const userTypesReexportContent = `export * from '@/features/auth/types/user.types';\n`;
fs.writeFileSync(path.join(srcDir, 'types', 'user.types.ts'), userTypesReexportContent);

// 4. Update imports in all files
function getFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, filesList);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        filesList.push(filePath);
      }
    }
  }
  return filesList;
}

const allFiles = getFiles(srcDir);

const replacements = [
  { from: /@\/services\/jobs\.service/g, to: '@/features/jobs/services/jobs.service' },
  { from: /@\/services\/users\.service/g, to: '@/features/auth/services/users.service' },
  { from: /@\/services\/assessments\.service/g, to: '@/features/assessments/services/assessments.service' },
  { from: /@\/services\/compatibility\.service/g, to: '@/features/compatibility/services/compatibility.service' },
  
  { from: /@\/types\/assessment\.types/g, to: '@/features/assessments/types/assessment.types' },
  { from: /@\/types\/job\.types/g, to: '@/features/jobs/types/job.types' },
  { from: /@\/types\/compatibility\.types/g, to: '@/features/compatibility/types/compatibility.types' },
  { from: /@\/types\/user\.types/g, to: '@/features/auth/types/user.types' },
  
  // hook replacements
  { from: /@\/hooks\/use-mobile/g, to: '@/hooks/useMobile' },
  { from: /@\/hooks\/use-toast/g, to: '@/hooks/useToast' },
  
  // also handle possible relative imports like "../../services/jobs.service" etc by just doing a regex across quotes
  // Since we might not catch everything with just @/, let's also catch the endings
  { from: /(['"])(?:\.\.\/)+services\/jobs\.service(['"])/g, to: '$1@/features/jobs/services/jobs.service$2' },
  { from: /(['"])(?:\.\.\/)+services\/users\.service(['"])/g, to: '$1@/features/auth/services/users.service$2' },
  { from: /(['"])(?:\.\.\/)+services\/assessments\.service(['"])/g, to: '$1@/features/assessments/services/assessments.service$2' },
  { from: /(['"])(?:\.\.\/)+services\/compatibility\.service(['"])/g, to: '$1@/features/compatibility/services/compatibility.service$2' },
  
  { from: /(['"])(?:\.\.\/)+types\/assessment\.types(['"])/g, to: '$1@/features/assessments/types/assessment.types$2' },
  { from: /(['"])(?:\.\.\/)+types\/job\.types(['"])/g, to: '$1@/features/jobs/types/job.types$2' },
  { from: /(['"])(?:\.\.\/)+types\/compatibility\.types(['"])/g, to: '$1@/features/compatibility/types/compatibility.types$2' },
  { from: /(['"])(?:\.\.\/)+types\/user\.types(['"])/g, to: '$1@/features/auth/types/user.types$2' },
  
  { from: /(['"])(?:\.\.\/)+hooks\/use-mobile(['"])/g, to: '$1@/hooks/useMobile$2' },
  { from: /(['"])(?:\.\.\/)+hooks\/use-toast(['"])/g, to: '$1@/hooks/useToast$2' },
  
  // what if they are in the same folder, e.g. "./use-toast"
  { from: /(['"])\.\/use-mobile(['"])/g, to: '$1./useMobile$2' },
  { from: /(['"])\.\/use-toast(['"])/g, to: '$1./useToast$2' },
];

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const r of replacements) {
    if (r.from.test(content)) {
      content = content.replace(r.from, r.to);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated imports in ${file}`);
  }
}

// 5. Delete src/services if empty
const servicesDir = path.join(srcDir, 'services');
if (fs.existsSync(servicesDir)) {
  const remainingFiles = fs.readdirSync(servicesDir);
  if (remainingFiles.length === 0) {
    fs.rmdirSync(servicesDir);
    console.log('Deleted src/services/ directory');
  } else {
    console.log('src/services/ is not empty, files remaining:', remainingFiles);
  }
}

console.log('Refactor script completed.');
