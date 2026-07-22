import { Pool } from 'pg';
const p = new Pool({host:'aws-0-ap-northeast-1.pooler.supabase.com',port:5432,database:'postgres',user:'postgres.kwgvocscgumkaylchjtd',password:'@cCnanda1411441',ssl:{rejectUnauthorized:false}});
async function main() {
  const r = await p.query("SELECT email FROM students LIMIT 10");
  r.rows.forEach(row => console.log(row.email));
  await p.end();
}
main().catch(console.error);
