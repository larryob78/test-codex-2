import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

import { Frame } from '../state/types';

const useFrameMutations = (projectId: string) => {
  const client = useQueryClient();

  const createFrame = useMutation({
    mutationFn: async () => {
      const frame: Frame = {
        id: uuid(),
        project_id: projectId,
        frame_number: Date.now(),
        prompt: 'Describe the action in the scene.',
        sketch: {},
        metadata: {},
        selected_characters: [],
        selected_locations: [],
        selected_props: [],
      };
      const response = await axios.post(`/api/projects/${projectId}/frames`, frame);
      return response.data as Frame;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });

  return {
    createFrame: () => createFrame.mutateAsync(),
  };
};

export default useFrameMutations;
