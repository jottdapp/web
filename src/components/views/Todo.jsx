import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import cloneDeep from 'lodash/cloneDeep';
import Fuse from 'fuse.js';
import styles from './Todo.module.css';

export default function Todo({
  search, notes, onEditNote, onNewNote,
}) {
  const [addText, setAddText] = useState('');

  function toggleCompleted(uuid) {
    return () => {
      const newNote = cloneDeep(notes[uuid]);
      newNote.completed = !(newNote.completed);
      onEditNote(uuid, newNote);
    };
  }

  function handleNoteEdit(uuid) {
    return (event) => {
      if (!event.target.value.includes('\n')) {
        const newNote = cloneDeep(notes[uuid]);
        newNote.task = event.target.value;
        onEditNote(uuid, newNote);
      }
    };
  }

  function handleAddTextChanged(event) {
    setAddText(event.target.value);
  }

  function addTodo() {
    if (addText !== '') {
      onNewNote({
        task: addText,
        completed: false,
      });
    }
    setAddText('');
  }

  let noteEntries = Object.entries(notes);
  noteEntries.sort((a, b) => a[0] < b[0]);
  if (search !== '') {
    const fuse = new Fuse(noteEntries, {
      keys: ['1.task'],
      includeScore: true,
    });
    let searchResults = fuse.search(search);
    // move score so that the first is 1 (invert and subtract)
    searchResults = searchResults.map(
      (x) => Object.assign(x, { score: x.score - searchResults[0].score }),
    );
    searchResults = searchResults.map(
      (x) => Object.assign(x, { score: 1 - x.score }),
    );
    noteEntries = searchResults.map((x) => [x.item[0], x.item[1], x.score]);
  }

  return (
    <div>
      { noteEntries.map(([uuid, { task, completed }, score]) => (
        <div
          className={styles.todoItem}
          key={uuid}
          style={{ opacity: score ? (score / 2) + 0.5 : 1 }}
        >
          <button
            className={styles.toggleCompleted}
            type="button"
            label="Toggle mark completed"
            onClick={toggleCompleted(uuid)}
          >
            <Icon path={completed ? mdiCheckboxMarked : mdiCheckboxBlankOutline} size={1} />
          </button>
          <TextareaAutosize
            className={styles.textarea}
            onChange={handleNoteEdit(uuid)}
            value={task}
          />
        </div>
      )) }
      <div className={styles.todoAdd}>
        <button
          className={styles.toggleCompleted}
          type="button"
          label="Add todo item"
          onClick={addTodo}
        >
          <Icon path={mdiPlus} size={1} />
        </button>
        <TextareaAutosize
          className={styles.textarea}
          onChange={handleAddTextChanged}
          value={addText}
          placeholder="Add something to this todo"
        />
      </div>
    </div>
  );
}
