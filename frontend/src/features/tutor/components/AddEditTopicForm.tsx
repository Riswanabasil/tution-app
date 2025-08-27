import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTopic, getTopicById, updateTopic } from '../services/CourseApi';
import type { TopicForm } from '../../../types/topic';

interface Props {
  topicId?: string;
  onSuccess?: () => void;
}

export default function AddEditTopicForm({ topicId, onSuccess }: Props) {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<TopicForm>({
    order: 1,
    title: '',
    description: '',
  });

  useEffect(() => {
    if (topicId) {
      getTopicById(topicId).then((data) => {
        setForm({
          order: data.order,
          title: data.title,
          description: data.description ?? '',
        });
      });
    }
  }, [topicId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'order' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleId) return;

    if (topicId) {
      await updateTopic(topicId, form);
    } else {
      await createTopic(moduleId, form);
    }

    if (onSuccess) onSuccess();
    else navigate(-1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="number"
        name="order"
        value={form.order}
        onChange={handleChange}
        placeholder="Order"
        required
        className="w-full rounded border p-2"
      />
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="w-full rounded border p-2"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description (optional)"
        className="w-full rounded border p-2"
      />
      <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white">
        {topicId ? 'Update Topic' : 'Create Topic'}
      </button>
    </form>
  );
}
