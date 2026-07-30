import * as db from '../../shared/utils/db';
import { AppError } from '../../shared/errors/AppError';

function computeEndDate(start: Date, durationDays: number): Date {
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays);
  return end;
}

export const subscriptionService = {
  async getPlans() {
    return db.findMany('subscription_plans', {
      where: [{ column: 'isActive', value: true }],
      orderBy: [{ column: 'price', dir: 'asc' }],
    });
  },

  async getMySubscription(adminId: string) {
    const sub = await db.findFirst('admin_subscriptions', {
      where: [{ column: 'adminId', value: adminId }],
    });
    if (!sub) return null;
    if (sub.planId) {
      const plan = await db.findFirst('subscription_plans', {
        where: [{ column: 'id', value: sub.planId }],
      });
      return { ...sub, plan };
    }
    return sub;
  },

  async createOrGetTrial(adminId: string) {
    const existing = await db.findFirst('admin_subscriptions', {
      where: [{ column: 'adminId', value: adminId }],
    });
    if (existing) return existing;
    const trialEnd = new Date();
    trialEnd.setMonth(trialEnd.getMonth() + 6);
    return db.create('admin_subscriptions', {
      adminId,
      trialEndsAt: trialEnd,
      startDate: new Date(),
      status: 'TRIAL',
    });
  },

  async subscribe(adminId: string, planId: string) {
    const plan = await db.findFirst('subscription_plans', {
      where: [{ column: 'id', value: planId }, { column: 'isActive', value: true }],
    });
    if (!plan) throw AppError.notFound('Plan not found');
    const now = new Date();
    const endDate = computeEndDate(now, plan.durationDays);
    const existing = await db.findFirst('admin_subscriptions', {
      where: [{ column: 'adminId', value: adminId }],
    });
    if (existing) {
      return db.update(
        'admin_subscriptions',
        [{ column: 'adminId', value: adminId }],
        { planId, status: 'ACTIVE', startDate: now, endDate, paidAt: now },
      );
    }
    return db.create('admin_subscriptions', {
      adminId,
      planId,
      startDate: now,
      endDate,
      trialEndsAt: null,
      status: 'ACTIVE',
      paidAt: now,
    });
  },

  async getStatus(adminId: string) {
    const sub = await db.findFirst('admin_subscriptions', {
      where: [{ column: 'adminId', value: adminId }],
    });
    if (!sub) return { status: 'NO_SUBSCRIPTION', daysLeft: 0, isPaused: false };
    const now = new Date();
    const trialEnd = sub.trialEndsAt ? new Date(sub.trialEndsAt) : null;
    const endDate = sub.endDate ? new Date(sub.endDate) : null;
    const daysLeft = endDate
      ? Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : trialEnd
        ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    const isExpired = (endDate && now > endDate) || (trialEnd && now > trialEnd);
    const isPaused = sub.status === 'EXPIRED' || sub.status === 'PAUSED' || isExpired;
    return {
      status: sub.status,
      daysLeft: Math.max(0, daysLeft),
      isPaused,
      trialEndsAt: sub.trialEndsAt,
      endDate: sub.endDate,
      isTrial: sub.status === 'TRIAL',
    };
  },
};
