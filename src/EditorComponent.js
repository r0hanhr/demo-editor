import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  getDefaultKeyBinding,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const styleMap = {
  RED: {
    color: "red",
  },
};

const EditorComponent = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const savedContent = localStorage.getItem("draft-editor-content");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (chars, editorState) => {
    if (chars === " ") {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      const blockKey = selectionState.getStartKey();
      const block = contentState.getBlockForKey(blockKey);
      const text = block.getText();

      if (text === "#") {
        const newContentState = Modifier.replaceText(
          contentState,
          selectionState.merge({
            anchorOffset: 0,
            focusOffset: 1,
          }),
          ""
        );
        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          "remove-range"
        );
        const finalEditorState = RichUtils.toggleBlockType(
          newEditorState,
          "header-one"
        );
        setEditorState(finalEditorState);
        return "handled";
      } else if (text === "*") {
        const newContentState = Modifier.replaceText(
          contentState,
          selectionState.merge({
            anchorOffset: 0,
            focusOffset: 1,
          }),
          ""
        );
        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          "remove-range"
        );
        const finalEditorState = RichUtils.toggleInlineStyle(
          newEditorState,
          "BOLD"
        );
        setEditorState(finalEditorState);
        return "handled";
      } else if (text === "**") {
        const newContentState = Modifier.replaceText(
          contentState,
          selectionState.merge({
            anchorOffset: 0,
            focusOffset: 2,
          }),
          ""
        );
        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          "remove-range"
        );
        const finalEditorState = RichUtils.toggleInlineStyle(
          newEditorState,
          "RED"
        );
        setEditorState(finalEditorState);
        return "handled";
      } else if (text === "***") {
        const newContentState = Modifier.replaceText(
          contentState,
          selectionState.merge({
            anchorOffset: 0,
            focusOffset: 3,
          }),
          ""
        );
        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          "remove-range"
        );
        const finalEditorState = RichUtils.toggleInlineStyle(
          newEditorState,
          "UNDERLINE"
        );
        setEditorState(finalEditorState);
        return "handled";
      } else if (text === "```") {
        const newContentState = Modifier.replaceText(
          contentState,
          selectionState.merge({
            anchorOffset: 0,
            focusOffset: 3,
          }),
          ""
        );
        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          "remove-range"
        );
        const finalEditorState = RichUtils.toggleBlockType(
          newEditorState,
          "code-block"
        );
        setEditorState(finalEditorState);
        return "handled";
      }
    }
    return "not-handled";
  };

  const keyBindingFn = (e) => {
    return getDefaultKeyBinding(e);
  };

  const handleSaveClick = () => {
    try {
      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);
      localStorage.setItem(
        "draft-editor-content",
        JSON.stringify(rawContentState)
      );
      alert("Content saved successfully!");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return (
    <>
      <div className="heading-block">
        <p>Demo editor by Rohan</p>
        <button className="save-btn" onClick={handleSaveClick}>
          Save
        </button>
      </div>
      <div className="editor-block">
        <Editor
          editorState={editorState}
          customStyleMap={styleMap}
          handleKeyCommand={handleKeyCommand}
          handleBeforeInput={handleBeforeInput}
          keyBindingFn={keyBindingFn}
          onChange={setEditorState}
        />
      </div>
    </>
  );
};

export default EditorComponent;
