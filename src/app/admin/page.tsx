
import { getProjects, getCertificates, getPortfolioSettings, getAdminPassword } from '@/lib/data-fetch';
import AdminClient from './admin-client';

export default async function AdminPage() {
  const projects = await getProjects();
  const certificates = await getCertificates();
  const settings = await getPortfolioSettings();
  const adminPassword = await getAdminPassword();

  return (
    <AdminClient 
      initialProjects={projects} 
      initialCertificates={certificates} 
      initialSettings={settings}
      adminPassword={adminPassword}
    />
  );
}
