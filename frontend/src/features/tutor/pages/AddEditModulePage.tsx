import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createModule, fetchModuleById, updateModule } from '../services/CourseApi';
import type { Module } from '../../../types/module';
import type { AxiosError } from 'axios';
import * as yup from 'yup';

type FieldErrors = Partial<Record<'name' | 'order', string>>;

const moduleSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Name is required')
    .max(15, 'Name must be at most 15 characters'),
  order: yup
    .number()
    .typeError('Order must be a number')
    .integer('Order must be an integer')
    .min(1, 'Order must be at least 1')
    .required('Order is required'),
});

export default function AddEditModulePage() {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId?: string }>();
  const navigate = useNavigate();

  const isEditing = Boolean(moduleId);
  const [name, setName] = useState('');
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!isEditing) return;
    setLoading(true);
    fetchModuleById(courseId!, moduleId!)
      .then((mod: Module) => {
        setName(mod.name);
        setOrder(mod.order);
      })
      .catch((err: unknown) => {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.message || 'Failed to load');
      })
      .finally(() => setLoading(false));
  }, [courseId, moduleId, isEditing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
      setError(undefined);
    setFieldErrors({});
    setLoading(true);
    try {
       const formData = { name, order };
      await moduleSchema.validate(formData, { abortEarly: false });
      if (isEditing) {
        await updateModule(courseId!, moduleId!, { name, order });
      } else {
        await createModule(courseId!, name, order);
      }
      navigate(`/tutor/courses/${courseId}/content`);
    } catch (err: unknown) {
 if (err instanceof yup.ValidationError) {
        const fe: FieldErrors = {};
        err.inner.forEach((e) => {
          if (e.path && !fe[e.path as keyof FieldErrors]) {
            fe[e.path as keyof FieldErrors] = e.message;
          }
        });
        setFieldErrors(fe);
      } else {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl">{isEditing ? 'Edit Module' : 'Add Module'}</h1>

      {error && <p className="mb-2 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block">Name</label>
          <input
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (fieldErrors.name) setFieldErrors((s) => ({ ...s, name: undefined }));
            }}
            // className="w-full rounded border p-2"
             aria-invalid={!!fieldErrors.name}
            className={`w-full rounded border p-2 ${
              fieldErrors.name ? 'border-red-500 focus:outline-red-500' : ''
            }`}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
          )}
        
        </div>

        <div>
          <label className="mb-1 block">Order</label>
          <input
            type="number"
            min={1}
            value={Number.isNaN(order) ? '' : order}
            onChange={(e) => {
              const v = e.target.value;
              setOrder(v === '' ? NaN : parseInt(v, 10));
              if (fieldErrors.order) setFieldErrors((s) => ({ ...s, order: undefined }));
            }}
            aria-invalid={!!fieldErrors.order}
            className={`w-full rounded border p-2 ${
              fieldErrors.order ? 'border-red-500 focus:outline-red-500' : ''
            }`}
          />
          {fieldErrors.order && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.order}</p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isEditing ? 'Update' : 'Create'} Module
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded bg-gray-300 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
