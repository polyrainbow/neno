import React from "react";

interface Replacements {
  [key: string]: string
}

export const supportedLangs = [
  "en-US",
  "de-DE",
];

const defaultLang = "en-US";

let lang = defaultLang;

const localStorageValue = localStorage.getItem("language");

if (localStorageValue && supportedLangs.includes(localStorageValue)) {
  lang = localStorageValue;
} else if (supportedLangs.includes(navigator.language)) {
  lang = navigator.language;
}

localStorage.setItem("language", lang);

const langFile = await import(`../intl/${lang}.json`);

export function l(key: string, replacements?: Replacements): string {
  if (typeof langFile[key] === "string") {
    let output = langFile[key];
    for (const replacement in replacements) {
      if (Object.prototype.hasOwnProperty.call(replacements, replacement)) {
        output = output.replace(`{${replacement}}`, replacements[replacement]);
      }
    }

    return output;
  } else {
    return key;
  }
}

/* localize and return fragment with react components */
export function lf(
  key: string,
  replacements?: Replacements,
): React.ReactFragment {
  const output = l(key, replacements);

  if (output.includes("%EXTERNAL_LINK")) {
    const nodes: React.ReactNode[] = [];

    const regex = /%EXTERNAL_LINK\[(?<label>[^\]]*)\]\((?<url>[^)]*)\)/gm;
    const outerParts = output.split(regex);
    let i = 0;
    for (const match of output.matchAll(regex)) {
      nodes.push(<span
        key={`translation_${key}_op_${match.groups?.label}`}
      >{outerParts[i]}</span>);
      nodes.push(
        <a
          href={match.groups?.url}
          target="_blank"
          rel="noreferrer noopener"
          key={`translation_${key}_match_${match.groups?.label}`}
        >{match.groups?.label}</a>,
      );
      i++;
    }
    nodes.push(outerParts[outerParts.length - 1]);
    return nodes;
  } else {
    return output;
  }
}

export function getActiveLanguage() {
  return lang;
}

export function setLanguage(language) {
  lang = language;
  localStorage.setItem("language", lang);
  location.reload();
}
