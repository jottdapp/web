import React, { useRef, useState, useEffect } from 'react';
import styles from './MainInput.module.css';

export default function MainInput(props) {
  const textareaEl = useRef(null);
  const [text, setText] = useState('');
  const [placeholder, setPlaceholder] = useState('Tell me anything!');

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

  function handleInput(e) {
    setText(e.target.value);
  }

  function handleKeyPress(e) {
    if (e.which === 13) {
      if (text !== '') {
        // send this as a request...
        setPlaceholder(text);
        setText('');
      }
      e.preventDefault();
    }
  }

  return (
    <div className={styles.MainInputContainer}>
      <textarea
        placeholder={placeholder}
        onChange={handleInput}
        onKeyPress={handleKeyPress}
        value={text}
        ref={textareaEl}
      />
    </div>
  );
}
