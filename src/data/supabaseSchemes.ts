import { supabase } from '../lib/supabase';
import { SchemeItem } from '../types';
import { SCHEMES_DATA } from './schemesData';

type SupabaseSchemeRow = {
  id: number | string;
  name: string | null;
  state: string | null;
  category: string | null;
  description: string | null;
  eligibility: string | null;
  benefits: string | null;
  required_documents: string | null;
  application_url: string | null;
  official_source_url: string | null;
};

const normalizeName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '');

const toStringArray = (value: unknown): string[] => {
  if (typeof value !== 'string') {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }
    return [];
  }

  if (!value.trim()) return [];

  return value
    .split(/\r?\n|;|•|\u2022/)
    .map((item) => item.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
};
const normalizeCategory = (
  value: string | null,
): SchemeItem['category'] => {
  const category = (value || '').toLowerCase().trim();

  const aliases: Record<string, SchemeItem['category']> = {
    agriculture: 'agriculture',
    women: 'women',
    education: 'education',
    scholarship: 'scholarship',
    scholarships: 'scholarship',
    employment: 'employment',
    health: 'health',
    housing: 'housing',
    finance: 'finance',
    financial: 'finance',
    'financial assistance': 'finance',
    central: 'central',
    state: 'state',
  };

  return aliases[category] || 'central';
};

const findLocalScheme = (name: string) => {
  const normalized = normalizeName(name);

  return SCHEMES_DATA.find((scheme) => {
    const localName = normalizeName(scheme.title);
    return (
      localName === normalized ||
      localName.includes(normalized) ||
      normalized.includes(localName)
    );
  });
};

const mapSupabaseScheme = (row: SupabaseSchemeRow): SchemeItem => {
  const name = row.name?.trim() || `Government Scheme ${row.id}`;
  const localScheme = findLocalScheme(name);
  const state = row.state?.trim() || '';
  const officialUrl =
    row.official_source_url?.trim() ||
    row.application_url?.trim() ||
    '';

  const tags = [
    ...(localScheme?.tags || []),
    ...(state.toLowerCase() === 'central'
      ? ['Central Government']
      : state
        ? [`${state} Government`]
        : []),
  ];

  return {
    id: localScheme?.id || `supabase-${row.id}`,
    title: name,
    nativeTitle: localScheme?.nativeTitle,
    category: normalizeCategory(row.category),
    stateName:
      state && state.toLowerCase() !== 'central' ? state : undefined,
    tags: [...new Set(tags)],
    summary: row.description?.trim() || '',
    benefits: row.benefits?.trim() || '',
    eligibility: toStringArray(row.eligibility),
    documentsRequired: toStringArray(row.required_documents),
    applicationProcess: localScheme?.applicationProcess || [],
    sourceName: officialUrl
      ? 'Official Government Source'
      : 'Government Scheme Database',
    officialUrl,
    deadline: localScheme?.deadline,
  };
};

export const fetchGovernmentSchemes = async (): Promise<SchemeItem[]> => {
  const { data, error } = await supabase
    .from('government_schemes')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data || []) as SupabaseSchemeRow[]).map(mapSupabaseScheme);
};
