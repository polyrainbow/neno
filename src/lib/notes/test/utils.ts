export const getNewTestFileReadable = (content: string): ReadableStream => {
  return new ReadableStream({
    async pull(controller) {
      const strToUTF8 = (str: string) => {
        const encoder = new TextEncoder();
        return encoder.encode(str);
      };
      controller.enqueue(strToUTF8(content));
      controller.close();
    },
  });
};
