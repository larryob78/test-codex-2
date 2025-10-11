import { useQuery } from '@tanstack/react-query';

import { getProjectDetail } from '../state/mockService';

const useProjectDetail = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectDetail(projectId),
    enabled: Boolean(projectId),
  });
};

export default useProjectDetail;
