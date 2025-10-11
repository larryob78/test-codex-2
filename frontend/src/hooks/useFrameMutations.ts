import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createFrame as createFrameEntry } from '../state/mockService';

const useFrameMutations = (projectId: string) => {
  const client = useQueryClient();

  const createFrame = useMutation({
    mutationFn: () => createFrameEntry(projectId),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });

  return {
    createFrame: () => createFrame.mutateAsync(),
  };
};

export default useFrameMutations;
