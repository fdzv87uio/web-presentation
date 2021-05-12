import React, { useEffect, useRef, useState } from "react"
// Netpose tensor flow dependencies
import * as tf from "@tensorflow/tfjs"
import * as posenet from "@tensorflow-models/posenet"
import "@tensorflow/tfjs-backend-webgl"
// import { Camera } from "react-camera-pro"
import { Camera } from "react-cam"
import * as S from "../styles/pose_estimation.styles"
import WelcomePages from "../layouts/WelcomePages"
import { observer } from "mobx-react"
// import UserStore from "../stores/UserStore"
import { drawKeypoints } from "../utils/tensorflow-utils"


const PoseEstimation = observer(() => {
  // refs for both the webcam and canvas components
  const camRef = useRef(null)
  const canvasRef = useRef(null)
  // Gyroscope coordinates
  // const [alpha, setAlpha] = useState()
  // const [beta, setBeta] = useState()
  // const [gamma, setGamma] = useState()

  // current image hook

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined" 
    ) {
      runPosenet()
      
    }
  }, [])
  // //load rotation coordinates

  // // // load and run posenet function

  async function runPosenet(){
    const net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: 257,
      multiplier: 0.5,
    })

    setInterval(() => {
      detect(net)
    }, 500)
  }

  const detect = async net => {
    if (
      typeof camRef.current !== "undefined" &&
      camRef.current !== null &&
      typeof camRef.current.camRef.current !== "undefined" &&
      camRef.current.camRef.current.readyState === 4
    ) {
      // Get Video Properties
      const video = camRef.current.camRef.current
      const videoWidth = 350
      const videoHeight = 350

      // Make detections
      const pose = await net.estimateSinglePose(video)
      console.log(pose)
      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef)
    }
  }

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d")
    canvas.current.width = videoWidth
    canvas.current.height = videoHeight

    var kp = pose["keypoints"]
    drawKeypoints(kp, 0.35, ctx)
  }

  function capture(imgSrc) {
    console.log(imgSrc)
  }


  return (
    <WelcomePages>
      <S.PageWrapper>
        {typeof window !== "undefined" &&
        typeof window.navigator !== "undefined"  ? (
          <Camera
            showFocus={true}
            front={false}
            capture={capture}
            ref={camRef}
            width="350"
            height="350"
          />
        ) :
        null}
        {typeof window !== "undefined" &&
        typeof window.navigator !== "undefined"  ? (
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zIndex: 9,
              width: 350,
              height: 350,
            }}
          />
        ) : null}        
      </S.PageWrapper>
      
    </WelcomePages>
  )
})

export default PoseEstimation
