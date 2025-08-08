'use client';

export default function HomePageContent() {
  return (
    <>
      {/* Navbar */}
    <nav className="navbar navbar-light bg-white border-bottom sticky-top">
  <div className="container-fluid px-3 px-md-4 d-flex align-items-center justify-content-between">
    <div className="navbar-brand d-flex align-items-center gap-2">
      <div
        className="rounded-2 d-flex align-items-center justify-content-center text-white fw-bold"
        style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, rgb(0, 0, 0) 0%, rgb(51, 51, 51) 100%)',
          fontSize: '1.2rem'
        }}
      >
        A
      </div>
      <span className="fw-semibold fs-4 text-dark mb-0">Apex AI</span>
    </div>

    {/* Styled Start Now Button */}
    <a
      href="/api/auth/login"
      className="btn btn-dark btn-lg px-4 py-2 rounded-pill d-flex align-items-center gap-2"
    >
      <span>Start Now</span>
      <i className="bi bi-arrow-right"></i>
    </a>
  </div>
</nav>



      {/* Hero Section */}
      <main className="container-fluid px-0">
        <div className="container px-3 px-md-4 pt-4 pb-5">
          {/* Status Badge */}
          <div className="d-flex align-items-center justify-content-center mb-4">
            <div className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 d-flex align-items-center">
              <span className="bg-success rounded-pill me-2" style={{ width: '8px', height: '8px' }}></span>
              <span style={{ fontWeight: '600' }}>AI Ready</span>
            </div>
          </div>

          {/* Hero Text */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-4 lh-sm">
              Your pocket
              <span
                className="d-block fw-semibold"
                style={{
                  background: 'linear-gradient(90deg, #0d6efd, #6610f2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                AI assistant
              </span>
            </h1>

            <p className="lead text-muted mb-4 px-lg-5">
              Chat with AI, generate images, and boost productivity - all from your mobile device.
            </p>

            {/* Feature Pills */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
              <div className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                <span className="me-2">🤖</span>Smart Chat
              </div>
              <div className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                <span className="me-2">🎨</span>AI Images
              </div>
              <div className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                <span className="me-2">⚡</span>Instant
              </div>
            </div>
          </div>

          {/* Chat UI Mockup */}
          <div className="row justify-content-center mb-5">
            <div className="col-12 col-sm-8 col-md-6 col-lg-4">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden mobile-mockup">
                {/* Phone header */}
                <div className="bg-dark text-white p-2 text-center position-relative">
                  <div className="bg-white rounded-pill mx-auto" style={{ width: '100px', height: '4px' }}></div>
                </div>

                {/* Chat UI */}
                <div className="card-body p-0" style={{ height: '400px' }}>
                  <div className="d-flex align-items-center p-3 border-bottom bg-light">
                    <div className="bg-dark rounded-circle p-2 me-2">
                      <i className="bi bi-robot text-white"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0 fw-semibold">Apex AI</h6>
                      <small className="text-success">Online</small>
                    </div>
                    <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                  </div>

                  <div className="p-3 h-100 overflow-auto">
                    {/* AI message */}
                    <div className="d-flex mb-3">
                      <div className="bg-light rounded-3 rounded-start-1 p-3 flex-grow-1 me-5">
                        <p className="mb-0 small">Hey! I'm your AI assistant. How can I help you today?</p>
                      </div>
                    </div>

                    {/* User message */}
                    <div className="d-flex mb-3 justify-content-end">
                      <div className="bg-dark text-white rounded-3 rounded-end-1 p-3 ms-5">
                        <p className="mb-0 small">Create an image of a sunset</p>
                      </div>
                    </div>

                    {/* AI image reply */}
                    <div className="d-flex mb-3">
                      <div className="bg-light rounded-3 rounded-start-1 p-3 flex-grow-1 me-5">
                        <div className="bg-gradient bg-warning rounded-3 p-4 text-center mb-2">
                          <i className="bi bi-image fs-1 text-white"></i>
                        </div>
                        <p className="mb-0 small text-muted">Beautiful sunset generated!</p>
                      </div>
                    </div>

                    {/* Typing indicator */}
                    <div className="d-flex">
                      <div className="bg-light rounded-3 rounded-start-1 p-3">
                        <div className="d-flex gap-1">
                          <div className="bg-secondary rounded-circle typing-dot" style={{ width: '6px', height: '6px' }}></div>
                          <div className="bg-secondary rounded-circle typing-dot" style={{ width: '6px', height: '6px', animationDelay: '0.2s' }}></div>
                          <div className="bg-secondary rounded-circle typing-dot" style={{ width: '6px', height: '6px', animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-5">
            <a href="/api/auth/login" className="btn btn-dark btn-lg px-5 py-3 rounded-pill mb-4 d-inline-flex align-items-center gap-2">
              <span>Start Chatting</span>
              <i className="bi bi-arrow-right"></i>
            </a>
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <hr className="flex-grow-1" />
                <span className="px-3 text-muted small fw-medium">Quick & Secure</span>
                <hr className="flex-grow-1" />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <section className="mb-5">
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-3">Everything you need</h2>
              <p className="text-muted">Powerful AI capabilities designed for mobile</p>
            </div>

            <div className="row g-4">
              {/* Feature Cards */}
              {[
                {
                  title: 'Natural Conversations',
                  desc: 'Chat naturally with AI that understands context and provides helpful responses.',
                  bg: 'primary',
                  icon: 'https://www.svgrepo.com/show/513889/chat-message-heart.svg',
                },
                {
                  title: 'Instant Image Creation',
                  desc: 'Generate stunning images from text descriptions in seconds.',
                  bg: 'success',
                  icon: 'https://www.svgrepo.com/show/532570/image-pen.svg',
                },
                {
                  title: 'Lightning Fast',
                  desc: 'Optimized for mobile with instant responses and smooth performance.',
                  bg: 'warning',
                  icon: 'https://www.svgrepo.com/show/535218/bolt.svg',
                },
                {
                  title: 'Smart Memory',
                  desc: 'Remembers your conversation history and preferences across sessions.',
                  bg: 'info',
                  icon: 'https://www.svgrepo.com/show/514073/chain.svg',
                },
              ].map((feature, index) => (
                <div key={index} className="col-12 col-md-6">
                  <div className="card border-0 h-100 text-center p-4">
                    <div
                      className={`bg-${feature.bg} bg-opacity-10 rounded-4 p-3 d-inline-flex align-items-center justify-content-center mx-auto mb-3`}
                      style={{ width: '80px', height: '80px' }}
                    >
                      <img src={feature.icon} alt={feature.title} style={{ width: '40px', height: '40px' }} />
                    </div>
                    <h5 className="fw-semibold mb-3">{feature.title}</h5>
                    <p className="text-muted small">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="bg-dark bg-gradient rounded-4 p-5 text-center text-white">
            <h2 className="fw-bold  mb-3">Ready to get started?</h2>
            <p className="mb-4 opacity-75">Join thousands of users already using Apex AI</p>
            <a href="/api/auth/login" className="btn btn-light px-3 py-3 rounded-pill">
              Get Started Now
            </a>
          </section>
        </div>
      </main>

      {/* Scoped Styles */}
      <style jsx>{`
        .mobile-mockup {
          max-width: 300px;
          margin: 0 auto;
        }
        .typing-dot {
          animation: typing 1.4s ease-in-out infinite;
        }
        @keyframes typing {
          0%, 60% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
