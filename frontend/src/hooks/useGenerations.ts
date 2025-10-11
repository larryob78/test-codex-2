import { useQuery } from '@tanstack/react-query';

import { listGenerations } from '../state/mockService';

const useGenerations = (frameId: string | null) => {
  return useQuery({
    queryKey: ['generations', frameId],
    queryFn: () => listGenerations(frameId ?? ''),
    enabled: Boolean(frameId),
    initialData: [],
  });
};

export default useGenerations;
