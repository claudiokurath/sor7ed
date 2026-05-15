import { branches } from './constants';

export const BRANCH_COLORS: Record<string, string> = branches.reduce((acc, branch) => {
  acc[branch.slug] = branch.color;
  return acc;
}, {} as Record<string, string>);

export const BRANCH_NAME_COLORS: Record<string, string> = branches.reduce((acc, branch) => {
  acc[branch.name] = branch.color;
  return acc;
}, {} as Record<string, string>);

export const getBranchColor = (id: string) => 
  BRANCH_COLORS[id] || 
  BRANCH_NAME_COLORS[id] || 
  BRANCH_COLORS[id.toLowerCase().replace(/\s+/g, '-')] || 
  '#ffffff';
