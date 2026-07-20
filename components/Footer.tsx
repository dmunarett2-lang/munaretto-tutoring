export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="wrap footer-inner">
        <div>© {year} Munaretto Tutoring — Dominic Munaretto</div>
        <div>Based in the Chicago area</div>
      </div>
    </footer>
  );
}
