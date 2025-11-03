import { useState } from 'react';
import { 
  createTopic, 
  updateTopic, 
  deleteTopic, 
  getTopics 
} from '@/api/endpoints/topics';
import type { 
  TopicsOutputDto, 
  AdminCreateTopicInputDto, 
  AdminUpdateTopicInputDto,
  PaginationUtil 
} from '@/api/types';

interface UseAdminTopicsReturn {
  loading: boolean;
  createTopicAction: (data: AdminCreateTopicInputDto) => Promise<void>;
  updateTopicAction: (topicId: number, data: AdminUpdateTopicInputDto) => Promise<void>;
  deleteTopicAction: (topicId: number) => Promise<void>;
  loadTopics: (params: { page?: number; size?: number; isRestricted?: boolean }) => Promise<PaginationUtil<TopicsOutputDto[]>>;
}

export const useAdminTopics = (): UseAdminTopicsReturn => {
  const [loading, setLoading] = useState(false);

  const createTopicAction = async (data: AdminCreateTopicInputDto): Promise<void> => {
    setLoading(true);
    try {
      await createTopic(data);
    } finally {
      setLoading(false);
    }
  };

  const updateTopicAction = async (
    topicId: number, 
    data: AdminUpdateTopicInputDto
  ): Promise<void> => {
    setLoading(true);
    try {
      await updateTopic(topicId, data);
    } finally {
      setLoading(false);
    }
  };

  const deleteTopicAction = async (topicId: number): Promise<void> => {
    setLoading(true);
    try {
      await deleteTopic(topicId);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (params: { 
    page?: number; 
    size?: number; 
    isRestricted?: boolean 
  }): Promise<PaginationUtil<TopicsOutputDto[]>> => {
    setLoading(true);
    try {
      return await getTopics(params);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createTopicAction,
    updateTopicAction,
    deleteTopicAction,
    loadTopics,
  };
};
