import { Pool } from 'pg';
const p = new Pool({host:'aws-0-ap-northeast-1.pooler.supabase.com',port:5432,database:'postgres',user:'postgres.kwgvocscgumkaylchjtd',password:'@cCnanda1411441',ssl:{rejectUnauthorized:false}});
async function main() {
  const r = await p.query("SELECT email, password IS NOT NULL as has_pw, role, LEFT(password, 30) as pw_prefix FROM students LIMIT 5");
  r.rows.forEach(row => console.log(row.email, 'pw:', row.has_pw, 'role:', row.role, 'pw_prefix:', row.pw_prefix));
  const r2 = await p.query("SELECT email FROM students WHERE email = 'rohan.arora11@student.college.edu'");
  console.log('Found rohan:', r2.rows.length);
  await p.end();
}
main().catch(console.error);
