import { DeveloperService } from '@/services/developer.service';
import DevelopersClient from './DevelopersClient';

export default async function DevelopersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;
  
  // Pass the search query to the service
  const developers = await DeveloperService.getAllDevelopers(q);

  return <DevelopersClient initialData={developers} />;
}