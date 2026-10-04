import { describe, expect, it } from 'vitest';
import { UNITS } from './units.data';
describe('SmartLingo content', () => {
  it('contains starter and six units', () => expect(UNITS.length).toBe(7));
  it('has substantial practice in every unit', () => UNITS.forEach(u => expect(u.practice.length).toBeGreaterThanOrEqual(25)));
  it('has a final exam in every unit', () => UNITS.forEach(u => expect(u.exam.length).toBe(20)));
});
