import { useQuery } from '@tanstack/react-query';

import { listVideoProviders } from '../state/mockService';

const useVideoProviders = () => {
  return useQuery({
    queryKey: ['video-providers'],
    queryFn: listVideoProviders,
    initialData: [],
  });
};

export default useVideoProviders;
