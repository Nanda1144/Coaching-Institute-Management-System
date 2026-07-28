import * as db from '../../shared/utils/db';

const SECTIONS = ['institute', 'academic', 'security', 'notifications', 'appearance', 'backup'];

export const settingsService = {
  async getAll() {
    const rows = await db.findMany('app_settings', {
      where: [],
      limit: 100,
    });
    const result: Record<string, unknown> = {};
    for (const row of rows) {
      result[row.section] = row.data;
    }
    for (const section of SECTIONS) {
      if (!result[section]) result[section] = {};
    }
    return result;
  },

  async getSection(section: string) {
    const row = await db.findFirst('app_settings', {
      where: [{ column: 'section', value: section }],
    });
    return row ? row.data : {};
  },

  async upsert(section: string, data: Record<string, unknown>, userId: string) {
    const existing = await db.findFirst('app_settings', {
      where: [{ column: 'section', value: section }],
    });
    if (existing) {
      const merged = { ...existing.data, ...data };
      const updated = await db.update(
        'app_settings',
        [{ column: 'section', value: section }],
        { data: merged, updatedBy: userId },
      );
      return updated;
    }
    const created = await db.create('app_settings', {
      section,
      data,
      updatedBy: userId,
    });
    return created;
  },
};
