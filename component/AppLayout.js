export default function AppLayout({ children, background }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(
          rgba(0,0,0,0.55),
          rgba(0,0,0,0.55)
        ), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '40px',
      }}
    >
      {children}
    </div>
  );
}

