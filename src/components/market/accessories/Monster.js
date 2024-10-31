import React from "react";
import DefaultLottie from "../../UI/DefaultLottie";

const Icon = ({className}) => {
  return (
    <DefaultLottie className={className} path={"https://storage.googleapis.com/pokerblow/bodymovin/monster.json"}/>
  )
}

export default Icon