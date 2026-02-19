const fs = require('fs');
const path = require('path');

const tplPath = path.join(__dirname, 'index.html.template');
const outPath = path.join(__dirname, 'index.html');

if (!fs.existsSync(tplPath)) {
  console.error('index.html.template not found');
  process.exit(1);
}

let tpl = fs.readFileSync(tplPath, 'utf8');

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-ref.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

tpl = tpl.replace(/%%SUPABASE_URL%%/g, supabaseUrl).replace(/%%SUPABASE_ANON_KEY%%/g, supabaseKey);

fs.writeFileSync(outPath, tpl, 'utf8');
console.log('Built index.html');
