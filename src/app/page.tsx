
import { getProjects, getCertificates, getPortfolioSettings } from '@/lib/data-fetch';
import HomeClient from './page-client';

export default async function Page() {
  const projects = await getProjects();
  const certificates = await getCertificates();
  const settings = await getPortfolioSettings();

  return (
    <HomeClient 
      initialProjects={projects} 
      initialCertificates={certificates} 
      initialSettings={settings}
    />
  );
}
