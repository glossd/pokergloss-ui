import React from "react";

export function assignmentFullName(t, a) {
  let variableName = a.variable
  if (a.type === "winWithHand" || a.type === "loseWithHand") {
    variableName = t(`table.HandName.${a.variable}`)
  }
  if (a.type === "winWithFace" || a.type === "loseWithFace") {
    variableName = t(`face.${a.variable}`)
  }
  if (a.type === "winWithPairOf" || a.type === "loseWithPairOf") {
    variableName = t(`facePlural.${a.variable}`)
  }

  let builder = t(`dailyAssignments.prefix.${a.prefix}`) + " " + variableName
  builder += a.suffix ? " " + t(`dailyAssignments.suffix.${a.suffix}`) : ""
  builder += " " + a.count + " " + t("dailyAssignments.times")
  return builder
}