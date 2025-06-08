import { RootState } from "@/store";
import { useCallback, useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { setTheme } from "@/store/slices/editor.slice";
import { useSelector, useDispatch } from "react-redux";
import { setUpMonaco } from "@/components/languages";
import { useTheme } from "next-themes";
export const useEditor = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const {
    theme: editorTheme,
    language,
    code,
    response,
    isLoading,
  } = useSelector((state: RootState) => state.editor);
  const handleEditorDidMount = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
      setUpMonaco(language);
    },
    [language]
  );
  useEffect(() => {
    dispatch(setTheme(theme === "dark" ? "vs-dark" : "light"));
  }, [theme, dispatch]);

  return {
    theme: editorTheme,
    language,
    dispatch,
    code,
    response,
    handleEditorDidMount,
    isLoading,
  };
};
