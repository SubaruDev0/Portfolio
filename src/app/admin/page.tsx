
import { getProjects, getCertificates, getPortfolioSettings } from '@/lib/data-fetch';
import AdminClient from './admin-client';

export default async function AdminPage() {
  const projects = await getProjects();
  const certificates = await getCertificates();
  const settings = await getPortfolioSettings();

  return (
    <AdminClient 
      initialProjects={projects} 
      initialCertificates={certificates} 
      initialSettings={settings}
    />
  );
}
