import test from 'node:test';
import assert from 'node:assert/strict';
import {unzipSync,strFromU8} from 'fflate';
import {spreadsheetBytes,csvText} from '../src/reports.ts';

test('XLSX keeps currency numeric and user formulas as literal text',()=>{
 const files=unzipSync(spreadsheetBytes([['İşletme','Hizmet hasılatı'],['Ahmet & <Berber>',317.50],['=HYPERLINK("https://example.invalid")',20]]));
 assert.ok(files['[Content_Types].xml']);assert.ok(files['xl/_rels/workbook.xml.rels']);
 const sheet=strFromU8(files['xl/worksheets/sheet1.xml']);
 assert.match(sheet,/<c r="B2" t="n"><v>317\.5<\/v><\/c>/);
 assert.match(sheet,/Ahmet &amp; &lt;Berber&gt;/);
 assert.match(sheet,/<c r="A3" t="inlineStr">/);
 assert.doesNotMatch(sheet,/<f[ >]/);
});

test('CSV preserves Turkish text, decimal numbers and blocks formula interpretation',()=>{
 const csv=csvText([['Usta','Tutar'],['Çağrı',297.50],['=2+2',20],['@SUM(1)',25],['Dedi: "merhaba"',0]]);
 assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"Çağrı";"297.5"'));
 assert.ok(csv.includes('"\'=2+2";"20"'));assert.ok(csv.includes('"\'@SUM(1)";"25"'));
 assert.ok(csv.includes('"Dedi: ""merhaba""";"0"'));
});
