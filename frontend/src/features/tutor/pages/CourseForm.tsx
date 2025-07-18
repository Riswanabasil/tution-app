import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseById,
  getUploadUrl,
  createCourse,
  updateCourse,
  getDemoUploadUrl,
} from "../services/TutorApi";
import type { ICourse } from "../../../types/course";
import type { CoursePayload } from "../services/TutorApi";
import type { AxiosError } from "axios";
export default function AddEditCoursePage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    code: "",
    semester: "",
    price: "",
    offer: "",
    actualPrice: "",
    details: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [demoFile, setDemoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [previewDemoUrl, setPreviewDemoUrl] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCourseById(id)
      .then((c: ICourse) => {
        setForm({
          title: c.title,
          code: c.code,
          semester: String(c.semester),
          price: String(c.price),
          offer: String(c.offer ?? ""),
          actualPrice: String(c.actualPrice ?? ""),
          details: c.details ?? "",
        });
        if (c.thumbnail) {
          setPreviewUrl(c.thumbnail);
        }
        if (c.demoVideoUrl) {
          setPreviewDemoUrl(c.demoVideoUrl);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const f = e.target.files[0];
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const handleDemoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const f = e.target.files[0];
    setDemoFile(f);
    const url = URL.createObjectURL(f);
    setPreviewDemoUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageKey: string | undefined;
      let demoKey: string | undefined;

      if (file) {
        const { uploadUrl, key } = await getUploadUrl(file.name, file.type);
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        imageKey = key;
      }

      if (demoFile) {
        const { uploadUrl, key } = await getDemoUploadUrl(
          demoFile.name,
          demoFile.type
        );
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": demoFile.type },
          body: demoFile,
        });
        demoKey = key;
      }
      const payload: CoursePayload = {
        title: form.title,
        code: form.code,
        semester: Number(form.semester),
        price: Number(form.price),
        offer: form.offer ? Number(form.offer) : undefined,
        actualPrice: form.actualPrice ? Number(form.actualPrice) : undefined,
        details: form.details || undefined,
        imageKey,
        demoKey,
      };

      if (id) {
        await updateCourse(id, payload);
      } else {
        await createCourse(payload);
      }

      navigate("/tutor/courses");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4">{id ? "Edit Course" : "Add Course"}</h1>

      {error && <div className="mb-4 text-red-600">Error: {error}</div>}

      {loading && !id ? (
        <p>Loading…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="border p-2 rounded"
            />
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Code"
              required
              className="border p-2 rounded"
            />
            <input
              name="semester"
              type="number"
              value={form.semester}
              onChange={handleChange}
              placeholder="Semester"
              className="border p-2 rounded"
            />
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded"
            />
            <input
              name="offer"
              type="number"
              value={form.offer}
              onChange={handleChange}
              placeholder="Offer"
              className="border p-2 rounded"
            />
            <input
              name="actualPrice"
              type="number"
              value={form.actualPrice}
              onChange={handleChange}
              placeholder="Actual Price"
              className="border p-2 rounded"
            />
          </div>

          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            placeholder="Details"
            rows={3}
            className="w-full border p-2 rounded"
          />

          <div>
            <label className="block mb-1">Thumbnail:</label>
            <input type="file" accept="image/*" onChange={handleFile} />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 max-w-xs border"
              />
            )}
          </div>
          <div>
            <label className="block mb-1">Demo:</label>
            <input type="file" accept="video/*" onChange={handleDemoFile} />
            {previewDemoUrl && (
              <video
                src={previewDemoUrl}
                controls
                className="mt-2 max-w-xs border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading
              ? id
                ? "Updating…"
                : "Saving…"
              : id
              ? "Update Course"
              : "Create Course"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/tutor/courses")}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
