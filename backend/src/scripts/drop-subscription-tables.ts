import { query } from '../config/database';

async function main() {
  await query('DROP TABLE IF EXISTS admin_subscriptions CASCADE');
  await query('DROP TABLE IF EXISTS subscription_plans CASCADE');
  console.log('Tables dropped');
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
