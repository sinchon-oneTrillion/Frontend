# CLAUDE.md

이 웹페이지는 ** 새치 예방 습관을 형성하는 플랫폼**입니다.

---

# MCP Servers

## Figma Dev Mode MCP Rules

- The Figma Dev Mode MCP Server provides an assets endpoint which can serve image and SVG assets
- IMPORTANT: If the Figma Dev Mode MCP Server returns a localhost source for an image or an SVG, use that image or SVG source directly
- IMPORTANT: DO NOT import/add new icon packages, all the assets should be in the Figma payload
- IMPORTANT: do NOT use or create placeholders if a localhost source is provided

---

# Tech Spec

Please Check dependencies in ./package.json file.

### 사용된 기술 스택

- **개발 프레임워크**: `React 19.1.0`, `Vite 7.0.4`
- **스타일링 도구**: `Tailwind CSS 4.1.11`, `@tailwindcss/vite`,
- **라우팅**: `React Router DOM 7.7.0`
- **API 통신**: `Axios 1.11.0`
- **타입 지원**: `@types/react`, `@types/react-dom`
- typescript 사용금지, javascript만 사용하세요

### 개발 도구

- `ESLint`, `Prettier` (코드 품질 관리)
- `@vitejs/plugin-react` (Vite에서 React 지원)

---

# Directory Architecture

- **파일 구조는 현재 만들어진 디렉토리 구조를 최대한 유지하며 개발해 주세요.**

---

# Implement

- Each page is managed via [pageName] directory in `src/app`.
- If you need implement some page, follow Directory Architecture rules.
- You should declare model and api when you need implement some page. see the figma design and judgment what data is necessary.
- If you think it is a frequently used component, such as a button or input, please implement it flexibly in shared so that the component can be commonly used.

---

# Avoid Pattern

- Do not use any type. If need some interface or type, you can write [feature page name]/types.ts and export it.
- You can use gap or empty `h-{} div` instead of margin and padding. Please avoid margin/padding styling pattern as you can.
- If a component file has more than 150 lines of code, please separate the hooks or components into modules.
- Do not use `React.[module]` pattern. please just import and use it.
- Do not use inline function. please make a handler function and use it. you can naming function with this rule via `'handle'{target}{eventName}` e.g. handleCTAButtonClick, handleAgeInputChange, etc.
- Do not use inline style css.
- If you need assets, use can copy as SVG code in figma. do not implement yourself asset file, just use svg and convert to svg component.
- Please avoid publish with `relative`, `absolute`. you can use flex and grid tailwindcss keyword.

💡 위 규칙들을 지키면 유지보수성과 협업 효율이 크게 향상됩니다.
