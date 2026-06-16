import { useCopyCommand } from "../hooks/useCopyCommand.js";
import { CheckIcon } from "./icons.jsx";

export function TerminalCommand({ copyText, t }) {
  const { copied, copy } = useCopyCommand(copyText);

  return (
    <div className="terminal" data-copy-text={copyText} role="presentation">
      <span className="terminal__cmd">
        <span className="terminal__prompt">&gt;_</span>
        {copyText}
      </span>
      <button
        aria-label={t.copyLabel}
        className={`terminal__copy ${copied ? "is-copied" : ""}`}
        onClick={copy}
        type="button"
      >
        <img
          alt=""
          className="terminal__copy-icon terminal__copy-icon--copy"
          src="/coder/assets/icon-copy.svg"
        />
        <CheckIcon />
        <span aria-hidden="true" className="terminal__copy-tooltip">
          {t.copiedLabel}
        </span>
      </button>
    </div>
  );
}
