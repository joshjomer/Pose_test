import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils
  } from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";   

  let poseLandmarker = undefined;
  let enableWebcamButton = undefined;
  let runningMode = "VIDEO";
  const videoHeight = "360px";
  const videoWidth = "480px";
  
  const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
        delegate: "GPU"
      },
      runningMode: runningMode,
      numPoses: 2
    });
    
  };
  createPoseLandmarker();
  


const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const drawingUtils = new DrawingUtils(canvasCtx);


//const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;



// If webcam supported, add event listener to button for when user
// wants to activate it.
//if (hasGetUserMedia()) {
//    enableWebcamButton = document.getElementById("webcamButton");
//    enableWebcamButton.addEventListener("click", enableCam);
//  } else {
//    console.warn("getUserMedia() is not supported by your browser");
//  }  



// Enable the live webcam view and start detection.
//function enableCam(event) {
  
    // getUsermedia parameters.
    const constraints = {
      video: true
    };
  
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
      video.addEventListener("loadeddata", predictWebcam);
    });
  //}
  


  
let lastVideoTime = -1;
async function predictWebcam() {
  canvasElement.style.height = videoHeight;
  video.style.height = videoHeight;
  canvasElement.style.width = videoWidth;
  video.style.width = videoWidth;
  // Now let's start detecting the stream.
  //if (runningMode === "IMAGE") {
  //  runningMode = "VIDEO";
  //  await poseLandmarker.setOptions({ runningMode: "VIDEO" });
  //}
  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      console.log(result.landmarks);  
      for (const landmark of result.landmarks) {
        /*drawingUtils.drawLandmarks(landmark, {
          radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1)
        }); */
        drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
      }
      canvasCtx.restore();
    });
  }

  // Call this function again to keep predicting when the browser is ready.
  //if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  //}
}
