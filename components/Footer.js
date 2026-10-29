export default function Footer() {
  return (
    <footer className="border-t border-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-zinc-500">
        <p>DevBoard, projet ECE WebTech 2026</p>
        <p>
          <a href="https://github.com/ivanfocsa" className="link">Yvan Focsa</a>,{' '}
          <a href="https://github.com/Kardiatou0" className="link">Kardiatou Touré</a>,{' '}
          <a href="https://github.com/Emirates917" className="link">Emir Ben Hassen</a>
        </p>
      </div>
    </footer>
  );
}
