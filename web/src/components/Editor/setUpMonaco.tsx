const SetupMonaco = async () => {
  const monaco = await import("monaco-editor");

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: "React",
    allowJs: true,
    typeRoots: ["node_modules/@types"],
  });

  try {
    const response = await fetch(
      "https://unpkg.com/@types/react@latest/index.d.ts"
    );
    const types = await response.text();
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      types,
      "file:///node_modules/@types/react/index.d.ts"
    );
  } catch (error) {
    console.error("Failed to fetch React types:", error);
  }
  monaco.languages.register({ id: "php" });

  monaco.languages.setMonarchTokensProvider("php", {
    tokenizer: {
      root: [[/<\?php/, { token: "comment", next: "@php" }]],
      php: [
        [/<\?php/, { token: "comment" }],
        [/\?>/, { token: "comment", next: "@pop" }],
        [
          /[a-z_$][\w$]*/,
          { cases: { "@keywords": "keyword", "@default": "identifier" } },
        ],
        [/[{}()\[\]]/, "@brackets"],
        [/[ \t\r\n]+/, "white"],
        [/[;,.]/, "delimiter"],
      ],
    },
    keywords: [
      "echo",
      "print",
      "die",
      "exit",
      "if",
      "else",
      "while",
      "for",
      "foreach",
      "function",
      "return",
    ],
  });

  monaco.languages.setLanguageConfiguration("php", {
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"],
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
    ],
  });
};

export default SetupMonaco;
