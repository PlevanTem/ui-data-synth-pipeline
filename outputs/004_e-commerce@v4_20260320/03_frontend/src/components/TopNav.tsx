interface Props {
  onJump: (section: string) => void;
}

export function TopNav({ onJump }: Props) {
  return (
    <header className="glass nav-root">
      <div className="brand">CrossBorder Graph Commerce</div>
      <nav>
        <button onClick={() => onJump("search")}>搜索</button>
        <button onClick={() => onJump("graph")}>图谱</button>
        <button onClick={() => onJump("checkout")}>结账</button>
      </nav>
    </header>
  );
}
