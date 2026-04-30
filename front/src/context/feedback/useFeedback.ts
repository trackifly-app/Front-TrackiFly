"use client";

import { useContext } from "react";
import { FeedbackContext } from "./FeedbackProvider";

export const useFeedback = () => {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error("useFeedback debe usarse dentro de un FeedbackProvider");
  }

  return context;
};