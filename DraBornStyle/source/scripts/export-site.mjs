import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
let commit=process.env.STYLE_SOURCE_COMMIT||'';
if(!commit){try{commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{commit='local';}}
const dist=path.resolve('dist');
let html=await readFile(path.join(dist,'index.html'),'utf8');
html=html.replace(/<html([^>]*)>/,'<html$1 lang="tr">').replace(/<title>.*?<\/title>/,'<title>DraBornStyle · Berber ve Kuaför Yönetimi</title>').replace('</head>',`<meta name="description" content="DraBornStyle ile berberini ve ustanı keşfet, güncel fiyatları gör ve müsait saate randevu al. İşletmeni ve kazancını tek panelden yönet."><link rel="canonical" href="https://www.draborneagle.com/DraBornStyle/"><link rel="icon" type="image/svg+xml" href="/DraBornStyle/logo.svg"><meta name="theme-color" content="#080c14"></head>`);
await writeFile(path.join(dist,'index.html'),html);
await copyFile('docs/legal.html',path.join(dist,'legal.html'));
await copyFile('docs/logo.svg',path.join(dist,'logo.svg'));
await writeFile(path.join(dist,'DBSTYLE-SOURCE.json'),JSON.stringify({project:'DraBornStyle',version:'0.1.0',commit,builtAt:new Date().toISOString(),schema:'drabornstyle',androidRepository:'DrabornEagle/DraBornStyle'},null,2));
console.log('DraBornStyle static web package prepared.');
