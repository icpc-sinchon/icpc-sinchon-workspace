import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: "Apple SD Gothic Neo";
  src: url("/res/fonts/AppleSDGothicNeo-Regular.woff2") format("woff2"),
    url("/res/fonts/AppleSDGothicNeo-Bold.woff2") format("woff2");
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Apple SD Gothic Neo", -apple-system, BlinkMacSystemFont,
    "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
    "Droid Sans", "Helvetica Neue", sans-serif;
}

html,
body {
  min-height: 100vh;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: ${(props) => props.theme.colors.primaryBackground};
}

#__next {
  height: 100%;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

@keyframes slideup {
  from {
    opacity: 0;
    transform: translate(0, 40px);
  }
  to {
    opacity: 1;
    transform: translate(0, 0px);
  }
}

@keyframes slidedown {
  from {
    opacity: 0;
    transform: translate(0, -40px);
  }
  to {
    opacity: 1;
    transform: translate(0, 0px);
    /* top: 20px; */
  }
}
.slide-up {
  animation: slideup 500ms ease-in-out;
  animation-fill-mode: forwards;
}

.slide-down {
  animation: slidedown 500ms ease-in-out;
  animation-fill-mode: forwards;
}

.reverse {
  animation-direction: reverse;
}

table {
  margin: 0 auto;
  width: 100%;

  border-collapse: collapse;
  border: none;
  th,
  td {
    text-align: center;
  }
}

.vhide {
  visibility: hidden;
}

.show {
  visibility: unset;
}

.checked {
  background-color: #1a73e8;
  border: none !important;
}

li {
  list-style: none;
  border-top: none;
  cursor: pointer;
  text-align: left;
}

.not-draggable {
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}

.row-filter {
  position: absolute;
}

.row-filter ul {
  color: white;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 400px;
  width: max-content;
  font-size: 0.9rem;
  border-radius: 6px;
  background-color: rgb(57, 53, 52);
  box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
  padding: 0 0 8px 0;
}

.row-filter li {
  list-style: none;
  height: 28px;
  border-left: none;
  text-align: left;
  padding: 0 12px;
  background-color: rgb(57, 53, 52);
}

.row-filter li:hover {
  background-color: rgb(112, 110, 109);
}

.row-filter li:first-child {
  height: 36px;
  line-height: 36px;
  position: sticky;
  top: 0;
  background-color: rgb(57, 53, 52);
}

.filter-selected img {
  background: lightgray;
  border-radius: 5px;
}

.filter-img {
  cursor: pointer;
}

.filter-img:hover {
  background: lightgray;
  border-radius: 5px;
}

.selected-cell {
  background-color: #e5fec2 !important;
}

.nav-element {
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.35rem 2rem;
}

.nav-selected {
  background-color: rgba(0, 0, 0, 0.65);
  color: white;

  border-radius: 31px;
}

a {
  color: black;
  text-decoration: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #909090;
  background-clip: content-box;

  border: 4px solid transparent;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: lightgray;
  background-clip: content-box;
}

.addModalBtn {
  cursor: pointer;
}
.spinner {
  height: 100px;
  animation: spinner 700ms linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

@keyframes swipper {
  0% {
    transform: translate3d(-30%, 0, 0);
  }

  100% {
    transform: translate3d(30%, 0, 0);
  }
}

`;

export default GlobalStyle;
