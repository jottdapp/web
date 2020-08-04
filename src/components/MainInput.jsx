import React, { useRef, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { stores as storesAtom } from '../globals';
import styles from './MainInput.module.css';
import getStore from '../api/getStore';

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
          { cont === '' ? 'Enter' : (
            <span>
              {currentText}
              <span className={styles.autocompleteContinuation}>{cont}</span>
            </span>
          ) }
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
    if (altText === shortcut) {
      results.push('');
    } else if (altText === shortcut.substring(0, altText.length)) {
      if (results.indexOf(shortcut[altText.length]) === -1) {
        results.push(shortcut[altText.length]);
      }
    }
  }
  return results.sort();
}

export default function MainInput() {
  const textareaEl = useRef(null);
  const stores = useRecoilValue(storesAtom);
  const [text, setText] = useState('');
  const [autocompletions, setAutocompletions] = useState(autocomplete(text, stores));
  const [errorMessage, setErrorMessage] = useState('');
  const [disableInput, setDisableInput] = useState(false);

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
    if (disableInput) {
      return; // don't change the input when it's disabled
    }
    setErrorMessage('');
    // check whether this is a complete category
    let shorterText = newText;
    // remove characters until it can be completed
    let autocompletion = autocomplete(newText, stores);
    while (autocompletion.length === 0 && shorterText.length !== 0) {
      shorterText = shorterText.substring(0, newText.length - 1);
      autocompletion = autocomplete(shorterText, stores);
    }
    setText(shorterText);
    setAutocompletions(autocompletion);
  }

  function onEnter() {
    if (stores[text] === undefined) {
      setErrorMessage('Not a shortcut for a store.');
    } else {
      // text is the shortcut for the store to show
      setText('');
      setAutocompletions([]);
      setDisableInput(true);
      getStore(stores[text]).then((store) => {
        if (store === undefined) {
          setErrorMessage('Store does not exist. This is a problem with the server.');
          setAutocompletions(autocomplete('', stores));
        } else {
          // Currently, no views are supported,
          // so show an error saying this view is not supported
          setErrorMessage(`View type '${store.view}' is currently unsupported.`);
          setAutocompletions(autocomplete('', stores));
        }
        setDisableInput(false);
      });
    }
  }

  function handleKeyDown(event) {
    if (event.which === 13) { // Enter key
      onEnter();
    }
  }

  return (
    <div className={styles.MainInputContainer}>
      <textarea
        onChange={(event) => {
          handleInput(event.target.value);
        }}
        onKeyDown={handleKeyDown}
        value={text}
        ref={textareaEl}
        disabled={disableInput}
      />
      <MainInputAutocomplete
        currentText={text}
        continuations={autocompletions}
        onClick={(txt) => {
          if (txt === text) {
            onEnter();
          } else {
            handleInput(txt);
          }
        }}
      />
      <p className={styles.errorMessage}>{errorMessage}</p>
    </div>
  );
}
