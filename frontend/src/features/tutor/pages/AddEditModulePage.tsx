import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createModule, fetchModuleById, updateModule } from '../services/CourseApi';
import type { Module } from '../../../types/module';
import type { AxiosError } from 'axios';

export default function AddEditModulePage() {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId?: string }>();
  const navigate = useNavigate();

  const isEditing = Boolean(moduleId);
  const [name, setName] = useState('');
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

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
    setLoading(true);
    try {
      if (isEditing) {
        await updateModule(courseId!, moduleId!, { name, order });
      } else {
        await createModule(courseId!, name, order);
      }
      navigate(`/tutor/courses/${courseId}/content`);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.message || 'Something went wrong');
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
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">Order</label>
          <input
            type="number"
            min={1}
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10))}
            className="w-full rounded border p-2"
          />
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
