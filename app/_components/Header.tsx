import Link from 'next/link';

export default function Header() {
  return (
    <>
      <header className="position-sticky top-0 bg-white border-bottom" style={{ 
        zIndex: 1020, 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.85)' 
      }}>
        <div className="d-flex align-items-center justify-content-between px-3 py-3 container-fluid" style={{ maxWidth: '800px' }}>
          <Link href="/" className="text-decoration-none">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-2 d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'linear-gradient(135deg, #000000 0%, #333333 100%)'
                }}
              >
                A
              </div>
              <span className="fs-5 fw-bold text-dark">Apex AI</span>
            </div>
          </Link>

          <button
            className="btn btn-sm rounded-2 px-3 d-flex align-items-center gap-2 border-0 logout-btn"
            onClick={() => window.location.href = '/api/auth/logout'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      </header>
      
      <style jsx>{`
        .logout-btn {
          font-size: 0.875rem;
          background-color: #f1f5f9;
          color: #64748b;
          transition: all 0.2s ease;
        }
        .logout-btn:hover {
          background-color: #e2e8f0;
          color: #475569;
        }
      `}</style>
    </>
  );
}