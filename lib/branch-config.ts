import { branches } from './constants';

export const BRANCH_COLORS: Record<string, string> = branches.reduce((acc, branch) => {
  acc[branch.slug] = branch.color;
  return acc;
}, {} as Record<string, string>);

export const getBranchColor = (slug: string) => BRANCH_COLORS[slug] || '#ffffff';
