document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // NAVIGATION LOGIC
  // ==========================================
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navLinksList = document.querySelector('.nav-links');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Highlighting active nav link based on section scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // Mobile navigation menu toggle
  mobileNavToggle.addEventListener('click', () => {
    const isOpen = navLinksList.classList.toggle('open');
    if (isOpen) {
      mobileNavToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
      mobileNavToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });

  // Close mobile nav when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinksList.classList.remove('open');
        mobileNavToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  });


  // ==========================================
  // DOSSIER / CERTIFICATE FILTERING
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const dossierCards = document.querySelectorAll('.dossier-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Set active button styling
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterVal = button.getAttribute('data-filter');

      dossierCards.forEach(card => {
        if (filterVal === 'all') {
          card.style.display = 'flex';
        } else {
          if (card.classList.contains(filterVal)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });


  // ==========================================
  // INTERACTIVE LAB SANDBOX CORE MANAGER
  // ==========================================
  const labSelectors = document.querySelectorAll('.lab-selector-btn');
  const sandboxViews = document.querySelectorAll('.sandbox-view');
  const workstationTitle = document.getElementById('workstation-title-text');
  const workstationStatus = document.getElementById('workstation-status');

  labSelectors.forEach(selector => {
    selector.addEventListener('click', () => {
      // Toggle selector buttons
      labSelectors.forEach(sel => sel.classList.remove('active'));
      selector.classList.add('active');

      // Toggle views
      const targetViewId = selector.getAttribute('data-target');
      sandboxViews.forEach(view => view.classList.remove('active'));
      document.getElementById(targetViewId).classList.add('active');

      // Update Header Text and State
      const viewTitle = selector.querySelector('.btn-text h4').innerText;
      workstationTitle.innerHTML = `<i class="fa-solid fa-microscope"></i> Workstation: ${viewTitle}`;
      
      resetLabWorkstations(targetViewId);
    });
  });

  function resetLabWorkstations(activeViewId) {
    workstationStatus.innerText = 'READY FOR SCAN';
    workstationStatus.style.background = 'rgba(0, 229, 255, 0.08)';
    workstationStatus.style.borderColor = 'var(--border-cyan)';
    workstationStatus.style.color = 'var(--color-cyan)';

    if (activeViewId === 'dna-sandbox') {
      workstationStatus.style.background = 'rgba(0, 230, 118, 0.08)';
      workstationStatus.style.borderColor = 'var(--border-green)';
      workstationStatus.style.color = 'var(--color-green)';
      // Reset DNA Gel
      document.getElementById('dna-chamber').classList.remove('running');
      document.getElementById('dna-chamber').classList.remove('completed');
      document.getElementById('dna-status').innerText = "Chamber Offline. Click 'Run Electrophoresis' to initiate charge current.";
    } else if (activeViewId === 'fingerprint-sandbox') {
      // Reset Fingerprints
      const scanner = document.getElementById('f-scanner');
      scanner.classList.remove('scanning');
      document.querySelectorAll('.f-db-thumb').forEach(t => t.classList.remove('selected'));
      document.getElementById('f-status').innerText = 'Select a suspect print from the database to compare with the crime scene latent print.';
      document.getElementById('run-f-scan').setAttribute('disabled', 'true');
    } else if (activeViewId === 'cyber-sandbox') {
      // Reset Cyber Terminal
      document.getElementById('cyber-terminal').innerHTML = '[SYSTEM INITIALIZED] ready for scan...<br>Click \'Initiate Port Inspection\' to audit traffic logs.';
    } else if (activeViewId === 'document-sandbox') {
      workstationStatus.style.background = 'rgba(255, 145, 0, 0.08)';
      workstationStatus.style.borderColor = 'var(--color-orange)';
      workstationStatus.style.color = 'var(--color-orange)';
      // Reset Handwriting Specimens
      document.getElementById('doc-crime').classList.remove('active-scan');
      document.getElementById('doc-suspect').classList.remove('active-scan');
      document.getElementById('doc-status').innerText = "Inspect loop curvature, stroke speed, and terminal junctions. Click 'Analyze Handwriting' to trigger grid alignment.";
    }
  }


  // ==========================================
  // SANDBOX 1: FINGERPRINT SCANNER LOGIC
  // ==========================================
  const fThumbs = document.querySelectorAll('.f-db-thumb');
  const runFScanBtn = document.getElementById('run-f-scan');
  const fScanner = document.getElementById('f-scanner');
  const fStatusBox = document.getElementById('f-status');
  let selectedSuspect = null;

  fThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      fThumbs.forEach(t => t.classList.remove('selected'));
      thumb.classList.add('selected');
      selectedSuspect = thumb.getAttribute('data-suspect');
      runFScanBtn.removeAttribute('disabled');

      if (selectedSuspect === '3') {
        fStatusBox.innerHTML = `<strong>SUSPECT LOADED: Suspect C</strong><br>Visual comparison shows matches in whorl counts and bifurcation paths. Ready for biometric scanning audit.`;
      } else {
        fStatusBox.innerHTML = `<strong>SUSPECT LOADED: Suspect ${selectedSuspect === '1' ? 'A' : 'B'}</strong><br>Obvious structural discrepancy in loop configurations. Ready for biometric scanning audit.`;
      }
    });
  });

  runFScanBtn.addEventListener('click', () => {
    if (!selectedSuspect) return;

    // Trigger scanning states
    fScanner.classList.add('scanning');
    runFScanBtn.setAttribute('disabled', 'true');
    fThumbs.forEach(t => t.style.pointerEvents = 'none');
    workstationStatus.innerText = 'BIOMETRIC SCANNING IN PROGRESS...';
    fStatusBox.innerText = 'Running ridge tracing algorithm... mapping minutiae coordinates.';

    setTimeout(() => {
      fScanner.classList.remove('scanning');
      fThumbs.forEach(t => t.style.pointerEvents = 'auto');
      runFScanBtn.removeAttribute('disabled');
      workstationStatus.innerText = 'ANALYSIS COMPLETE';

      if (selectedSuspect === '3') {
        fStatusBox.innerHTML = `<span style="color:var(--color-green)"><strong>MATCH VERDICT: MATCH SECURED (99.8% Core Similarity)</strong></span><br>Suspect C minutiae details (bifurcations, lakes, and ridge endings) map exactly to crime scene latent print. Evidence logged.`;
        workstationStatus.style.color = 'var(--color-green)';
        workstationStatus.style.borderColor = 'var(--border-green)';
        workstationStatus.style.background = 'rgba(0, 230, 118, 0.08)';
      } else {
        const suspectName = selectedSuspect === '1' ? 'Suspect A' : 'Suspect B';
        fStatusBox.innerHTML = `<span style="color:var(--color-orange)"><strong>MATCH VERDICT: DISCREPANCY DETECTED (Mismatched Minutiae)</strong></span><br>${suspectName} exhibits tented arch patterns, whereas evidence print contains a pocket whorl loop. Probability of common origin: 0.04%.`;
        workstationStatus.style.color = 'var(--color-orange)';
        workstationStatus.style.borderColor = 'var(--color-orange)';
        workstationStatus.style.background = 'rgba(255, 145, 0, 0.08)';
      }
    }, 2500);
  });


  // ==========================================
  // SANDBOX 2: DNA ELECTROPHORESIS LOGIC
  // ==========================================
  const runDnaGelBtn = document.getElementById('run-dna-gel');
  const dnaChamber = document.getElementById('dna-chamber');
  const dnaStatusBox = document.getElementById('dna-status');

  runDnaGelBtn.addEventListener('click', () => {
    dnaChamber.classList.add('running');
    dnaChamber.classList.remove('completed');
    runDnaGelBtn.setAttribute('disabled', 'true');
    workstationStatus.innerText = 'ELECTROPHORESIS RUNNING...';
    dnaStatusBox.innerText = '[STATUS: OK] Chamber pressurized. Applying 100V electrical gradient. DNA fragments migrating...';

    // Step-by-step logs simulating chemical reaction
    setTimeout(() => {
      dnaStatusBox.innerHTML = '[STATUS: OK] Charge active. Buffer solution ph: 8.0.<br>Fragment separation ongoing: smaller molecules migrating faster.';
    }, 1200);

    setTimeout(() => {
      dnaStatusBox.innerHTML = '[STATUS: OK] Electrophoresis complete. UV visualization lamp initialized. Analyzing STR loci configurations...';
    }, 2500);

    setTimeout(() => {
      dnaChamber.classList.remove('running');
      dnaChamber.classList.add('completed');
      runDnaGelBtn.removeAttribute('disabled');
      workstationStatus.innerText = 'ANALYSIS COMPLETE';

      dnaStatusBox.innerHTML = `<span style="color:var(--color-green)"><strong>STR MATCH LOCKED: SUSPECT B</strong></span><br>Gel banding index shows 100% locus coordination between Evidence lane and Suspect B lane. Suspect A exhibits significant genetic drift (locus CSF1PO alleles mismatch).`;
    }, 4000);
  });


  // ==========================================
  // SANDBOX 3: CYBER PORT SCANNER TERMINAL
  // ==========================================
  const runPortScanBtn = document.getElementById('run-port-scan');
  const clearTerminalBtn = document.getElementById('clear-terminal');
  const cyberTerminal = document.getElementById('cyber-terminal');

  const simulatedTerminalLines = [
    "[INFO] Initializing Cyber Forensics Audit Module...",
    "[INFO] Checking firewall policies and active network listeners...",
    "[SCAN] Scanning Ports 1-1024...",
    "[OK] Port 80 (HTTP) - Active, no vulnerabilities found.",
    "[OK] Port 22 (SSH) - Cryptographic keys compliant with RSA 4096.",
    "[WARN] Port 443 (HTTPS) - Detecting atypical packet payload size.",
    "[INSPECT] Deep-packet auditing TCP stream [192.168.1.15 -> WAN]...",
    "[ALERT] UNUSUAL HEADER SPECIFICATION DETECTED // MOBILE HOST AGENT",
    "[ALERT] Found mobile trojan injection vector (Android.Spy.Dropper payload).",
    "[ACTION] Flagging transaction logs for judicial custody...",
    "[SUCCESS] Packet payloads decrypted and exported to case_dossier.pcap.",
    "[SUCCESS] Interface isolated. Threat neutralized."
  ];

  runPortScanBtn.addEventListener('click', () => {
    runPortScanBtn.setAttribute('disabled', 'true');
    cyberTerminal.innerHTML = '';
    workstationStatus.innerText = 'INSPECTING PORTS...';
    
    let lineIndex = 0;
    
    function printNextLine() {
      if (lineIndex < simulatedTerminalLines.length) {
        let line = simulatedTerminalLines[lineIndex];
        let colorStyle = 'color: var(--color-cyan);';
        
        if (line.includes('[ALERT]')) {
          colorStyle = 'color: var(--color-orange); font-weight: bold; text-shadow: 0 0 5px rgba(255,145,0,0.5);';
        } else if (line.includes('[SUCCESS]')) {
          colorStyle = 'color: var(--color-green); font-weight: bold;';
        }
        
        cyberTerminal.innerHTML += `<div style="${colorStyle}">${line}</div>`;
        cyberTerminal.scrollTop = cyberTerminal.scrollHeight; // Auto scroll to bottom
        lineIndex++;
        setTimeout(printNextLine, 500);
      } else {
        runPortScanBtn.removeAttribute('disabled');
        workstationStatus.innerText = 'SCAN COMPLETED';
      }
    }
    
    printNextLine();
  });

  clearTerminalBtn.addEventListener('click', () => {
    cyberTerminal.innerHTML = '[TERMINAL READY]';
    workstationStatus.innerText = 'READY FOR SCAN';
  });


  // ==========================================
  // SANDBOX 4: DOCUMENT ANALYSIS LOGIC
  // ==========================================
  const runDocAnalysisBtn = document.getElementById('run-doc-analysis');
  const docCrime = document.getElementById('doc-crime');
  const docSuspect = document.getElementById('doc-suspect');
  const docStatus = document.getElementById('doc-status');

  runDocAnalysisBtn.addEventListener('click', () => {
    docCrime.classList.add('active-scan');
    docSuspect.classList.add('active-scan');
    runDocAnalysisBtn.setAttribute('disabled', 'true');
    workstationStatus.innerText = 'HANDWRITING GRID SYSTEM ENGAGING...';
    docStatus.innerText = 'Calculating pen slope, ink stroke pressure depth, and curvature loops...';

    setTimeout(() => {
      docStatus.innerText = 'Mapping specific characters loops: examining letter "Q" loop closures and letter "k" ascender heights.';
    }, 1500);

    setTimeout(() => {
      docCrime.classList.remove('active-scan');
      docSuspect.classList.remove('active-scan');
      runDocAnalysisBtn.removeAttribute('disabled');
      workstationStatus.innerText = 'ANALYSIS COMPLETE';
      
      docStatus.innerHTML = `<span style="color:var(--color-orange)"><strong>GRAPHOLOGY FINDING: POSITIVE IDENTIFICATION</strong></span><br>Specimen Q-1 (questioned handwriting) demonstrates identical pressure gradients, drag velocity, and a 12.5-degree slant profile matching Specimen K-1. Highly probable common origin.`;
    }, 3000);
  });

});
