/* @ds-bundle: {"format":4,"namespace":"MindanaoDesignSystem_94fd56","components":[{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"About","sourcePath":"ui_kits/portfolio/About.jsx"},{"name":"Home","sourcePath":"ui_kits/portfolio/Home.jsx"},{"name":"Work","sourcePath":"ui_kits/portfolio/Work.jsx"}],"sourceHashes":{"components/display/Badge.jsx":"46188eb2ca95","components/display/Card.jsx":"54bef8fcae47","components/display/Tag.jsx":"2282d3a8c921","components/feedback/Dialog.jsx":"7e20715695bd","components/feedback/Toast.jsx":"1cfe527164d4","components/feedback/Tooltip.jsx":"a73eea058c2d","components/forms/Button.jsx":"b6726e65397c","components/forms/Checkbox.jsx":"77cd6a5af0f3","components/forms/IconButton.jsx":"0e9d01a45af5","components/forms/Input.jsx":"29b822b4809a","components/forms/Radio.jsx":"463c311b2647","components/forms/Select.jsx":"8791cf666e6b","components/forms/Switch.jsx":"e45669f774d2","components/navigation/Tabs.jsx":"c2bd5fb86550","ds-loader.js":"258ad3e11c78","ui_kits/portfolio/About.jsx":"2dfe15f2aab4","ui_kits/portfolio/Home.jsx":"795babc59188","ui_kits/portfolio/Work.jsx":"92f040163ba9"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MindanaoDesignSystem_94fd56 = window.MindanaoDesignSystem_94fd56 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Badge.jsx
try { (() => {
function Badge({
  tone = 'neutral',
  children,
  style
}) {
  const tones = {
    neutral: {
      background: 'var(--paper-2)',
      color: 'var(--ink-3)'
    },
    success: {
      background: 'rgba(74,93,58,.14)',
      color: 'var(--fern-deep)'
    },
    warning: {
      background: 'rgba(201,138,59,.18)',
      color: 'var(--ochre-deep)'
    },
    danger: {
      background: 'rgba(156,59,34,.14)',
      color: 'var(--status-danger)'
    },
    highlight: {
      background: 'var(--mustard-soft)',
      color: 'var(--bamboo)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      padding: '4px 12px',
      borderRadius: 'var(--radius-pill)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      ...tones[tone],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function Card({
  eyebrow,
  title,
  children,
  footer,
  padding = 24,
  hoverable,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-hairline)',
      borderRadius: 'var(--radius-md)',
      boxShadow: hoverable && hover ? 'var(--shadow-float)' : 'var(--shadow-card)',
      padding,
      transition: 'box-shadow var(--dur-calm) var(--ease-breathe)',
      fontFamily: 'var(--font-body)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-caption)',
      letterSpacing: 'var(--tracking-caption)',
      textTransform: 'uppercase',
      fontWeight: 500,
      color: 'var(--ochre-deep)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h3)',
      color: 'var(--text-heading)',
      lineHeight: 1.3
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      color: 'var(--text-body)',
      lineHeight: 1.6
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function Tag({
  children,
  onRemove,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--ink-3)',
      padding: '5px 14px',
      border: '1px solid var(--line-2)',
      borderRadius: 'var(--radius-pill)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--surface-card)',
      ...style
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("span", {
    onClick: onRemove,
    style: {
      cursor: 'pointer',
      color: 'var(--ink-4)',
      fontSize: 14,
      lineHeight: 1
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  title,
  children,
  footer,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(46,36,24,.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-float)',
      border: 'var(--border-hairline)',
      padding: 32,
      width: 'min(440px, 90vw)',
      fontFamily: 'var(--font-body)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h2)',
      color: 'var(--text-heading)',
      lineHeight: 1.2
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--ink-4)',
      fontSize: 20,
      lineHeight: 1,
      padding: 4
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      color: 'var(--text-body)',
      lineHeight: 1.6
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'flex-end',
      marginTop: 8
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  tone = 'neutral',
  children,
  style
}) {
  const dot = {
    neutral: 'var(--ochre)',
    success: 'var(--fern)',
    danger: 'var(--status-danger)'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      background: 'var(--surface-inverse)',
      color: 'var(--paper-1)',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      padding: '12px 20px',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-float)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: dot,
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  text,
  children
}) {
  const [show, setShow] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--surface-inverse)',
      color: 'var(--paper-1)',
      fontFamily: 'var(--font-body)',
      fontSize: 12.5,
      padding: '6px 12px',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      opacity: show ? 1 : 0,
      transition: 'opacity var(--dur-calm) var(--ease-breathe)',
      zIndex: 50
    }
  }, text));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const pad = {
    sm: '8px 18px',
    md: '11px 26px',
    lg: '14px 34px'
  }[size];
  const fs = {
    sm: 13,
    md: 14,
    lg: 16
  }[size];
  const variants = {
    primary: {
      background: hover && !disabled ? 'var(--accent-primary-hover)' : 'var(--accent-primary)',
      color: 'var(--text-on-accent)',
      border: '1px solid transparent'
    },
    secondary: {
      background: hover && !disabled ? 'var(--paper-2)' : 'transparent',
      color: 'var(--ink-3)',
      border: '1px solid var(--line-3)'
    },
    ghost: {
      background: hover && !disabled ? 'var(--paper-2)' : 'transparent',
      color: 'var(--ink-3)',
      border: '1px solid transparent'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: fs,
      padding: pad,
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur-quick) var(--ease-breathe), color var(--dur-quick) var(--ease-breathe)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      ...variants[variant],
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--ink-3)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--radius-xs)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: checked ? 'var(--fern)' : 'var(--surface-card)',
      border: checked ? '1px solid var(--fern)' : 'var(--border-input)',
      transition: 'background var(--dur-quick) var(--ease-breathe)',
      color: 'var(--text-on-accent)',
      fontSize: 13
    }
  }, checked ? '✓' : ''), label && /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(!checked)
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  label,
  size = 40,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    "aria-label": label,
    title: label,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hover ? 'var(--paper-2)' : 'transparent',
      border: '1px solid var(--line-2)',
      color: 'var(--ink-3)',
      cursor: 'pointer',
      transition: 'background var(--dur-quick) var(--ease-breathe)',
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  helper,
  error,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-caption)',
      letterSpacing: 'var(--tracking-caption)',
      textTransform: 'uppercase',
      fontWeight: 500,
      color: 'var(--ink-4)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--ink-2)',
      padding: '11px 14px',
      background: 'var(--surface-card)',
      border: error ? '1px solid var(--status-danger)' : 'var(--border-input)',
      borderRadius: 'var(--radius-sm)',
      outline: 'none',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      transition: 'box-shadow var(--dur-quick) var(--ease-breathe)'
    }
  })), (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: error ? 'var(--status-danger)' : 'var(--ink-4)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  checked,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    onClick: () => onChange && onChange(true),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--ink-3)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-card)',
      border: checked ? '1px solid var(--fern)' : 'var(--border-input)',
      transition: 'border var(--dur-quick) var(--ease-breathe)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--fern)',
      opacity: checked ? 1 : 0,
      transition: 'opacity var(--dur-quick) var(--ease-breathe)'
    }
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  options = [],
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-caption)',
      letterSpacing: 'var(--tracking-caption)',
      textTransform: 'uppercase',
      fontWeight: 500,
      color: 'var(--ink-4)'
    }
  }, label), /*#__PURE__*/React.createElement("select", _extends({}, rest, {
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--ink-2)',
      padding: '11px 14px',
      appearance: 'none',
      background: 'var(--surface-card) url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27%3E%3Cpath d=%27M1 1l5 5 5-5%27 stroke=%27%236E6047%27 fill=%27none%27 stroke-width=%271.5%27/%3E%3C/svg%3E") no-repeat right 14px center',
      border: 'var(--border-input)',
      borderRadius: 'var(--radius-sm)',
      outline: 'none',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      transition: 'box-shadow var(--dur-quick) var(--ease-breathe)'
    }
  }), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--ink-3)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 44,
      height: 24,
      borderRadius: 'var(--radius-pill)',
      position: 'relative',
      flexShrink: 0,
      background: checked ? 'var(--fern)' : 'var(--line-2)',
      transition: 'background var(--dur-calm) var(--ease-breathe)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: checked ? 23 : 3,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: 'var(--paper-0)',
      boxShadow: '0 1px 3px rgba(60,46,30,.25)',
      transition: 'left var(--dur-calm) var(--ease-breathe)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(!checked)
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  active,
  onChange,
  style
}) {
  const current = active ?? tabs[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--line-1)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, tabs.map(t => {
    const on = t === current;
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: () => onChange && onChange(t),
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: on ? 500 : 400,
        color: on ? 'var(--ink-1)' : 'var(--ink-4)',
        padding: '10px 16px',
        marginBottom: -1,
        borderBottom: on ? '2px solid var(--rust)' : '2px solid transparent',
        transition: 'color var(--dur-quick) var(--ease-breathe)'
      }
    }, t);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ds-loader.js
