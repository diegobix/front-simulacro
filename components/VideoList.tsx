import { FunctionComponent } from "preact";
import { VideoType } from "../types.ts";
import VideoItem from "./VideoItem.tsx";

type Props = {
  videos: VideoType[];
  userid: string;
};

const VideoList: FunctionComponent<Props> = ({ videos, userid }) => {
  return (
    <div class="video-list-container">
      {videos.map((video) => (
        <VideoItem userid={userid} video={video} key={video.id} />
      ))}
    </div>
  );
};

export default VideoList;
