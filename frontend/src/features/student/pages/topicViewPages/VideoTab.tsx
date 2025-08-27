import useTopicId from '../../../../hooks/useTopicId';
import useStudentVideos from '../../../../hooks/useStudentVideos';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, Skeleton, Chip } from '@mui/material';
import { PlayArrow, CheckCircle, Schedule } from '@mui/icons-material';
import VideoPlayerWithProgress from './VideoPlayerWithProgress';

export default function VideoTab() {
  const topicId = useTopicId();
  const { videos, loading } = useStudentVideos(topicId);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState<number | null>(null);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getProgressColor = (percent: number) => {
    if (percent === 100) return 'success';
    if (percent >= 70) return 'warning';
    return 'primary';
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-8">
          <Skeleton variant="text" width={200} height={40} />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} className="mt-2" />
                </div>
                <Skeleton variant="rectangular" width={100} height={36} className="rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
          Recorded Videos
        </h2>
        <p className="text-slate-600">Continue your learning journey</p>
      </div>

      {/* Videos Grid */}
      <div className="space-y-4">
        {videos.map((v, i) => (
          <div
            key={v._id}
            className="group transform rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-1 items-start space-x-4">
                {/* Video Thumbnail/Icon */}
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 transition-transform duration-300 group-hover:scale-105">
                  <PlayArrow className="text-2xl text-blue-600" />
                </div>

                {/* Video Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-gray-900">
                    {v.title}
                  </h3>

                  <div className="mb-3 flex items-center space-x-4">
                    <div className="flex items-center text-sm text-slate-500">
                      <Schedule className="mr-1 h-4 w-4" />
                      {formatDuration(v.durationSec)}
                    </div>

                    <Chip
                      icon={v.progress.completed ? <CheckCircle /> : <Schedule />}
                      label={v.progress.completed ? 'Completed' : `${v.progress.percent}% watched`}
                      size="small"
                      color={
                        v.progress.completed ? 'success' : getProgressColor(v.progress.percent)
                      }
                      variant={v.progress.completed ? 'filled' : 'outlined'}
                    />
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        v.progress.completed
                          ? 'bg-gradient-to-r from-green-400 to-green-500'
                          : 'bg-gradient-to-r from-blue-400 to-purple-500'
                      }`}
                      style={{ width: `${v.progress.percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Watch Button */}
              <Button
                onClick={() => {
                  setIdx(i);
                  setOpen(true);
                }}
                variant="contained"
                startIcon={<PlayArrow />}
                className="ml-6 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                sx={{
                  background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
                  },
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                }}
              >
                {v.progress.completed ? 'Rewatch' : 'Continue'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Dialog */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setIdx(null);
        }}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.25rem',
          }}
        >
          {idx !== null ? videos[idx].title : ''}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {idx !== null && (
            <VideoPlayerWithProgress
              videoId={videos[idx]._id}
              src={videos[idx].url}
              durationSecFromDb={videos[idx].durationSec}
              resumeAt={videos[idx].progress.lastPositionSec}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
