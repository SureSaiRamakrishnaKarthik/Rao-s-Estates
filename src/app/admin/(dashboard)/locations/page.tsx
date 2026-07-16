import { LocationService } from '@/services/location.service';
import LocationsClient from './LocationsClient';

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;
  
  const locations = await LocationService.getAllLocations(q);

  return <LocationsClient initialData={locations} />;
}