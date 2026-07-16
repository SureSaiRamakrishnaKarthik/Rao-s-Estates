import { ProjectService } from '@/services/project.service';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;
  
  const projects = await ProjectService.getAllProjects(q);

  return <ProjectsClient initialData={projects} />;
}