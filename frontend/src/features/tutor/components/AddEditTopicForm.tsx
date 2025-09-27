import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTopic, getTopicById, updateTopic } from '../services/CourseApi';
import type { TopicForm } from '../../../types/topic';
import * as yup from "yup"
type Field = 'order' | 'title' | 'description';
type FieldErrors = Partial<Record<Field, string>>;

const topicSchema = yup.object({
  order: yup
    .number()
    .typeError('Order must be a number')
    .integer('Order must be an integer')
    .min(1, 'Order must be at least 1')
    .required('Order is required'),
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .max(15, 'Title must be at most 15 characters'),
  description: yup
    .string()
    .trim()
    .max(2000, 'Description must be at most 2000 characters')
    .optional(),
});


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

   const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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
     if (fieldErrors[name as Field]) {
      setFieldErrors((s) => ({ ...s, [name]: undefined }));
    }
    if (serverError) setServerError(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleId) return;
setServerError(undefined);
    setFieldErrors({});
    setLoading(true);
    // if (topicId) {
    //   await updateTopic(topicId, form);
    // } else {
    //   await createTopic(moduleId, form);
    // }

    // if (onSuccess) onSuccess();
    // else navigate(-1);
    try {
      // ✅ validate first (collect all errors)
      await topicSchema.validate(form, { abortEarly: false });

      if (topicId) {
        await updateTopic(topicId, form);
      } else {
        await createTopic(moduleId, form);
      }

      onSuccess ? onSuccess() : navigate(-1);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fe: FieldErrors = {};
        err.inner.forEach((e) => {
          if (e.path && !fe[e.path as Field]) fe[e.path as Field] = e.message;
        });
        setFieldErrors(fe);
      } else {
        setServerError((err as Error).message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // <form onSubmit={handleSubmit} className="space-y-4">
    //   <input
    //     type="number"
    //     name="order"
    //     value={form.order}
    //     onChange={handleChange}
    //     placeholder="Order"
    //     required
    //     className="w-full rounded border p-2"
    //   />
    //   <input
    //     type="text"
    //     name="title"
    //     value={form.title}
    //     onChange={handleChange}
    //     placeholder="Title"
    //     required
    //     className="w-full rounded border p-2"
    //   />
    //   <textarea
    //     name="description"
    //     value={form.description}
    //     onChange={handleChange}
    //     placeholder="Description (optional)"
    //     className="w-full rounded border p-2"
    //   />
    //   <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white">
    //     {topicId ? 'Update Topic' : 'Create Topic'}
    //   </button>
    // </form>
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {serverError && (
        <p className="rounded border border-red-200 bg-red-50 p-2 text-red-700">
          {serverError}
        </p>
      )}

      <div>
        <input
          type="number"
          name="order"
          min={1}
          value={Number.isNaN(form.order as number) ? '' : form.order}
          onChange={handleChange}
          placeholder="Order"
          required
          aria-invalid={!!fieldErrors.order}
          className={`w-full rounded border p-2 ${
            fieldErrors.order ? 'border-red-500 focus:outline-red-500' : ''
          }`}
        />
        {fieldErrors.order && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.order}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          aria-invalid={!!fieldErrors.title}
          className={`w-full rounded border p-2 ${
            fieldErrors.title ? 'border-red-500 focus:outline-red-500' : ''
          }`}
        />
        {fieldErrors.title && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
        )}
      </div>

      <div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          aria-invalid={!!fieldErrors.description}
          className={`w-full rounded border p-2 ${
            fieldErrors.description ? 'border-red-500 focus:outline-red-500' : ''
          }`}
        />
        {fieldErrors.description && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {topicId ? 'Update Topic' : 'Create Topic'}
      </button>
    </form>
  );
}
