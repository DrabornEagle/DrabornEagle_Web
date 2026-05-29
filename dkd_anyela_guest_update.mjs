import fs from 'fs';
import path from 'path';

const dkdRootDir = process.cwd();

const dkdPossiblePageFiles = [
  'app/AnyelaBorn/page.tsx',
  'app/AnyelaBorn/page.jsx',
  'app/AnyelaBorn/page.js',
  'src/app/AnyelaBorn/page.tsx',
  'src/app/AnyelaBorn/page.jsx',
  'src/app/AnyelaBorn/page.js',
  'pages/AnyelaBorn/index.tsx',
  'pages/AnyelaBorn/index.jsx',
  'pages/AnyelaBorn/index.js',
  'src/pages/AnyelaBorn/index.tsx',
  'src/pages/AnyelaBorn/index.jsx',
  'src/pages/AnyelaBorn/index.js',
  'AnyelaBorn/index.html',
  'public/AnyelaBorn/index.html',
  'docs/AnyelaBorn/index.html'
];

function dkdWalkFiles(dkdDir, dkdFiles = []) {
  const dkdSkipNames = new Set([
    '.git',
    'node_modules',
    '.next',
    'dist',
    'build',
    '.vercel'
  ]);

  if (!fs.existsSync(dkdDir)) {
    return dkdFiles;
  }

  for (const dkdEntry of fs.readdirSync(dkdDir, { withFileTypes: true })) {
    if (dkdSkipNames.has(dkdEntry.name)) {
      continue;
    }

    const dkdFullPath = path.join(dkdDir, dkdEntry.name);

    if (dkdEntry.isDirectory()) {
      dkdWalkFiles(dkdFullPath, dkdFiles);
      continue;
    }

    dkdFiles.push(dkdFullPath);
  }

  return dkdFiles;
}

function dkdFindAnyelaPageFile() {
  for (const dkdRelativePath of dkdPossiblePageFiles) {
    const dkdFullPath = path.join(dkdRootDir, dkdRelativePath);
    if (fs.existsSync(dkdFullPath)) {
      return dkdFullPath;
    }
  }

  const dkdAllFiles = dkdWalkFiles(dkdRootDir);
  const dkdPageCandidates = dkdAllFiles.filter((dkdFilePath) => {
    const dkdNormalizedPath = dkdFilePath.replaceAll('\\', '/');
    const dkdLowerPath = dkdNormalizedPath.toLowerCase();

    if (!dkdLowerPath.includes('anyelaborn')) {
      return false;
    }

    if (dkdLowerPath.includes('/login/')) {
      return false;
    }

    return /\.(tsx|jsx|js|html)$/i.test(dkdFilePath);
  });

  if (dkdPageCandidates.length === 0) {
    return null;
  }

  dkdPageCandidates.sort((dkdLeftPath, dkdRightPath) => {
    const dkdLeftScore = dkdLeftPath.toLowerCase().includes('page.') ? 0 : 1;
    const dkdRightScore = dkdRightPath.toLowerCase().includes('page.') ? 0 : 1;
    return dkdLeftScore - dkdRightScore;
  });

  return dkdPageCandidates[0];
}

function dkdBuildGuestButton(dkdIsHtmlFile) {
  if (dkdIsHtmlFile) {
    return `
<a
  href="/AnyelaBorn/?guest=1"
  data-dkd-anyela-guest-entry="true"
  style="display:inline-flex;align-items:center;justify-content:center;margin-top:16px;padding:13px 22px;border-radius:999px;background:linear-gradient(135deg,#ff3d9a,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:800;letter-spacing:.2px;box-shadow:0 14px 34px rgba(139,92,246,.28);"
>
  Misafir Girişi
</a>
`;
  }

  return `
<a
  href="/AnyelaBorn/?guest=1"
  data-dkd-anyela-guest-entry="true"
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: '13px 22px',
    borderRadius: 999,
    background: 'linear-gradient(135deg, #ff3d9a, #8b5cf6)',
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: 800,
    letterSpacing: 0.2,
    boxShadow: '0 14px 34px rgba(139,92,246,0.28)'
  }}
>
  Misafir Girişi
</a>
`;
}

