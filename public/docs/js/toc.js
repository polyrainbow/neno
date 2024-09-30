const getId = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};


const createToc = () => {
  const anchors = document.querySelectorAll("h2,h3,h4");
  const toc = [];

  let h2Index = 0;
  let h3Index;
  let h4Index;

  for (const anchor of anchors) {
    const text = anchor.textContent;

    if (anchor.nodeName === "H2") {
      h2Index++;
      h3Index = 0;
      h4Index = 0;

      const entry = {
        text,
        children: [],
        number: h2Index.toString(),
        element: anchor,
        id: getId(text),
      };

      toc.push(entry);
    } else if (anchor.nodeName === "H3") {
      h3Index++;
      h4Index = 0;

      const entry = {
        text,
        number: `${h2Index}.${h3Index}`,
        element: anchor,
        id: getId(text),
        children: [],
      };

      toc[toc.length - 1].children.push(entry);
    } else if (anchor.nodeName === "H4") {
      h4Index++;

      const entry = {
        text,
        number: `${h2Index}.${h3Index}.${h4Index}`,
        element: anchor,
        id: getId(text),
      };

      const h3List = toc[toc.length - 1].children;
      h3List[h3List.length - 1].children.push(entry);
    }
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
