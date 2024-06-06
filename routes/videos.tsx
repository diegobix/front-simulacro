import { Handlers, PageProps } from "$fresh/server.ts";
import VideoList from "../components/VideoList.tsx";
import { State, VideoType } from "../types.ts";

type Data = {
  videos: VideoType[];
};

type ApiRes = VideoType[];

export const handler: Handlers<Data, State> = {
  GET: async (req, ctx) => {
    const userId = ctx.state.id;
    const res = await fetch(`https://videoapp-api.deno.dev/videos/${userId}`);
    if (!res.ok) {
      return new Response(null, { status: 500 });
    }
    const videos = await res.json() as ApiRes;
    return ctx.render({ videos });
  },
};

export default (props: PageProps<Data, State>) => {
  const videos = props.data.videos;
  return (
    <div class="video-page-container">
      <h1 class="video-list-title">
        Curso Deno Fresh
      </h1>
      <VideoList videos={videos} userid={props.state.id} />
    </div>
  );
};