try { (() => {
window.__loadDS = function () {
  const FILES = ['components/forms/Button.jsx', 'components/forms/IconButton.jsx', 'components/forms/Input.jsx', 'components/forms/Select.jsx', 'components/forms/Checkbox.jsx', 'components/forms/Radio.jsx', 'components/forms/Switch.jsx', 'components/display/Card.jsx', 'components/display/Badge.jsx', 'components/display/Tag.jsx', 'components/navigation/Tabs.jsx', 'components/feedback/Dialog.jsx', 'components/feedback/Toast.jsx', 'components/feedback/Tooltip.jsx', 'ui_kits/portfolio/Home.jsx', 'ui_kits/portfolio/Work.jsx', 'ui_kits/portfolio/About.jsx'];
  let promise;
  return function (root) {
    if (!promise) promise = (async () => {
      let bundleOk = false;
      try {
        const probe = await fetch(root + '_ds_bundle.js');
        if (probe.ok) {
          await new Promise(res => {
            const s = document.createElement('script');
            s.src = root + '_ds_bundle.js';
            s.onload = res;
            s.onerror = res;
            document.head.appendChild(s);
          });
          bundleOk = true;
        }
      } catch (e) {}
      if (bundleOk) {
        for (const k of Object.keys(window)) {
          let v;
          try {
            v = window[k];
            if (v && typeof v === 'object' && typeof v.Button === 'function' && typeof v.Card === 'function') return v;
          } catch (e) {}
        }
      }
      let src = '';
      for (const f of FILES) {
        const r = await fetch(root + f);
        if (r.ok) src += (await r.text()) + '\n';
      }
      src = src.replace(/^import .*$/gm, '').replace(/export function/g, 'function');
      const names = [...src.matchAll(/^function ([A-Z]\w*)/gm)].map(m => m[1]);
      const code = Babel.transform(src, {
        presets: [['react', {
          runtime: 'classic'
        }]]
      }).code;
      return new Function('React', code + '\nreturn {' + names.join(',') + '};')(React);
    })();
    return promise;
  };
}();
window.__runJSX = function () {
  document.querySelectorAll('script[type="text/plain"][data-jsx]').forEach(el => {
    const code = Babel.transform(el.textContent, {
      presets: [['react', {
        runtime: 'classic'
      }]]
    }).code;
    new Function('React', 'ReactDOM', code)(React, ReactDOM);
  });
};
document.addEventListener('DOMContentLoaded', () => window.__runJSX());
})(); } catch (e) { __ds_ns.__errors.push({ path: "ds-loader.js", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/About.jsx
try { (() => {
function About() {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '64px 64px 96px',
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h1)',
      color: 'var(--text-heading)',
      margin: 0,
      fontWeight: 400
    }
  }, "About"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 160,
      height: 160,
      borderRadius: '50%',
      border: '1px solid var(--line-2)',
      background: 'repeating-linear-gradient(45deg, var(--paper-2), var(--paper-2) 8px, var(--paper-1) 8px, var(--paper-1) 16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      fontSize: 11,
      color: 'var(--ink-4)'
    }
  }, "portrait"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-lead)',
      fontWeight: 300,
      lineHeight: 1.65,
      color: 'var(--text-body)',
      maxWidth: '52ch',
      margin: 0
    }
  }, "I work where structure meets growth \u2014 bamboo architecture, biomimetic systems, and quiet software. Based between the grove and the desk."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-base)',
      lineHeight: 1.6,
      color: 'var(--text-body)',
      maxWidth: '58ch',
      margin: 0
    }
  }, "Everything here follows one rule: if nature wouldn't build it that way, neither will I.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h2)',
      color: 'var(--text-heading)',
      margin: 0,
      fontWeight: 400
    }
  }, "Leave a note"), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "Name",
    placeholder: "\u2026"
  }), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "Email",
    placeholder: "you@earth.com",
    helper: "Never shared."
  }), /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "Message",
    placeholder: "I read everything, slowly."
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    onClick: () => setSent(true)
  }, "Send")), sent && /*#__PURE__*/React.createElement(__ds_scope.Toast, {
    tone: "success"
  }, "Note sent.")));
}
Object.assign(__ds_scope, { About });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Home.jsx
try { (() => {
function Home({
  onExplore
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      padding: '96px 64px 80px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/radial-motif.svg",
    alt: "",
    style: {
      position: 'absolute',
      top: -140,
      right: -120,
      width: 520,
      opacity: 0.06,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-caption)',
      letterSpacing: 'var(--tracking-caption)',
      textTransform: 'uppercase',
      fontWeight: 500,
      color: 'var(--ochre-deep)'
    }
  }, "Design \xB7 bamboo \xB7 biomimicry"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-hero)',
      lineHeight: 1.1,
      color: 'var(--text-heading)',
      margin: 0,
      fontWeight: 400
    }
  }, "Grown, not made."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-lead)',
      fontWeight: 300,
      lineHeight: 1.65,
      color: 'var(--text-body)',
      maxWidth: '52ch',
      margin: 0
    }
  }, "I design structures and interfaces the way nature does \u2014 simple rules, repeated with patience, until something whole appears."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    onClick: onExplore
  }, "Explore work"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary"
  }, "About me")))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 64px 96px',
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-caption)',
      letterSpacing: 'var(--tracking-caption)',
      textTransform: 'uppercase',
      fontWeight: 500,
      color: 'var(--ink-4)'
    }
  }, "Selected work"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 24
    }
  }, [{
    t: 'Dome pavilion',
    d: 'A bamboo gridshell grown from a single radial rule.',
    tags: ['bamboo', 'geometry']
  }, {
    t: 'Leaf-vein atlas',
    d: 'Mapping venation patterns as layout systems.',
    tags: ['biomimicry', 'print']
  }, {
    t: 'Quiet interface',
    d: 'A reading app that breathes instead of notifying.',
    tags: ['product', 'calm']
  }].map(p => /*#__PURE__*/React.createElement(__ds_scope.Card, {
    key: p.t,
    eyebrow: "Project",
    title: p.t,
    hoverable: true,
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, p.tags.map(t => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
      key: t
    }, t)))
  }, p.d)))));
}
Object.assign(__ds_scope, { Home });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/Work.jsx
try { (() => {
const PROJECTS = [{
  t: 'Dome pavilion',
  d: 'A bamboo gridshell grown from a single radial rule.',
  cat: 'Structures',
  status: 'Rooted'
}, {
  t: 'Reed bridge study',
  d: 'Tension tests on woven reed for a footbridge span.',
  cat: 'Structures',
  status: 'Curing'
}, {
  t: 'Leaf-vein atlas',
  d: 'Mapping venation patterns as layout systems.',
  cat: 'Print',
  status: 'Rooted'
}, {
  t: 'Dome field notes',
  d: 'Watercolors and measurements from the build.',
  cat: 'Print',
  status: 'Rooted'
}, {
  t: 'Quiet interface',
  d: 'A reading app that breathes instead of notifying.',
  cat: 'Product',
  status: 'Curing'
}, {
  t: 'Season clock',
  d: 'A home display that tells time by light and leaf.',
  cat: 'Product',
  status: 'Rooted'
}];
function Work() {
  const [tab, setTab] = React.useState('All');
  const shown = PROJECTS.filter(p => tab === 'All' || p.cat === tab);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '64px 64px 96px',
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-h1)',
      color: 'var(--text-heading)',
      margin: 0,
      fontWeight: 400
    }
  }, "Work"), /*#__PURE__*/React.createElement(__ds_scope.Tabs, {
    tabs: ['All', 'Structures', 'Print', 'Product'],
    active: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, shown.map(p => /*#__PURE__*/React.createElement(__ds_scope.Card, {
    key: p.t,
    eyebrow: p.cat,
    title: p.t,
    hoverable: true,
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
      tone: p.status === 'Rooted' ? 'success' : 'warning'
    }, p.status), /*#__PURE__*/React.createElement(__ds_scope.Tag, null, p.cat.toLowerCase()))
  }, p.d))));
}
Object.assign(__ds_scope, { Work });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/Work.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.About = __ds_scope.About;

__ds_ns.Home = __ds_scope.Home;

__ds_ns.Work = __ds_scope.Work;

})();
