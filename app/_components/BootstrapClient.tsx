'use client';

import { useEffect } from 'react';

function BootstrapClient() {
  useEffect(() => {
    // This dynamically imports Bootstrap's JS bundle.
    // It's placed here to ensure it only runs on the client.
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return null;
}

export default BootstrapClient;