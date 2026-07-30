import { query } from '../config/database';

async function main() {
  console.log('Seeding subscription plans...');

  const plans = [
    { name: 'Monthly', durationDays: 30, price: 499, description: 'Perfect for short-term needs', features: ['Full dashboard access', 'Up to 500 students', 'Attendance management', 'Basic reports'] },
    { name: 'Quarterly', durationDays: 90, price: 1199, description: 'Best value for growing institutes', features: ['Everything in Monthly', 'Up to 2000 students', 'Advanced analytics', 'Priority support', 'Bulk import/export'] },
    { name: 'Half-Yearly', durationDays: 180, price: 1999, description: 'For established institutions', features: ['Everything in Quarterly', 'Up to 5000 students', 'Custom reports', 'API access', 'Dedicated account manager'] },
    { name: 'Yearly', durationDays: 365, price: 3499, description: 'Complete solution for large institutes', features: ['Everything in Half-Yearly', 'Unlimited students', 'All modules included', 'White-label option', '24/7 premium support', 'Custom integrations'] },
  ];

  for (const plan of plans) {
    const existing = await query(`SELECT id FROM subscription_plans WHERE name = $1`, [plan.name]);
    if (existing.rows.length > 0) {
      console.log(`  ${plan.name}: already exists (id=${existing.rows[0].id})`);
      continue;
    }
    const result = await query(
      `INSERT INTO subscription_plans (name, duration_days, price, description, features)
       VALUES ($1, $2, $3, $4, $5::jsonb) RETURNING id`,
      [plan.name, plan.durationDays, plan.price, plan.description, JSON.stringify(plan.features)]
    );
    console.log(`  ${plan.name}: created (id=${result.rows[0].id})`);
  }

  console.log('Subscription plans seeded successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
