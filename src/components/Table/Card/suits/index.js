import Heart from "./Heart";
import Spade from "./Spade";
import Diamond from "./Diamond";
import Club from "./Club";
import React from "react";

export default function suitIcon(suit, style, className, key) {
  switch(suit) {
    case "h":
      return <Heart key={key} className={className} style={style}/>
    case "s":
      return <Spade key={key} className={className} style={style}/>
    case "d":
      return <Diamond key={key} className={className} style={style}/>
    case "c":
      return <Club key={key} className={className} style={style}/>
  }
}