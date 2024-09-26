import { RootState } from "@/store";
import { useCallback, useRef } from "react";
import * as monaco from "monaco-editor";

import { useSelector, useDispatch } from "react-redux";
import SetupMonaco from "@/components/Editor/setUpMonaco";
export const useEditor = () => {
  const dispatch = useDispatch();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
      SetupMonaco();
    },
    []
  );
  const { theme, language, code, response, isLoading } = useSelector(
    (state: RootState) => state.editor
  );
  return {
    theme,
    language,
    dispatch,
    code,
    response,
    handleEditorDidMount,
    isLoading,
  };
};
