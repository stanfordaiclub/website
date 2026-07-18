"use client";

import { Fragment, useEffect, useMemo, useRef } from "react";

const NOISE_GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>/?~\\`";

function hash(index: number, salt: number): number {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function noiseGlyph(index: number, step: number, salt: number): string {
  const position = Math.floor(hash(index + step * 37, salt + step * 0.17) * NOISE_GLYPHS.length);
  return NOISE_GLYPHS[position];
}

interface IndexedWord {
  word: string;
  start: number;
}

function renderNoiseWord(
  indexedWord: IndexedWord,
  progress: number,
  step: number,
  salt: number
): string {
  return indexedWord.word
    .split("")
    .map((character, characterIndex) => {
      const index = indexedWord.start + characterIndex;
      const lockAt = 0.18 + hash(index, salt + 11) * 0.72;
      return progress >= lockAt || progress === 1
        ? character
        : noiseGlyph(index, step, salt);
    })
    .join("");
}

interface DiffusionTextProps {
  text: string;
  start?: boolean;
  instant?: boolean;
  delay?: number;
  duration?: number;
  stepMs?: number;
  salt?: number;
  characterClassName?: string;
  wordClassName?: string;
}

/**
 * A discrete denoising reveal: every character position begins as a changing
 * random token and progressively locks into the target sequence.
 */
export default function DiffusionText({
  text,
  start = true,
  instant = false,
  delay = 0,
  duration = 1800,
  stepMs = 55,
  salt = 0,
  characterClassName = "",
  wordClassName = "",
}: DiffusionTextProps) {
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const indexedWords = useMemo(() => {
    const words = text.split(" ");
    return words.map((word, wordIndex) => ({
      word,
      start: words
        .slice(0, wordIndex)
        .reduce((offset, previousWord) => offset + previousWord.length + 1, 0),
    }));
  }, [text]);

  useEffect(() => {
    if (instant) {
      indexedWords.forEach((indexedWord, wordIndex) => {
        const element = wordRefs.current[wordIndex];
        if (element) element.textContent = indexedWord.word;
      });
      return;
    }
    if (!start) return;

    const startedAt = performance.now();
    let step = 0;
    let animationFrame = 0;
    let lastUpdate = -Infinity;

    const update = (currentTime: number) => {
      const elapsed = currentTime - startedAt;
      const progress = Math.max(0, Math.min(1, (elapsed - delay) / duration));

      if (currentTime - lastUpdate >= stepMs || progress === 1) {
        indexedWords.forEach((indexedWord, wordIndex) => {
          const element = wordRefs.current[wordIndex];
          if (!element) return;
          const nextText = renderNoiseWord(indexedWord, progress, step, salt);
          if (element.textContent !== nextText) element.textContent = nextText;
        });
        step += 1;
        lastUpdate = currentTime;
      }

      if (progress < 1) animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [delay, duration, indexedWords, instant, salt, start, stepMs]);

  return indexedWords.map((indexedWord, wordIndex) => {
    return (
      <Fragment key={`${indexedWord.word}-${wordIndex}`}>
        <span
          aria-hidden
          className={`relative inline-block whitespace-nowrap ${wordClassName}`}
        >
          <span className="invisible">
            {characterClassName
              ? indexedWord.word.split("").map((character, characterIndex) => (
                  <span
                    key={indexedWord.start + characterIndex}
                    className={`inline-block ${characterClassName}`}
                  >
                    {character}
                  </span>
                ))
              : indexedWord.word}
          </span>
          <span
            ref={(element) => {
              wordRefs.current[wordIndex] = element;
            }}
            className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          >
            {instant ? indexedWord.word : renderNoiseWord(indexedWord, 0, 0, salt)}
          </span>
        </span>
        {wordIndex < indexedWords.length - 1 ? " " : null}
      </Fragment>
    );
  });
}
