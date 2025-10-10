import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ProjectDetail } from '../state/types';

const fetchProject = async (projectId: string): Promise<ProjectDetail> => {
  const response = await axios.get<ProjectDetail>(`/api/projects/${projectId}`);
  return response.data;
};

const useProjectDetail = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId),
    enabled: Boolean(projectId),
  });
};

export default useProjectDetail;