function dkdInsertGuestButton(dkdFilePath) {
  const dkdOriginalContent = fs.readFileSync(dkdFilePath, 'utf8');

  if (dkdOriginalContent.includes('data-dkd-anyela-guest-entry="true"')) {
    console.log('Misafir Girişi butonu zaten var:', path.relative(dkdRootDir, dkdFilePath));
    return false;
  }

  const dkdIsHtmlFile = dkdFilePath.toLowerCase().endsWith('.html');
  const dkdGuestButton = dkdBuildGuestButton(dkdIsHtmlFile);

  let dkdUpdatedContent = dkdOriginalContent;

  const dkdInsertionTargets = [
    '</main>',
    '</section>',
    '</div>',
    '</body>'
  ];

  let dkdInserted = false;

  for (const dkdTarget of dkdInsertionTargets) {
    const dkdIndex = dkdUpdatedContent.indexOf(dkdTarget);
    if (dkdIndex !== -1) {
      dkdUpdatedContent =
        dkdUpdatedContent.slice(0, dkdIndex) +
        dkdGuestButton +
        '\n' +
        dkdUpdatedContent.slice(dkdIndex);
      dkdInserted = true;
      break;
    }
  }

  if (!dkdInserted) {
    dkdUpdatedContent += `\n${dkdGuestButton}\n`;
  }

  fs.writeFileSync(dkdFilePath, dkdUpdatedContent, 'utf8');
  console.log('Misafir Girişi butonu eklendi:', path.relative(dkdRootDir, dkdFilePath));
  return true;
}

function dkdCleanLoginFolders() {
  const dkdAllEntries = [];

  function dkdWalkDirs(dkdDir) {
    const dkdSkipNames = new Set([
      '.git',
      'node_modules',
      '.next',
      'dist',
      'build',
      '.vercel'
    ]);

    if (!fs.existsSync(dkdDir)) {
      return;
    }

    for (const dkdEntry of fs.readdirSync(dkdDir, { withFileTypes: true })) {
      if (dkdSkipNames.has(dkdEntry.name)) {
        continue;
      }

      const dkdFullPath = path.join(dkdDir, dkdEntry.name);

      if (dkdEntry.isDirectory()) {
        dkdAllEntries.push(dkdFullPath);
        dkdWalkDirs(dkdFullPath);
      }
    }
  }

  dkdWalkDirs(dkdRootDir);

  const dkdLoginDirs = dkdAllEntries.filter((dkdDirPath) => {
    const dkdNormalizedPath = dkdDirPath.replaceAll('\\', '/').toLowerCase();
    return dkdNormalizedPath.endsWith('/anyelaborn/login') ||
      dkdNormalizedPath.includes('/anyelaborn/login/');
  });

  if (dkdLoginDirs.length === 0) {
    console.log('AnyelaBorn/Login klasörü bulunamadı, temizlenecek içerik yok.');
    return;
  }

  for (const dkdLoginDir of dkdLoginDirs) {
    for (const dkdChildName of fs.readdirSync(dkdLoginDir)) {
      const dkdChildPath = path.join(dkdLoginDir, dkdChildName);
      fs.rmSync(dkdChildPath, { recursive: true, force: true });
    }

    console.log('Login klasör içi temizlendi:', path.relative(dkdRootDir, dkdLoginDir));
  }
}

const dkdAnyelaPageFile = dkdFindAnyelaPageFile();

if (!dkdAnyelaPageFile) {
  console.error('AnyelaBorn ana sayfa dosyası bulunamadı. Lütfen klasör yapısını kontrol et.');
  process.exit(1);
}

dkdInsertGuestButton(dkdAnyelaPageFile);
dkdCleanLoginFolders();

console.log('DKD AnyelaBorn guest update tamamlandı.');
