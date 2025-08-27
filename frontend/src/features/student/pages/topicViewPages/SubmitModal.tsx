import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  Typography,
} from '@mui/material';
import {
  submitAssignmentResponse,
  updateAssignmentResponse,
  getSubmissionUploadUrl,
  fetchSubmissionByAssignment,
} from '../../services/CourseApi';
import type { Assignment } from '../../../../types/assignment';
import { toast } from 'react-toastify';

type Props = {
  open: boolean;
  onClose: () => void;
  assignment: Assignment;
  topicId: string;
};

export default function SubmitModal({ open, onClose, assignment, topicId }: Props) {
  const [responseText, setResponseText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState('');
  const [uploading, setUploading] = useState(false);
  const [existingFileUrl, setExistingFileUrl] = useState('');

  const isViewOnly = assignment.status === 'verified';
  const isEditMode = assignment.status === 'pending';

  useEffect(() => {
    if (assignment.status === 'verified' || assignment.status === 'pending') {
      fetchSubmissionByAssignment(assignment._id).then((res) => {
        setResponseText(res.response || '');
        setFileKey(res.fileKey || '');
        setExistingFileUrl(res.fileUrl || '');
      });
    } else {
      setResponseText('');
      setFile(null);
      setFileKey('');
      setExistingFileUrl('');
    }
  }, [assignment]);

  const uploadFileToS3 = async (file: File): Promise<string> => {
    setUploading(true);
    const { uploadUrl, key } = await getSubmissionUploadUrl(file.name, file.type);
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    setUploading(false);
    return key;
  };

  const handleSubmit = async () => {
    try {
      let uploadedKey = fileKey;

      if (file) {
        uploadedKey = await uploadFileToS3(file);
      }

      const payload = {
        response: responseText,
        fileKey: uploadedKey,
        topicId,
      };

      if (isEditMode) {
        await updateAssignmentResponse(assignment._id, payload);
        toast.success('Submission updated successfully 🎉');
      } else {
        await submitAssignmentResponse(assignment._id, payload);
        toast.success('Assignment submitted successfully 🎉');
      }

      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Submission failed. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {assignment.status === 'not submitted'
          ? 'Submit Assignment'
          : isEditMode
            ? 'Edit Submission'
            : 'Feedback'}
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label={isViewOnly ? 'Feedback' : 'Your Response'}
          multiline
          rows={5}
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          disabled={isViewOnly}
          margin="normal"
        />

        {existingFileUrl && (
          <div className="mb-2 mt-2">
            <Typography variant="subtitle2">Current File:</Typography>
            <a
              href={existingFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View File
            </a>
          </div>
        )}

        {!isViewOnly && (
          <div className="mt-4">
            <InputLabel>{existingFileUrl ? 'Replace File' : 'Upload File (optional)'}</InputLabel>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={uploading}
            />
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {!isViewOnly && (
          <Button onClick={handleSubmit} disabled={uploading} variant="contained">
            {uploading ? 'Uploading...' : isEditMode ? 'Update' : 'Submit'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
