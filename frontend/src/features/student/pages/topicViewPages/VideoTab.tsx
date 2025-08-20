// import useTopicId from "../../../../hooks/useTopicId";
// import useStudentVideos from "../../../../hooks/useStudentVideos";
// import { useState } from "react";
// import { Dialog, DialogContent, DialogTitle, Button } from "@mui/material";
// import VideoPlayerWithProgress from "./VideoPlayerWithProgress";

// export default function VideoTab() {
//   const topicId = useTopicId();
//   const { videos, loading } = useStudentVideos(topicId);
//   const [open, setOpen] = useState(false);
//   const [idx, setIdx] = useState<number | null>(null);

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Recorded Videos</h2>
//       {loading ? "Loading…" : (
//         <div className="grid gap-4">
//           {videos.map((v, i) => (
//             <div key={v._id} className="border rounded-xl p-4 bg-white flex items-center justify-between">
//               <div>
//                 <div className="font-semibold">{v.title}</div>
//                 <div className="text-sm text-slate-500">
//                   {Math.floor(v.durationSec/60)}m {v.durationSec%60}s • {v.progress.completed ? "Completed" : `${v.progress.percent}% watched`}
//                 </div>
//               </div>
//               <Button onClick={() => { setIdx(i); setOpen(true); }} variant="contained">Watch</Button>
//             </div>
//           ))}
//         </div>
//       )}

//       <Dialog open={open} onClose={() => { setOpen(false); setIdx(null); }} fullWidth maxWidth="md">
//         <DialogTitle>{idx!=null ? videos[idx].title : ""}</DialogTitle>
//         <DialogContent>
//           {idx!=null && (
//             <VideoPlayerWithProgress
//               videoId={videos[idx]._id}
//               src={videos[idx].url}
//               durationSecFromDb={videos[idx].durationSec}
//               resumeAt={videos[idx].progress.lastPositionSec}
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

import useTopicId from "../../../../hooks/useTopicId";
import useStudentVideos from "../../../../hooks/useStudentVideos";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, Button, Skeleton, Chip } from "@mui/material";
import { PlayArrow, CheckCircle, Schedule } from "@mui/icons-material";
import VideoPlayerWithProgress from "./VideoPlayerWithProgress";

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
    if (percent === 100) return "success";
    if (percent >= 70) return "warning";
    return "primary";
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <Skeleton variant="text" width={200} height={40} />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
    <div className="p-6 max-w-5xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Recorded Videos
        </h2>
        <p className="text-slate-600">Continue your learning journey</p>
      </div>

      {/* Videos Grid */}
      <div className="space-y-4">
        {videos.map((v, i) => (
          <div 
            key={v._id} 
            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {/* Video Thumbnail/Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <PlayArrow className="text-blue-600 text-2xl" />
                </div>
                
                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-1">
                    {v.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-sm text-slate-500">
                      <Schedule className="w-4 h-4 mr-1" />
                      {formatDuration(v.durationSec)}
                    </div>
                    
                    <Chip
                      icon={v.progress.completed ? <CheckCircle /> : <Schedule />}
                      label={v.progress.completed ? "Completed" : `${v.progress.percent}% watched`}
                      size="small"
                      color={v.progress.completed ? "success" : getProgressColor(v.progress.percent)}
                      variant={v.progress.completed ? "filled" : "outlined"}
                    />
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
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
                onClick={() => { setIdx(i); setOpen(true); }} 
                variant="contained"
                startIcon={<PlayArrow />}
                className="ml-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
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
        onClose={() => { setOpen(false); setIdx(null); }} 
        fullWidth 
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
          }
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
          {idx !== null ? videos[idx].title : ""}
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