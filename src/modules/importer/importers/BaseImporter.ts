import { ParsedProject } from '../types';

export interface BaseImporter {
  sourceUrl: string;
  
  /**
   * Fetches the remote data and parses it into the raw ParsedProject format.
   * Does NOT normalize the data yet.
   */
  parse(): Promise<ParsedProject[]>;
}
