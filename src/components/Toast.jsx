import { useState, useEffect, useCallback } from "react";

let _showToast = null;

export function useToast() {
  const show = useCallback((msg) => {
    if (_showToast) _showToast(msg);
  }, []);
  return show;
}

export default function Toast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    _showToast = (m) => {
      setMsg(m);
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), 2300);
    };
    return () => { _showToast = null; };
  }, []);

  return (
    <div className={`toast${visible ? " show" : ""}`}>{msg}</div>
  );
}
