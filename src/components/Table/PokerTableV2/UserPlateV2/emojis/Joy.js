import DefaultLottie from "../../../../UI/DefaultLottie";
import React from "react";

const Emoji = ({className}) => {
  return (
    <DefaultLottie className={className} path={"https://storage.googleapis.com/pokerblow/emojis/joy.json"}/>
  )
}

export default Emoji