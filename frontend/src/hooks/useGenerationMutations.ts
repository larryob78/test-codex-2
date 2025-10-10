import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { GenerationSettingsInput } from '../state/types';

const useGenerationMutations = (frameId?: string, projectId?: string) => {
  const client = useQueryClient();

  const invalidateRelatedQueries = () => {
    if (frameId) {
      client.invalidateQueries({ queryKey: ['generations', frameId] });
    }
    if (projectId) {
      client.invalidateQueries({ queryKey: ['project', projectId] });
    }
  };

  const generate = useMutation({
    mutationFn: async (settings: GenerationSettingsInput) => {
      if (!frameId) return [];
      const payload = {
        mode: settings.mode,
        iterations: settings.iterations ?? (settings.mode === 'turbo' ? 4 : 2),
        style_strength: 75,
        prompt_weight: 80,
        aspect_ratio: '16:9',
      };
      const response = await axios.post(`/api/frames/${frameId}/generate`, payload);
      return response.data;
    },
    onSuccess: () => {
      invalidateRelatedQueries();
    },
  });

  const confirm = useMutation({
    mutationFn: async (generationId: string) => {
      const response = await axios.post(`/api/generations/${generationId}/confirm`);
      return response.data;
    },
    onSuccess: () => {
      invalidateRelatedQueries();
    },
  });

  return {
    generate: (settings: GenerationSettingsInput) => generate.mutateAsync(settings),
    confirm: (generationId: string) => confirm.mutateAsync(generationId),
    isGenerating: generate.isPending,
    isConfirming: confirm.isPending,
  };
};

export default useGenerationMutations;
