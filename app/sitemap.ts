import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sor7ed.com';
  
  const branches = [
    'keep-going',
    'feel-good',
    'spend-smart',
    'be-connected',
    'plan-ahead',
    'be-yourself',
    'level-up'
  ];

  const branchUrls = branches.map((branch) => ({
    url: `${baseUrl}/${branch}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...branchUrls,
  ];
}
