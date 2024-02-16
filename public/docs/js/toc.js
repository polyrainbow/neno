const getId = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}


const createToc = () => {
  const h2s = document.querySelectorAll('h2');
  const h3s = document.querySelectorAll('h3');
  const toc = [];
  let h2index = 1;

  for (const h2 of h2s) {
    const nextH2 = h2s[h2index];
    const text = h2.textContent;

    const children = Array.from(h3s)
      .filter(h3 => {
        return (
          h3.compareDocumentPosition(h2) === Node.DOCUMENT_POSITION_PRECEDING
          && (
            !nextH2
            || h3.compareDocumentPosition(nextH2) === Node.DOCUMENT_POSITION_FOLLOWING
          )
        );
      })
      .map((h3, h3Index) => ({
        text: h3.textContent,
        number: `${h2index}.${h3Index + 1}`,
        element: h3,
        id: getId(h3.textContent),
      }));

    toc.push({
      text,
      children,
      number: h2index.toString(),
      element: h2,
      id: getId(h2.textContent),
    });
    h2index++;
  }

  return toc;
}

const replaceElement = (oldElement, newElement) => {
  oldElement.parentNode.replaceChild(newElement, oldElement);
}

const createAnchors = (toc) => {
  toc.forEach(entry => {
    entry.element.id = entry.id;
    entry.element.textContent = `${entry.number}. ${entry.text}`;

    entry.children.forEach(h3 => {
      h3.element.id = h3.id;
      h3.element.textContent = `${h3.number}. ${h3.text}`;
    });
  });
}

const renderToc = (toc) => {
  const parent = document.querySelector('#toc');
  const list = document.createElement('ol');
  list.style.listStyleType = 'none';
  list.style.paddingLeft = '0';
  parent.appendChild(list);
  toc.forEach(entry => {
    const listItem = document.createElement('li');
    list.appendChild(listItem);
    const link = document.createElement('a');
    link.href = `#${entry.id}`;
    link.textContent = `${entry.number}. ${entry.text}`;
    listItem.appendChild(link);

    if (entry.children.length > 0) {
      const childrenList = document.createElement('ol');
      childrenList.style.paddingLeft = '20px';
      childrenList.style.listStyleType = 'none';
      listItem.appendChild(childrenList);

      for (const h3 of entry.children) {
        const listItem = document.createElement('li');
        childrenList.appendChild(listItem);
        const link = document.createElement('a');
        link.href = `#${h3.id}`;
        listItem.appendChild(link);
        link.textContent = `${h3.number}. ${h3.text}`;
      }
    }
  });
};

const toc = createToc();
createAnchors(toc);
renderToc(toc);