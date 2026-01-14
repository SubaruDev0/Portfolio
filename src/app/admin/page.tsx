
import { getProjects, getCertificates } from '@/lib/data-fetch';
import AdminClient from './admin-client';

export default async function AdminPage() {
  const projects = await getProjects();
  const certificates = await getCertificates();

  return <AdminClient initialProjects={projects} initialCertificates={certificates} />;
}
