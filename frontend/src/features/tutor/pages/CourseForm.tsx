


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [formData, setFormData] = useState({
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
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [previewDemoUrl, setPreviewDemoUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCourseById(id)
      .then((c: ICourse) => {
        setFormData({
          title: c.title,
          code: c.code,
          semester: c.semester.toString(),
          price: c.price.toString(),
          offer: c.offer?.toString() || "",
          actualPrice: c.actualPrice?.toString() || "",
          details: c.details || "",
        });
        setPreviewUrl(c.thumbnail);
        setPreviewDemoUrl(c.demoVideoUrl);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
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
        title: formData.title,
        code: formData.code,
        semester: Number(formData.semester),
        price: Number(formData.price),
        offer: formData.offer ? Number(formData.offer) : undefined,
        actualPrice: formData.actualPrice ? Number(formData.actualPrice) : undefined,
        details: formData.details || undefined,
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6 mt-6">
      <h1 className="text-3xl font-bold text-gray-800">{id ? "Edit Course" : "Add Course"}</h1>

      {error && <div className="text-red-600 font-medium">{error}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Course Title"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <input
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Course Code"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <input
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          placeholder="Semester"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <input
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <input
          name="offer"
          value={formData.offer}
          onChange={handleChange}
          placeholder="Offer (Optional)"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <input
          name="actualPrice"
          value={formData.actualPrice}
          onChange={handleChange}
          placeholder="Actual Price (Optional)"
          className="w-full border px-4 py-2 rounded-lg"
        />
      </div>

      <textarea
        name="details"
        value={formData.details}
        onChange={handleChange}
        placeholder="Course Details"
        rows={4}
        className="w-full border px-4 py-2 rounded-lg"
      />

      <div>
        <label className="font-semibold">Upload Thumbnail</label>
        <input type="file" accept="image/*" onChange={(e) => {
          if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
          }
        }} />
        {previewUrl && (
          <img src={previewUrl} alt="Thumbnail" className="mt-2 w-48 rounded border" />
        )}
      </div>

      <div>
        <label className="font-semibold">Upload Demo Video</label>
        <input type="file" accept="video/*" onChange={(e) => {
          if (e.target.files?.[0]) {
            setDemoFile(e.target.files[0]);
            setPreviewDemoUrl(URL.createObjectURL(e.target.files[0]));
          }
        }} />
        {previewDemoUrl && (
          <video src={previewDemoUrl} controls className="mt-2 w-full max-w-md border rounded" />
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : id ? "Update Course" : "Create Course"}
        </button>
        <button
          onClick={() => navigate("/tutor/courses")}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
