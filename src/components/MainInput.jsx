import React, { useRef, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import cloneDeep from 'lodash/cloneDeep';
import clone from 'lodash/clone';
import { stores as storesAtom, SUPPORTED_VIEWS } from '../globals';
import styles from './MainInput.module.css';
import getStore from '../api/getStore';

import newNote from '../api/newNote';
import editNote from '../api/editNote';

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

function ResizeTextarea(textareaEl) {
  function setScale() {
    const textarea = textareaEl.current;
    if (textarea) {
      textarea.style.height = '1px';
      textarea.style.height = `${textareaEl.current.scrollHeight}px`;
    }
  }
  setScale();
  useEffect(() => {
    const id = window.addEventListener('resize', setScale);
    return () => window.removeEventListener('resize', id);
  });
}

export default function MainInput() {
  const textareaEl = useRef(null);
  ResizeTextarea(textareaEl);
  const stores = useRecoilValue(storesAtom);
  const [text, setText] = useState('');
  const [autocompletions, setAutocompletions] = useState(autocomplete(text, stores));
  const [errorMessage, setErrorMessage] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const [view, setView] = useState(null);
  const [viewNotes, setViewNotes] = useState(null);
  const [viewUuid, setViewUuid] = useState(null);

  if (view && viewNotes && viewUuid) {
    return <MainInputWithView view={view} notes={viewNotes} uuid={viewUuid} />;
  }

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
      if (SUPPORTED_VIEWS[stores[text].view] === undefined) {
        setErrorMessage(`View type '${stores[text].view}' is currently unsupported.`);
        setAutocompletions(autocomplete('', stores));
        setDisableInput(false);
      } else {
        getStore(stores[text].uuid).then((store) => {
          if (store === undefined) {
            setErrorMessage('Store does not exist. This is a problem with the server.');
            setAutocompletions(autocomplete('', stores));
          } else {
            setView(stores[text].view);
            setViewNotes(store);
            setViewUuid(stores[text].uuid);
            setAutocompletions(autocomplete('', stores));
          }
          setDisableInput(false);
        });
      }
    }
  }

  function handleKeyDown(event) {
    if (event.which === 13) { // Enter key
      onEnter();
      event.preventDefault();
    }
  }

  return (
    <div className={autocompletions === [] ? (styles.MainInputContainer) : (`${styles.MainInputContainer} ${styles.hasAutocomplete}`)}>
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

function MainInputWithView({ uuid, view, notes: initialNotes }) {
  const ActualView = SUPPORTED_VIEWS[view];
  const [text, setText] = useState('');
  const [notes, setNotes] = useState(initialNotes);
  const textareaEl = useRef(null);
  ResizeTextarea(textareaEl);

  async function onNewNote(note) {
    const noteUuid = await newNote(uuid, note);
    const newNotes = clone(notes);
    newNotes[noteUuid] = note;
    setNotes(newNotes);
  }

  function onEditNote(noteUuid, note) {
    const newNotes = cloneDeep(notes);
    newNotes[noteUuid] = note;
    setNotes(newNotes);
    return editNote(uuid, noteUuid, note);
  }

  return (
    <div className={styles.MainInputContainer}>
      <textarea
        onChange={(event) => {
          setText(event.target.value);
        }}
        value={text}
        ref={textareaEl}
        className={styles.textareaWithView}
      />
      <div className={styles.viewContainer}>
        <ActualView search={text} notes={notes} onEditNote={onEditNote} onNewNote={onNewNote} />
      </div>
    </div>
  );
}
