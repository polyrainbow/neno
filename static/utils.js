const yyyymmdd = (date) => {
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
  const dd = date.getDate().toString();
  return (
    yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0])
  );
};

const htmlDecode = (input) => {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
};

export {
  yyyymmdd,
  htmlDecode,
};
