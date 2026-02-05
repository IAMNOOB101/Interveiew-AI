import api from './api';

export const submitAnswer = async ({
  sessionId,
  answerText,
  confidence
}: {
  sessionId: string;
  answerText: string;
  confidence: {
    voice: number;
    facial: number;
  };
}) => {
  return api.post("/interview/session/submit", {
    sessionId,
    answerText,
    confidence
  });
};
