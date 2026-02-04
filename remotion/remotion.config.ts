import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(50);
Config.setCodec("h264");

export default {
  codec: "h264",
  height: 1920,
  width: 1080,
  fps: 30,
  durationInFrames: 450, // 15 seconds at 30fps
  defaultCodec: "h264",
};
