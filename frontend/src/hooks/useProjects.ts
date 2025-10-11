import { useQuery } from '@tanstack/react-query';

import { listProjectSummaries } from '../state/mockService';
import { ProjectSummary } from '../state/types';

const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: listProjectSummaries,
    initialData: [],
  });
};

export default useProjects;
