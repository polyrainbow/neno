const getId = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};


const createToc = () => {
  const h2s = document.querySelectorAll("h2");
  const h3s = document.querySelectorAll("h3");
  const h4s = document.querySelectorAll("h4");
  const toc = [];
  let h2index = 1;

  for (const h2 of h2s) {
    const nextH2 = h2s[h2index];
    const text = h2.textContent;

    const h2Children = Array.from(h3s)
      .filter(h3 => {
        return (
          h3.compareDocumentPosition(h2) === Node.DOCUMENT_POSITION_PRECEDING
          && (
            !nextH2
            || (
              h3.compareDocumentPosition(nextH2)
                === Node.DOCUMENT_POSITION_FOLLOWING
            )
          )
        );
      })
      .map((h3, h3Index, h3Array) => {
        const nextH3 = h3Array[h3Index + 1];

        const h3Children = Array.from(h4s)
          .filter(h4 => {
            return (
              h4.compareDocumentPosition(h3)
                === Node.DOCUMENT_POSITION_PRECEDING
              && (
                !nextH3
                || (
                  h4.compareDocumentPosition(nextH3)
                    === Node.DOCUMENT_POSITION_FOLLOWING
                )
              )
              && (
                !nextH2
                || h4.compareDocumentPosition(nextH2)
                  === Node.DOCUMENT_POSITION_FOLLOWING
              )
            );
          })
          .map((h4, h4Index) => {
            return {
              text: h4.textContent,
              number: `${h2index}.${h3Index}.${h4Index + 1}`,
              element: h4,
              id: getId(h4.textContent),
            };
          });

        return {
          text: h3.textContent,
          number: `${h2index}.${h3Index + 1}`,
          element: h3,
          id: getId(h3.textContent),
          children: h3Children,
        };
      });

    toc.push({
      text,
      children: h2Children,
      number: h2index.toString(),
      element: h2,
      id: getId(h2.textContent),
    });
    h2index++;
  }

  return toc;
};

const createAnchors = (toc) => {
  toc.forEach(h2 => {
    h2.element.id = h2.id;
    const numberElement = document.createElement("span");
    numberElement.textContent = `${h2.number}. `;
    h2.element.insertBefore(numberElement, h2.element.childNodes[0]);

    h2.children.forEach(h3 => {
      h3.element.id = h3.id;
      const numberElement = document.createElement("span");
      numberElement.textContent = `${h3.number}. `;
      h3.element.insertBefore(numberElement, h3.element.childNodes[0]);

      h3.children.forEach(h4 => {
        h4.element.id = h4.id;
        const numberElement = document.createElement("span");
        numberElement.textContent = `${h4.number}. `;
        h4.element.insertBefore(numberElement, h4.element.childNodes[0]);
      });
    });
  });
};

const renderToc = (toc) => {
  const parent = document.querySelector("#toc");
  const h2List = document.createElement("ol");
  h2List.style.listStyleType = "none";
  h2List.style.paddingLeft = "0";
  parent.appendChild(h2List);
  toc.forEach(h2 => {
    const listItem = document.createElement("li");
    h2List.appendChild(listItem);
    const link = document.createElement("a");
    link.href = `#${h2.id}`;
    link.textContent = `${h2.number}. ${h2.text}`;
    listItem.appendChild(link);

    if (h2.children.length > 0) {
      const h3List = document.createElement("ol");
      h3List.style.paddingLeft = "20px";
      h3List.style.listStyleType = "none";
      listItem.appendChild(h3List);

      for (const h3 of h2.children) {
        const listItem = document.createElement("li");
        h3List.appendChild(listItem);
        const link = document.createElement("a");
        link.href = `#${h3.id}`;
        listItem.appendChild(link);
        link.textContent = `${h3.number}. ${h3.text}`;

        if (h3.children.length > 0) {
          const h4List = document.createElement("ol");
          h4List.style.paddingLeft = "20px";
          h4List.style.listStyleType = "none";
          listItem.appendChild(h4List);

          for (const h4 of h3.children) {
            const listItem = document.createElement("li");
            h4List.appendChild(listItem);
            const link = document.createElement("a");
            link.href = `#${h4.id}`;
            listItem.appendChild(link);
            link.textContent = `${h4.number}. ${h4.text}`;
          }
        }
      }
    }
  });
};

const toc = createToc();
createAnchors(toc);
renderToc(toc);
