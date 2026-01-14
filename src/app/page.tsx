
import { getProjects, getCertificates } from '@/lib/data-fetch';
import HomeClient from './page-client';

export default async function Page() {
  const projects = await getProjects();
  const certificates = await getCertificates();

  return <HomeClient initialProjects={projects} initialCertificates={certificates} />;
}
