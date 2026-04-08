import { useEffect, useRef, useState } from "react";

export default function ENSOVideo() {
  const [videoData, setVideoData] = useState(null);
  const [audioSrc, setAudioSrc] = useState("");

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/enso-video")
      .then(res => res.json())
      .then(data => {
        setVideoData(data);
        setAudioSrc(data.languages[0].audioUrl);
      });
  }, []);

  const syncAudio = () => {
    if (audioRef.current && videoRef.current) {
      audioRef.current.currentTime = videoRef.current.currentTime;
    }
  };

  useEffect(() => {
    if (videoRef.current && audioRef.current) {
      videoRef.current.onplay = () => audioRef.current.play();
      videoRef.current.onpause = () => audioRef.current.pause();
    }
  }, []);

  if (!videoData) return <p>Loading video...</p>;

  return (
    <div>
      <video
        ref={videoRef}
        src={videoData.videoUrl}
        controls
        onTimeUpdate={syncAudio}
        style={{ width: "100%", borderRadius: "10px" }}
      />

      <select onChange={(e) => setAudioSrc(e.target.value)}>
        {videoData.languages.map((lang, i) => (
          <option key={i} value={lang.audioUrl}>
            {lang.lang}
          </option>
        ))}
      </select>

      <audio ref={audioRef} src={audioSrc} autoPlay />
    </div>
  );
}