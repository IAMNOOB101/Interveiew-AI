export const startSpeechRecognition = (onText) => {
  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(r => r[0].transcript)
      .join("");
    onText(transcript);
  };

  recognition.start();
  return recognition;
};
