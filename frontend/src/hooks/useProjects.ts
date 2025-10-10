import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  frames?: string[];
  updated_at: string;
}

const fetchProjects = async (): Promise<ProjectSummary[]> => {
  const response = await axios.get<ProjectSummary[]>('/api/projects');
  return response.data;
};

const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    initialData: [],
  });
};

export default useProjects;
