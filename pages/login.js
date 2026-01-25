export default function LoginPage() {
  ...
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/login-bg.png')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          padding: 32,
          borderRadius: 12,
          width: 380,
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: 20 }}>
          Stratavax Assessment
        </h1>

        {/* form inputs here */}
      </div>
    </div>
  )
}



