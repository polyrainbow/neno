
interface Replacements {
  [key: string]: string
}

type CallbackFunction = (newLanguage: string) => void;

export const SUPPORTED_LANGS = [
  "en-US",
  "de-DE",
];

const DEFAULT_LANG = "en-US";

let lang: string;
let langFile: Record<string, string>;
const callbacks: CallbackFunction[] = [];

export const init = async () => {
  const localStorageValue = localStorage.getItem("language");

  if (localStorageValue && SUPPORTED_LANGS.includes(localStorageValue)) {
    lang = localStorageValue;
  } else if (SUPPORTED_LANGS.includes(navigator.language)) {
    lang = navigator.language;
  } else {
    lang = DEFAULT_LANG;
  }

  localStorage.setItem("language", lang);
  langFile = (await import(`../intl/${lang}.json`)).default;
};


export function l(key: string, replacements?: Replacements): string {
  if (!langFile) {
    throw new Error("Intl module not initialized yet.");
  }

  if (typeof langFile[key] === "string") {
    let output = langFile[key];
    for (const replacement in replacements) {
      if (Object.prototype.hasOwnProperty.call(replacements, replacement)) {
        output = output.replace(`{${replacement}}`, replacements[replacement]);
      }
    }

    return output;
  } else {
    // eslint-disable-next-line no-console
    console.warn("Translation not available: " + key);
    return key;
  }
}

/* localize and return fragment with react components */
export function lf(
  key: string,
  replacements?: Replacements,
): Iterable<React.ReactNode> {
  if (!langFile) {
    throw new Error("Intl module not initialized yet.");
  }

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

export function getActiveLanguage(): string {
  if (!langFile) {
    throw new Error("Intl module not initialized yet.");
  }
  return lang;
}

export async function setLanguage(newLanguage: string) {
  if (!SUPPORTED_LANGS.includes(newLanguage)) {
    throw new Error("Unsupported language: " + newLanguage);
  }
  langFile = (await import(`../intl/${newLanguage}.json`)).default;
  lang = newLanguage;
  localStorage.setItem("language", newLanguage);
  for (const callback of callbacks) {
    callback(newLanguage);
  }
}

export const onChange = (callback: CallbackFunction): void => {
  callbacks.push(callback);
};
