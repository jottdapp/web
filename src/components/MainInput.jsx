import React, { useRef, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { categories as categoriesAtom } from '../globals';
import styles from './MainInput.module.css';

function MainInputAutocomplete({ currentText, continuations, onClick }) {
  return (
    <div className={styles.mainInputAutocomplete}>
      { continuations.map((cont) => (
        <button
          type="button"
          onClick={() => {
            onClick(currentText + cont);
          }}
          key={currentText + cont}
          className={styles.mainInputAutocompleteEntry}
        >
          {currentText}
          <span className={styles.autocompleteContinuation}>{cont}</span>
        </button>
      )) }
    </div>
  );
}

function autocomplete(altText, categories) {
  // return next key options
  const results = [];
  for (let i = 0; i < Object.keys(categories).length; i += 1) {
    const shortcut = Object.keys(categories)[i];
    if (altText === shortcut.substring(0, altText.length)) {
      if (results.indexOf(shortcut[altText.length]) === -1) {
        results.push(shortcut[altText.length]);
      }
    }
  }
  return results.sort();
}

export default function MainInput() {
  const textareaEl = useRef(null);
  const categories = useRecoilValue(categoriesAtom);
  const [text, setText] = useState('');
  const [autocompletions, setAutocompletions] = useState(autocomplete(text, categories));
  const [errorMessage, setErrorMessage] = useState('');

  function setScale() {
    if (textareaEl.current) {
      textareaEl.current.style.height = '1px';
      textareaEl.current.style.height = `${textareaEl.current.scrollHeight}px`;
    }
  }

  setScale();
  useEffect(() => {
    const id = window.addEventListener('resize', setScale);
    return () => window.removeEventListener('resize', id);
  });

  function handleInput(newText) {
    setErrorMessage('');
    // check whether this is a complete category
    if (categories[newText] !== undefined) {
      // this is the store to show
      setText('');
      // Currently, no data types are supported,
      // so show an error saying this data type is not supported
      setErrorMessage(`Data type '${categories[newText].type}' is currently unsupported.`);
      setAutocompletions(autocomplete('', categories));
    } else {
      let shorterText = newText;
      // remove characters until it can be completed
      let autocompletion = autocomplete(newText, categories);
      while (autocompletion.length === 0) {
        shorterText = shorterText.substring(0, newText.length - 1);
        autocompletion = autocomplete(shorterText, categories);
      }
      setText(shorterText);
      setAutocompletions(autocompletion);
    }
  }

  return (
    <div className={styles.MainInputContainer}>
      <textarea
        onChange={(event) => {
          handleInput(event.target.value);
        }}
        value={text}
        ref={textareaEl}
      />
      <MainInputAutocomplete
        currentText={text}
        continuations={autocompletions}
        onClick={handleInput}
      />
      <p className={styles.errorMessage}>{errorMessage}</p>
    </div>
  );
}
