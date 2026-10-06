/**
 * NEXUS ENTERPRISE WORKSPACE CONTROLLER
 * Approachable, friendly, customer-centric interactive experience
 */

// ============================================================================
// 1. STATE & DATA REPOSITORIES (HUMAN-FRIENDLY & JARGON-FREE)
// ============================================================================

const NexusState = {
  activeTab: 'overview',
  chartPeriod: '7d',
  omniFilter: 'all',
  selectedOmniIndex: 0,
  
  notifications: [
    { id: 1, icon: '⚠️', text: 'Unexpected AWS charge of $41,200 needs your review before payment.', time: '10 mins ago', unread: true },
    { id: 2, icon: '📄', text: 'Datadog Partner contract is waiting for signature approval.', time: '1 hour ago', unread: true },
    { id: 3, icon: '✅', text: '14 customer support tickets were automatically categorized.', time: '3 hours ago', unread: true }
  ],

  pendingApprovals: [
    {
      id: 'WF-204',
      title: 'Unexpected Cloud Bill ($41,200 AWS Charge)',
      system: 'Accounting (SAP & AWS)',
      risk: 'high',
      amount: '$41,200.00',
      summary: 'A new high-performance cloud computer was turned on in the US-East server room without an approved team budget code.',
      changes: [
        { label: 'Amount', value: '$41,200.00' },
        { label: 'Department', value: 'Engineering Dev Sandbox' },
        { label: 'Reason for Flag', value: 'Exceeds standard $5,000 auto-approval threshold' },
        { label: 'Action If Approved', value: 'Approve invoice and assign to Q3 Engineering Cloud Budget' }
      ],
      diffPayload: `+ [Accounting Ledger] Pending Bill: $41,200.00
+ Account: 1042-Cloud-Compute-Dev
- Approved Budget: $0.00
! Notice: High-memory server instance p4de.24xlarge running in Ohio`,
      recommendedAction: 'Verify with Tech Lead or approve invoice to avoid server suspension.'
    },
    {
      id: 'WF-198',
      title: 'New Vendor Security Review (Datadog Contract)',
      system: 'Google Drive & Procurement',
      risk: 'medium',
      amount: 'N/A',
      summary: 'Datadog submitted their standard security and privacy paperwork. Their security report is clean, but a standard European data addendum is missing.',
      changes: [
        { label: 'Vendor Name', value: 'Datadog Inc.' },
        { label: 'Security Score', value: '98% Safe (SOC 2 Type II audit verified)' },
        { label: 'Missing Item', value: 'Standard EU Privacy Addendum (DPA Annex B)' },
        { label: 'Action If Approved', value: 'Send one-click DocuSign request for the missing signature' }
      ],
      diffPayload: `+ [Vendor Master File] Datadog Inc
+ Security Rating: Passed (Very Low Risk)
! Pending: Request standard signature on Annex B privacy terms`,
      recommendedAction: 'Approve to automatically email the vendor for the required signature.'
    },
    {
      id: 'WF-209',
      title: 'Fix Slowdown on US Servers (Roll Back Update)',
      system: 'Tech Infrastructure',
      risk: 'high',
      amount: 'N/A',
      summary: 'A software update sent this morning caused high memory usage on customer login servers. A tested safe rollback is ready to apply.',
      changes: [
        { label: 'Problem', value: 'Server memory full on Login Cluster' },
        { label: 'Customers Impacted', value: '~1,420 users seeing slightly slower login times' },
        { label: 'Safety Check', value: 'Tested 14 times on test servers without any errors' },
        { label: 'Action If Approved', value: 'Roll back to yesterday’s fast and stable version' }
      ],
      diffPayload: `--- a/server_config.yaml
+++ b/server_config.yaml
-  cache_retention: "never_expire"
+  cache_retention: "auto_clean_old_sessions"
-  active_servers: 3
+  active_servers: 6`,
      recommendedAction: 'Apply the fix immediately to return login speeds to normal.'
    }
  ],

  liveActivities: [
    {
      agent: 'Company Search Engine',
      action: 'Indexed 128 newly edited Google Docs and policy guides while keeping private data hidden.',
      time: 'Just now',
      status: 'success'
    },
    {
      agent: 'Helpdesk Assistant',
      action: 'Sorted 14 customer support requests and routed 3 urgent ones to the specialist team.',
      time: '3m ago',
      status: 'success'
    },
    {
      agent: 'Team Directory',
      action: 'Updated employee departments and permissions for all 8,400 team members.',
      time: '9m ago',
      status: 'success'
    },
    {
      agent: 'Finance Assistant',
      action: 'Checked 1,240 customer subscription bills; zero duplicate charges found.',
      time: '18m ago',
      status: 'success'
    }
  ],

  auditLedger: [
    {
      timestamp: 'Today at 09:14 AM',
      actor: 'Nexus AI (Finance Assistant)',
      action: 'Reviewed monthly accounting ledger',
      target: 'NetSuite & SAP',
      scope: 'Finance: Read Only',
      hash: 'Shield Verified',
      status: 'Protected'
    },
    {
      timestamp: 'Today at 09:05 AM',
      actor: 'Alexandre Kim (Operations Lead)',
      action: 'Approved Vendor Requisition (VND-8819)',
      target: 'SAP Vendor Master',
      scope: 'Procurement: Manager Approval',
      hash: 'Signed by Alexandre',
      status: 'Approved'
    },
    {
      timestamp: 'Today at 08:52 AM',
      actor: 'Nexus AI (Tech Assistant)',
      action: 'Diagnosed slow login issue on US servers',
      target: 'Server Monitoring',
      scope: 'Tech: Read Only',
      hash: 'Shield Verified',
      status: 'Report Ready'
    },
    {
      timestamp: 'Today at 08:30 AM',
      actor: 'Nexus Core Scheduler',
      action: 'Refreshed company team permissions',
      target: 'Okta & Google Workspace',
      scope: 'Security Directory Sync',
      hash: 'Shield Verified',
      status: 'Up to Date'
    }
  ]
};

// ============================================================================
// 2. INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSidebar();
  initNotifications();
  initHelpModal();
  initLinkAppModal();
  initOmniSearch();
  initSparklines();
  initVelocityChart();
  initApprovalDrawer();
  initDispatchModal();
  initRAGPlayground();
  renderApprovalList();
  renderWorkflowsCatalog();
  renderPredictiveInsights();
  renderIntegrationsMatrix();
  renderLiveActivities();
  renderAuditTable();
  initBannerButton();
});

// ============================================================================
// 3. NAVIGATION & TABS
// ============================================================================

function initNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  const panes = document.querySelectorAll('.tab-pane');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');
      if (!targetTab) return;

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      panes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `view-${targetTab}`) {
          pane.classList.add('active');
        }
      });

      NexusState.activeTab = targetTab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Quick link from Connected Apps on overview
  const manageAppsBtn = document.getElementById('manageAppsQuickBtn');
  if (manageAppsBtn) {
    manageAppsBtn.addEventListener('click', () => switchTab('integrations'));
  }
}

function switchTab(tabKey) {
  const navItem = document.querySelector(`.sidebar-nav .nav-item[data-tab="${tabKey}"]`);
  if (navItem) navItem.click();
}

function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }
}

function initBannerButton() {
  const btn = document.getElementById('reviewQueueBannerBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (NexusState.pendingApprovals.length > 0) {
        openApprovalDrawer(NexusState.pendingApprovals[0].id);
      } else {
        showToast('All items have been reviewed! Your queue is empty.');
      }
    });
  }
}

// ============================================================================
// 4. NOTIFICATIONS DROPDOWN
// ============================================================================

function initNotifications() {
  const btn = document.getElementById('notificationsBtn');
  const dropdown = document.getElementById('notifDropdown');
  const clearBtn = document.getElementById('clearNotifsBtn');
  const list = document.getElementById('notifList');
  const badge = document.getElementById('notifBadge');

  function renderNotifs() {
    if (!list) return;
    if (NexusState.notifications.length === 0) {
      list.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
          No unread notifications!
        </div>
      `;
      if (badge) badge.classList.add('hidden');
      return;
    }

    list.innerHTML = NexusState.notifications.map(n => `
      <div class="notif-item" onclick="handleNotificationClick(${n.id})">
        <div class="notif-item-icon">${n.icon}</div>
        <div class="notif-item-text">
          <div>${escapeHtml(n.text)}</div>
          <div class="notif-item-time">${n.time}</div>
        </div>
      </div>
    `).join('');
  }

  renderNotifs();

  if (btn && dropdown) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== btn) {
        dropdown.classList.add('hidden');
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      NexusState.notifications = [];
      renderNotifs();
      showToast('All notifications marked as read.');
      if (dropdown) dropdown.classList.add('hidden');
    });
  }
}

function handleNotificationClick(id) {
  const notif = NexusState.notifications.find(n => n.id === id);
  const dropdown = document.getElementById('notifDropdown');
  if (dropdown) dropdown.classList.add('hidden');

  if (id === 1) {
    openApprovalDrawer('WF-204');
  } else if (id === 2) {
    openApprovalDrawer('WF-198');
  } else {
    showToast(notif ? notif.text : 'Opened notification');
  }
}

// ============================================================================
// 5. QUICK TOUR / HELP MODAL
// ============================================================================

function initHelpModal() {
  const btn = document.getElementById('helpTourBtn');
  const overlay = document.getElementById('helpModalOverlay');
  const closeBtn = document.getElementById('closeHelpBtn');
  const gotItBtn = document.getElementById('gotItHelpBtn');

  function openHelp() {
    if (overlay) overlay.classList.remove('hidden');
  }

  function closeHelp() {
    if (overlay) overlay.classList.add('hidden');
  }

  if (btn) btn.addEventListener('click', openHelp);
  if (closeBtn) closeBtn.addEventListener('click', closeHelp);
  if (gotItBtn) gotItBtn.addEventListener('click', closeHelp);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeHelp();
    });
  }
}

// ============================================================================
// 6. LINK NEW APP MODAL
// ============================================================================

function initLinkAppModal() {
  const btn = document.getElementById('connectNewAppBtn');
  const overlay = document.getElementById('linkAppModalOverlay');
  const closeBtn = document.getElementById('closeLinkAppBtn');
  const cancelBtn = document.getElementById('cancelLinkAppBtn');

  function openLinkModal() {
    if (overlay) overlay.classList.remove('hidden');
  }

  function closeLinkModal() {
    if (overlay) overlay.classList.add('hidden');
  }

  if (btn) btn.addEventListener('click', openLinkModal);
  if (closeBtn) closeBtn.addEventListener('click', closeLinkModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeLinkModal);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLinkModal();
    });
  }
}

function simulateConnectApp(appName) {
  const overlay = document.getElementById('linkAppModalOverlay');
  if (overlay) overlay.classList.add('hidden');

  showToast(`Successfully linked ${appName} to Nexus! Your data is now searchable.`);

  // Add to Activity Feed
  NexusState.liveActivities.unshift({
    agent: 'App Connector',
    action: `Linked ${appName} workspace. Permission checks passed.`,
    time: 'Just now',
    status: 'success'
  });
  renderLiveActivities();
}

// ============================================================================
// 7. MINI SVG SPARKLINES IN KPI CARDS
// ============================================================================

function initSparklines() {
  drawSparkline('sparkline1', [35, 28, 22, 19, 14, 10, 6], '#4F46E5');
  drawSparkline('sparkline2', [65, 70, 72, 78, 80, 83, 84], '#10B981');
  drawSparkline('sparkline3', [110, 125, 134, 150, 168, 175, 184], '#10B981');
  drawSparkline('sparkline4', [100, 100, 100, 100, 100, 100, 100], '#0284C7');
}

function drawSparkline(elementId, values, color) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const min = Math.min(...values);
  const max = Math.max(...values) || 1;
  const w = 220;
  const h = 28;

  const points = values.map((val, i) => {
    const x = (w / (values.length - 1)) * i;
    const y = h - 4 - ((val - min) / ((max - min) || 1)) * (h - 8);
    return `${x},${y}`;
  }).join(' ');

  el.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <polyline fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
    </svg>
  `;
}

// ============================================================================
// 8. OMNI-SEARCH COMMAND BAR (RAYCAST / SPOTLIGHT STYLE)
// ============================================================================

const omniSuggestions = [
  {
    category: 'RECOMMENDED TASKS',
    type: 'actions',
    items: [
      { id: 'act-1', text: 'Review new vendor security paperwork & contract', icon: '⚡', badge: 'Task 1' },
      { id: 'act-2', text: 'Compare team cloud spending against monthly budget', icon: '📊', badge: 'Task 2' },
      { id: 'act-3', text: 'Troubleshoot slow server speeds & apply tested fix', icon: '🛡️', badge: 'Task 3' },
      { id: 'act-4', text: 'Scan company contracts for unusual liability terms', icon: '📑', badge: 'Task 4' },
      { id: 'act-5', text: 'Check engineering workload & create job opening', icon: '👥', badge: 'Task 5' }
    ]
  },
  {
    category: 'ASK COMPANY AI',
    type: 'rag',
    items: [
      { id: 'rag-1', text: 'Compare Q3 cloud spending with our approved budget', icon: '🔍', badge: 'Accounting & Tech' },
      { id: 'rag-2', text: 'What is our company policy on vendor liability limits?', icon: '🔍', badge: 'Company Handbook' },
      { id: 'rag-3', text: 'Who can approve contracts above $50k in EMEA?', icon: '🔍', badge: 'Workday & Google Drive' },
      { id: 'rag-4', text: 'Show open IT support tickets waiting on customers', icon: '🔍', badge: 'Helpdesk' }
    ]
  },
  {
    category: 'JUMP TO PAGE',
    type: 'nav',
    items: [
      { id: 'nav-overview', text: 'Go to Dashboard', icon: '🧭', badge: 'Home' },
      { id: 'nav-workflows', text: 'View all Smart Automated Workflows', icon: '⚡', badge: 'Workflows' },
      { id: 'nav-knowledge', text: 'Search Company Documents & Answers', icon: '📚', badge: 'Ask AI' },
      { id: 'nav-integrations', text: 'Manage Connected Apps (Salesforce, Google, Jira)', icon: '🔌', badge: 'Apps' },
      { id: 'nav-audit', text: 'View Recent Activity History', icon: '🔒', badge: 'Activity' }
    ]
  }
];

function initOmniSearch() {
  const triggerBtn = document.getElementById('omniSearchTrigger');
  const overlay = document.getElementById('omniModalOverlay');
  const closeBtn = document.getElementById('omniCloseBtn');
  const input = document.getElementById('omniInput');
  const filterTabs = document.querySelectorAll('.omni-tab');

  function openOmni() {
    overlay.classList.remove('hidden');
    input.value = '';
    NexusState.omniFilter = 'all';
    NexusState.selectedOmniIndex = 0;
    filterTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-filter') === 'all'));
    renderOmniResults('');
    setTimeout(() => input.focus(), 60);
  }

  function closeOmni() {
    overlay.classList.add('hidden');
  }

  if (triggerBtn) triggerBtn.addEventListener('click', openOmni);
  if (closeBtn) closeBtn.addEventListener('click', closeOmni);

  // Keyboard shortcut Ctrl+K / Cmd+K and Escape
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay.classList.contains('hidden')) {
        openOmni();
      } else {
        closeOmni();
      }
    } else if (e.key === 'Escape') {
      closeOmni();
      closeApprovalDrawer();
      closeDispatchModal();
      const helpOverlay = document.getElementById('helpModalOverlay');
      if (helpOverlay) helpOverlay.classList.add('hidden');
      const linkOverlay = document.getElementById('linkAppModalOverlay');
      if (linkOverlay) linkOverlay.classList.add('hidden');
    }
  });

  // Keyboard navigation within Omni Search
  input.addEventListener('keydown', (e) => {
    const items = document.querySelectorAll('.omni-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      NexusState.selectedOmniIndex = (NexusState.selectedOmniIndex + 1) % items.length;
      updateOmniSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      NexusState.selectedOmniIndex = (NexusState.selectedOmniIndex - 1 + items.length) % items.length;
      updateOmniSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[NexusState.selectedOmniIndex]) {
        items[NexusState.selectedOmniIndex].click();
      }
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOmni();
  });

  input.addEventListener('input', (e) => {
    NexusState.selectedOmniIndex = 0;
    renderOmniResults(e.target.value.trim().toLowerCase());
  });

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      NexusState.omniFilter = tab.getAttribute('data-filter');
      NexusState.selectedOmniIndex = 0;
      renderOmniResults(input.value.trim().toLowerCase());
    });
  });

  renderOmniResults('');
}

function updateOmniSelection(items) {
  items.forEach((item, idx) => {
    if (idx === NexusState.selectedOmniIndex) {
      item.classList.add('selected');
      item.scrollIntoView({ block: 'nearest' });
    } else {
      item.classList.remove('selected');
    }
  });
}

function renderOmniResults(query) {
  const container = document.getElementById('omniResults');
  if (!container) return;
  container.innerHTML = '';

  let totalItems = 0;
  const currentFilter = NexusState.omniFilter;

  omniSuggestions.forEach(group => {
    if (currentFilter !== 'all' && group.type !== currentFilter) return;

    const filtered = group.items.filter(item => 
      !query || item.text.toLowerCase().includes(query) || item.badge.toLowerCase().includes(query)
    );

    if (filtered.length > 0) {
      const groupLabel = document.createElement('div');
      groupLabel.className = 'omni-group-label';
      groupLabel.textContent = group.category;
      container.appendChild(groupLabel);

      filtered.forEach((item) => {
        const itemIndex = totalItems;
        totalItems++;

        const row = document.createElement('div');
        row.className = `omni-item ${itemIndex === NexusState.selectedOmniIndex ? 'selected' : ''}`;
        row.innerHTML = `
          <div class="omni-item-icon">${item.icon}</div>
          <div class="omni-item-text">${highlightMatch(item.text, query)}</div>
          <div class="omni-item-badge">${item.badge}</div>
        `;
        row.addEventListener('click', () => handleOmniItemSelect(item));
        container.appendChild(row);
      });
    }
  });

  if (totalItems === 0) {
    container.innerHTML = `
      <div style="padding: 2.5rem; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
        No results match <strong>"${escapeHtml(query)}"</strong>.
        <div style="margin-top: 0.6rem;">
          <button class="action-primary-btn" style="margin: 0 auto;" onclick="searchQueryDirectly('${escapeHtml(query)}')">
            Ask AI about "${escapeHtml(query)}"
          </button>
        </div>
      </div>
    `;
  }
}

function searchQueryDirectly(q) {
  document.getElementById('omniModalOverlay').classList.add('hidden');
  switchTab('knowledge');
  const input = document.getElementById('ragQueryInput');
  if (input) input.value = q;
  triggerRAGSearch();
}

function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escapeHtml(text).replace(regex, '<mark style="background: rgba(79, 70, 229, 0.2); color: inherit; padding: 0 2px; border-radius: 2px;">$1</mark>');
}

function handleOmniItemSelect(item) {
  document.getElementById('omniModalOverlay').classList.add('hidden');
  
  if (item.id === 'act-1') {
    openApprovalDrawer('WF-198');
  } else if (item.id === 'act-2') {
    openApprovalDrawer('WF-204');
  } else if (item.id === 'act-3') {
    openApprovalDrawer('WF-209');
  } else if (item.id.startsWith('rag-') || item.id === 'act-4') {
    switchTab('knowledge');
    const input = document.getElementById('ragQueryInput');
    if (input) input.value = item.text;
    triggerRAGSearch();
  } else if (item.id === 'nav-overview') {
    switchTab('overview');
  } else if (item.id === 'nav-workflows') {
    switchTab('workflows');
  } else if (item.id === 'nav-knowledge') {
    switchTab('knowledge');
  } else if (item.id === 'nav-audit') {
    switchTab('audit');
  } else if (item.id === 'nav-integrations') {
    switchTab('integrations');
  } else {
    showToast(`Started: ${item.text}`);
  }
}

// ============================================================================
// 9. INTERACTIVE CHART (HOW FAST YOUR TEAM SOLVES PROBLEMS)
// ============================================================================

function initVelocityChart() {
  const canvas = document.getElementById('velocityChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const pillButtons = document.querySelectorAll('#chartPills .pill');
  pillButtons.forEach(pill => {
    pill.addEventListener('click', () => {
      pillButtons.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      NexusState.chartPeriod = pill.getAttribute('data-period');
      drawChart(ctx, canvas, NexusState.chartPeriod);
    });
  });

  const expandBtn = document.getElementById('expandChartBtn');
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      const widget = document.getElementById('widget-analytics');
      if (widget) {
        widget.classList.toggle('col-span-12');
        if (!widget.classList.contains('col-span-12')) {
          widget.classList.add('col-span-8');
        } else {
          widget.classList.remove('col-span-8');
        }
        setTimeout(resizeAndDraw, 80);
      }
    });
  }

  function resizeAndDraw() {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth * window.devicePixelRatio;
    canvas.height = 230 * window.devicePixelRatio;
    canvas.style.width = `${parent.clientWidth}px`;
    canvas.style.height = `230px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    drawChart(ctx, canvas, NexusState.chartPeriod);
  }

  window.addEventListener('resize', resizeAndDraw);
  setTimeout(resizeAndDraw, 60);
}

function drawChart(ctx, canvas, period) {
  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;
  ctx.clearRect(0, 0, width, height);

  let labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let automatedData = [82, 94, 110, 105, 134, 98, 142];
  let hitlData = [18, 22, 16, 28, 20, 12, 19];
  let manualBaseline = [28, 30, 29, 31, 28, 27, 30];

  if (period === '30d') {
    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    automatedData = [450, 580, 710, 890];
    hitlData = [92, 110, 88, 74];
    manualBaseline = [160, 158, 165, 162];
  } else if (period === '90d') {
    labels = ['Month 1', 'Month 2', 'Month 3'];
    automatedData = [1800, 2450, 3420];
    hitlData = [380, 310, 280];
    manualBaseline = [680, 670, 690];
  }

  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Grid Lines
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = paddingTop + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();
  }

  // Draw X labels
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((lbl, i) => {
    const x = paddingLeft + (chartW / (labels.length - 1)) * i;
    ctx.fillText(lbl, x, height - 10);
  });

  const maxVal = Math.max(...automatedData) * 1.15;

  function getCoordinates(data) {
    return data.map((val, i) => ({
      x: paddingLeft + (chartW / (data.length - 1)) * i,
      y: paddingTop + chartH - (val / maxVal) * chartH
    }));
  }

  function renderLine(points, strokeColor, fillColor, isGradient = false) {
    if (points.length === 0) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      ctx.bezierCurveTo(cpX, p0.y, cpX, p1.y, p1.x, p1.y);
    }

    if (isGradient) {
      ctx.lineTo(points[points.length - 1].x, paddingTop + chartH);
      ctx.lineTo(points[0].x, paddingTop + chartH);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH);
      grad.addColorStop(0, 'rgba(79, 70, 229, 0.18)');
      grad.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cpX = (p0.x + p1.x) / 2;
        ctx.bezierCurveTo(cpX, p0.y, cpX, p1.y, p1.x, p1.y);
      }
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Data Dots
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ctx.restore();
  }

  renderLine(getCoordinates(automatedData), '#4F46E5', null, true);
  renderLine(getCoordinates(hitlData), '#8B5CF6');
  renderLine(getCoordinates(manualBaseline), '#F97316');
}

// ============================================================================
// 10. HUMAN-IN-THE-LOOP (HITL) APPROVAL DRAWER
// ============================================================================

function initApprovalDrawer() {
  const overlay = document.getElementById('hitlOverlay');
  const closeBtn = document.getElementById('closeDrawerBtn');
  const approveBtn = document.getElementById('approveActionBtn');
  const rejectBtn = document.getElementById('rejectActionBtn');
  const inspectDiffBtn = document.getElementById('inspectDiffBtn');

  if (closeBtn) closeBtn.addEventListener('click', closeApprovalDrawer);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeApprovalDrawer();
    });
  }

  if (approveBtn) {
    approveBtn.addEventListener('click', () => {
      const currentId = document.getElementById('drawerWorkflowId').textContent.replace('Item ID: ', '').trim();
      handleWorkflowApproval(currentId, true);
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      const currentId = document.getElementById('drawerWorkflowId').textContent.replace('Item ID: ', '').trim();
      handleWorkflowApproval(currentId, false);
    });
  }

  if (inspectDiffBtn) {
    inspectDiffBtn.addEventListener('click', () => {
      const diffBox = document.getElementById('technicalDiffContainer');
      if (diffBox) {
        diffBox.classList.toggle('hidden');
        inspectDiffBtn.textContent = diffBox.classList.contains('hidden') ? 'Show Technical Details' : 'Hide Technical Details';
      }
    });
  }
}

function openApprovalDrawer(workflowId) {
  const item = NexusState.pendingApprovals.find(a => a.id === workflowId);
  if (!item) {
    showToast('This item has already been resolved!');
    return;
  }

  const overlay = document.getElementById('hitlOverlay');
  const title = document.getElementById('drawerWorkflowTitle');
  const idEl = document.getElementById('drawerWorkflowId');
  const badge = document.getElementById('drawerBadge');
  const body = document.getElementById('drawerBody');

  if (title) title.textContent = item.title;
  if (idEl) idEl.textContent = `Item ID: ${item.id}`;
  if (badge) {
    badge.className = `drawer-badge ${item.risk === 'high' ? 'high-risk' : 'medium-risk'}`;
    badge.textContent = item.risk === 'high' ? 'REQUIRES MANAGER APPROVAL' : 'REVIEW REQUEST';
  }

  if (body) {
    body.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">AFFECTED APPLICATION</div>
        <div style="font-size: 1rem; font-weight: 700; color: var(--text-main);">${escapeHtml(item.system)}</div>
      </div>

      <div class="callout info" style="margin-top: 0;">
        <strong>Quick Summary:</strong> ${escapeHtml(item.summary)}
      </div>

      <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 1rem; margin-bottom: 0.4rem;">
        WHAT WILL CHANGE (PLAIN ENGLISH)
      </div>
      <div class="friendly-change-card">
        ${item.changes.map(ch => `
          <div class="change-row">
            <span class="change-label">${escapeHtml(ch.label)}</span>
            <span class="change-value"><strong>${escapeHtml(ch.value)}</strong></span>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 1.25rem;">
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.35rem;">
          RECOMMENDED NEXT STEP
        </div>
        <p style="font-size: 0.82rem; color: #475569;">${escapeHtml(item.recommendedAction)}</p>
      </div>

      <!-- Optional Technical View Toggle -->
      <div id="technicalDiffContainer" class="hidden" style="margin-top: 1rem;">
        <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">TECHNICAL SYSTEM LOG</div>
        <div class="diff-box">
          ${item.diffPayload.split('\n').map(line => {
            let cls = 'neutral';
            if (line.startsWith('+')) cls = 'plus';
            else if (line.startsWith('-')) cls = 'minus';
            return `<div class="diff-line ${cls}">${escapeHtml(line)}</div>`;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Reset technical toggle text
  const inspectDiffBtn = document.getElementById('inspectDiffBtn');
  if (inspectDiffBtn) inspectDiffBtn.textContent = 'Show Technical Details';

  overlay.classList.remove('hidden');
}

function closeApprovalDrawer() {
  const overlay = document.getElementById('hitlOverlay');
  if (overlay) overlay.classList.add('hidden');
}

function handleWorkflowApproval(workflowId, approved) {
  closeApprovalDrawer();

  const itemIndex = NexusState.pendingApprovals.findIndex(a => a.id === workflowId);
  if (itemIndex === -1) return;

  const item = NexusState.pendingApprovals[itemIndex];
  NexusState.pendingApprovals.splice(itemIndex, 1);

  // Update badge count
  const badge = document.getElementById('hitlBadge');
  const countBadge = document.getElementById('pendingWorkflowCount');
  if (badge) badge.textContent = `${NexusState.pendingApprovals.length} Needs Action`;
  if (countBadge) countBadge.textContent = NexusState.pendingApprovals.length;

  // Add to Activity History
  const newAudit = {
    timestamp: 'Just now',
    actor: 'Alexandre Kim (Operations Lead)',
    action: approved ? `Approved: ${item.title}` : `Declined: ${item.title}`,
    target: item.system,
    scope: 'Manager Authorization',
    hash: 'Shield Verified',
    status: approved ? 'Updated & Saved' : 'Declined'
  };
  NexusState.auditLedger.unshift(newAudit);

  // Add to Activity Feed
  NexusState.liveActivities.unshift({
    agent: 'Operations Manager',
    action: approved ? `Confirmed ${item.title}. Updated ${item.system}.` : `Declined ${item.title}.`,
    time: 'Just now',
    status: 'success'
  });

  renderApprovalList();
  renderAuditTable();
  renderLiveActivities();

  showToast(approved ? `Approved ${item.id}: Successfully updated ${item.system}!` : `Declined ${item.id}.`);
}

function renderApprovalList() {
  const list = document.getElementById('approvalList');
  if (!list) return;

  if (NexusState.pendingApprovals.length === 0) {
    list.innerHTML = `
      <div style="padding: 2.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🎉</div>
        <strong>All caught up!</strong>
        <p style="font-size: 0.78rem; color: #94A3B8; margin-top: 4px;">Zero tasks are currently waiting for your review.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = NexusState.pendingApprovals.map(item => `
    <div class="approval-item" onclick="openApprovalDrawer('${item.id}')">
      <div class="item-icon ${item.risk === 'high' ? 'erp' : 'security'}">
        ${item.risk === 'high' ? '💰' : '📄'}
      </div>
      <div class="item-content">
        <div class="item-title">${escapeHtml(item.title)}</div>
        <div class="item-meta">${escapeHtml(item.system)} &bull; ${escapeHtml(item.amount)}</div>
      </div>
      <span class="action-arrow">&rarr;</span>
    </div>
  `).join('');
}

// ============================================================================
// 11. SMART WORKFLOWS (CLEAR & INTUITIVE)
// ============================================================================

const Top5Workflows = [
  {
    num: '01',
    title: 'Review New Vendor (Tax ID, Security Check & Contract)',
    trigger: 'A new vendor submits their tax forms and security questionnaire.',
    systems: ['Workday', 'SAP Accounting', 'Google Drive', 'DocuSign'],
    steps: [
      'Reads W-9 tax documents and security compliance paperwork automatically.',
      'Checks international safety registries to ensure the vendor is trusted.',
      'Prepares the vendor account in accounting and drafts a signature agreement.',
      'Calculates a friendly risk score from 1–100.'
    ],
    hitl: {
      role: 'Procurement or Manager Review',
      detail: 'You review the extracted tax ID, price terms, and contract before adding them to the vendor list.'
    }
  },
  {
    num: '02',
    title: 'Compare Team Expenses Against Budget & Catch Surprises',
    trigger: 'End-of-month financial review or when an unexpected charge occurs.',
    systems: ['NetSuite', 'Salesforce Deals', 'AWS Servers', 'Jira'],
    steps: [
      'Gathers all company bills and compares them against customer contract revenue.',
      'Catches unused cloud computer accounts and duplicate contractor invoices.',
      'Creates a clean executive summary showing where every dollar went.',
      'Prepares ready-to-sign accounting adjustment notes.'
    ],
    hitl: {
      role: 'Finance Lead / Controller',
      detail: 'One-click review to accept or decline the batch expense corrections.'
    }
  },
  {
    num: '03',
    title: 'Troubleshoot Tech Issue & Prepare a Tested Safe Fix',
    trigger: 'Alert received about slow customer page load or server errors.',
    systems: ['Server Monitoring', 'Jira Tickets', 'GitHub Code', 'Cloud Infrastructure'],
    steps: [
      'Checks what software was updated in the last 3 hours to identify the cause.',
      'Pinpoints the exact setting that caused the issue.',
      'Writes a clear incident summary in plain English for the team.',
      'Prepares a rollback fix and runs 14 automated test checks to confirm safety.'
    ],
    hitl: {
      role: 'Technical Lead or Manager',
      detail: 'View how many users are affected and click one button to roll back to the stable version.'
    }
  },
  {
    num: '04',
    title: 'Scan Company Contracts for Risky Clauses',
    trigger: 'Type any contract question into the search bar (e.g. "Which vendor agreements have high liability?").',
    systems: ['Google Drive', 'SharePoint', 'Box', 'Company Legal Archive'],
    steps: [
      'Searches through 4,500+ legal PDFs across all company drives in seconds.',
      'Flags clauses with liability above $1M or contracts that auto-renew without warning.',
      'Sorts agreements into Low Risk, Medium Risk, and Attention Needed.',
      'Provides direct clickable links to the exact paragraph in each document.'
    ],
    hitl: {
      role: 'Legal Team or General Counsel',
      detail: 'Review highlighted excerpts side-by-side with the original scanned PDF before exporting.'
    }
  },
  {
    num: '05',
    title: 'Check Team Workload & Draft Job Posting',
    trigger: 'Sales deals increase while engineering sprint velocity slows down.',
    systems: ['Jira Projects', 'Salesforce Deals', 'Workday Team', 'Greenhouse Hiring'],
    steps: [
      'Compares current customer commitments against available team members.',
      'Checks when contractor contracts end and reviews available budget.',
      'Forecasts team workload for the next 60 days to prevent burnout.',
      'Drafts a complete job posting with recommended salary benchmarks.'
    ],
    hitl: {
      role: 'VP of Engineering & HR Lead',
      detail: 'Review the workload forecast and click one button to publish the job posting to Greenhouse.'
    }
  }
];

function renderWorkflowsCatalog() {
  const container = document.getElementById('workflowsCatalog');
  if (!container) return;

  container.innerHTML = Top5Workflows.map(wf => `
    <div class="workflow-card">
      <div class="wf-header">
        <div class="wf-title-row">
          <span class="wf-num-badge">WORKFLOW ${wf.num}</span>
          <h3 class="wf-title">${wf.title}</h3>
        </div>
        <button class="action-primary-btn" onclick="startWorkflowSimulation('${wf.num}', '${escapeHtml(wf.title)}')">Run This Workflow</button>
      </div>

      <div class="wf-trigger-bar">
        <span class="wf-trigger-label">When it triggers:</span>
        <span>${wf.trigger}</span>
      </div>

      <div class="wf-actions-grid">
        <div>
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.4rem;">HOW NEXUS SOLVES THIS</div>
          <div class="wf-step-list">
            ${wf.steps.map(step => `
              <div class="wf-step-item">
                <span class="wf-step-bullet">&bull;</span>
                <span>${step}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="wf-hitl-box">
          <div>
            <div class="wf-hitl-title">YOUR APPROVAL CHECKPOINT</div>
            <div style="font-size: 0.78rem; font-weight: 700; color: #92400E; margin-bottom: 4px;">Who checks it: ${wf.hitl.role}</div>
            <div class="wf-hitl-desc">${wf.hitl.detail}</div>
          </div>
          <button class="btn-secondary mt-3" style="width: 100%;" onclick="openApprovalDrawer('WF-204')">Preview Approval Card</button>
        </div>
      </div>

      <div class="wf-footer">
        <div class="wf-systems-tags">
          <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">CONNECTED APPS:</span>
          ${wf.systems.map(s => `<span class="sys-tag">${s}</span>`).join('')}
        </div>
        <div style="font-size: 0.75rem; color: #059669; font-weight: 600;">&#10003; Safe & Compliant</div>
      </div>
    </div>
  `).join('');
}

function startWorkflowSimulation(wfNum, title) {
  const banner = document.getElementById('activeRunnerBanner');
  const runnerTitle = document.getElementById('runnerTitle');
  const runnerStepText = document.getElementById('runnerStepText');
  const runnerFill = document.getElementById('runnerProgressFill');

  if (!banner || !runnerTitle || !runnerStepText || !runnerFill) return;

  switchTab('workflows');
  banner.classList.remove('hidden');
  runnerTitle.textContent = `Running: ${title}`;
  runnerFill.style.width = '20%';
  runnerStepText.textContent = 'Step 1 of 4: Checking connected applications...';

  setTimeout(() => {
    runnerFill.style.width = '55%';
    runnerStepText.textContent = 'Step 2 of 4: Reading documents and verifying safety checks...';
  }, 900);

  setTimeout(() => {
    runnerFill.style.width = '85%';
    runnerStepText.textContent = 'Step 3 of 4: Preparing summary and draft update...';
  }, 1900);

  setTimeout(() => {
    runnerFill.style.width = '100%';
    runnerStepText.textContent = 'Step 4 of 4: Completed! Sent to your approval queue.';
    showToast(`Workflow "${title}" completed! Review is ready.`);
    
    setTimeout(() => {
      banner.classList.add('hidden');
    }, 1800);
  }, 2900);
}

// ============================================================================
// 12. PROACTIVE TEAM INSIGHTS
// ============================================================================

const PredictiveAlerts = [
  {
    id: 'ins-1',
    title: 'Cloud Budget Warning: $82,400 Projected Overrun',
    confidence: 'High Confidence (95%)',
    timeframe: 'Forecast: Next 45 Days',
    desc: 'Based on current test server activity in Engineering, cloud compute spend will exceed the department quarterly cap by mid-next month.',
    recommendation: 'Nexus can automatically turn off test servers overnight (after 6 PM) to save $54,000.',
    actionLabel: 'Turn Off Test Servers Overnight'
  },
  {
    id: 'ins-2',
    title: 'Contract Signing Delay in European Deals',
    confidence: 'High Confidence (91%)',
    timeframe: 'Forecast: Next 14 Days',
    desc: 'Customer sales are up 32% this month, but vendor agreement reviews are taking an average of 48 hours to complete manually.',
    recommendation: 'Nexus can pre-check European privacy terms automatically to reduce review time to 12 minutes.',
    actionLabel: 'Enable Instant Privacy Check'
  },
  {
    id: 'ins-3',
    title: 'Team Workload Heavy on Mobile Login Feature',
    confidence: 'Good Confidence (88%)',
    timeframe: 'Forecast: Next 60 Days',
    desc: 'The engineering team has 2 open vacancies, which may cause a 10-day delay on the next mobile app update.',
    recommendation: 'Nexus can draft a hiring post for Greenhouse and suggest 2 internal contractors with matching skills.',
    actionLabel: 'Draft Job Posting & Notify Team'
  }
];

function renderPredictiveInsights() {
  const container = document.getElementById('predictiveGrid');
  if (!container) return;

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
      ${PredictiveAlerts.map(alert => `
        <div class="widget-card" style="padding: 1.5rem;" id="card-${alert.id}">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <span class="badge warning">${alert.confidence}</span>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">${alert.timeframe}</span>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.6rem;">${alert.title}</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">${alert.desc}</p>
          <div class="callout info" style="margin: 0 0 1.25rem 0;">
            <strong>Helpful Recommendation:</strong> ${alert.recommendation}
          </div>
          <button class="action-primary-btn" style="width: 100%; justify-content: center;" onclick="applyInsight('${alert.id}', '${escapeHtml(alert.actionLabel)}')">
            ${alert.actionLabel}
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function applyInsight(insightId, actionLabel) {
  const card = document.getElementById(`card-${insightId}`);
  if (card) {
    const btn = card.querySelector('.action-primary-btn');
    if (btn) {
      btn.style.backgroundColor = '#10B981';
      btn.innerHTML = '&#10003; Recommendation Applied!';
      btn.disabled = true;
    }
  }

  showToast(`Applied: ${actionLabel}!`);

  NexusState.liveActivities.unshift({
    agent: 'Proactive Assistant',
    action: `Applied optimization: ${actionLabel}.`,
    time: 'Just now',
    status: 'success'
  });
  renderLiveActivities();
}

// ============================================================================
// 13. CONNECTED TOOLS & GOVERNANCE MATRIX
// ============================================================================

const EnterpriseIntegrations = [
  {
    id: 'int-sf',
    name: 'Salesforce CRM',
    category: 'Customers & Sales Deals',
    records: '3.2M Records',
    sync: 'Real-time automatic sync',
    encryption: 'Private & Encrypted',
    rbacLevel: 'Standard Permissions',
    status: 'Active'
  },
  {
    id: 'int-sap',
    name: 'SAP & NetSuite Accounting',
    category: 'Invoices, Bills & Ledgers',
    records: '840K Journal Entries',
    sync: 'Instant change detection',
    encryption: 'Private Bank-Grade Tunnel',
    rbacLevel: 'Finance Team Only',
    status: 'Active'
  },
  {
    id: 'int-wd',
    name: 'Workday HR Directory',
    category: 'Team Directory & Roles',
    records: '8,400 Team Members',
    sync: 'Synchronized with Single Sign-On',
    encryption: 'Encrypted & Authenticated',
    rbacLevel: 'Company-Wide Roles',
    status: 'Active'
  },
  {
    id: 'int-jira',
    name: 'Jira Software & Atlassian',
    category: 'Tech Projects & Bugs',
    records: '142K Issues & Tasks',
    sync: 'Instant task updates',
    encryption: 'Encrypted & Verified',
    rbacLevel: 'Engineering Team',
    status: 'Active'
  },
  {
    id: 'int-drive',
    name: 'Google Drive & SharePoint',
    category: 'Documents, Contracts & Policies',
    records: '145K Files & PDFs',
    sync: 'Instant document search',
    encryption: 'Private data masked',
    rbacLevel: 'Matches Folder Permissions',
    status: 'Active'
  },
  {
    id: 'int-snow',
    name: 'Snowflake Data Warehouse',
    category: 'Company Reports & Analytics',
    records: '48.5B Rows',
    sync: 'Read-only analytics query',
    encryption: 'Secure Customer Key',
    rbacLevel: 'Read-Only Access',
    status: 'Active'
  }
];

function renderIntegrationsMatrix() {
  const container = document.getElementById('governanceCards');
  if (!container) return;

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;">
      ${EnterpriseIntegrations.map(int => `
        <div class="widget-card" style="padding: 1.25rem;" id="card-${int.id}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span class="badge success" id="status-${int.id}">&#10003; ${int.status}</span>
            <span style="font-size: 0.72rem; color: #059669; font-weight: 700;">${int.rbacLevel}</span>
          </div>
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main);">${int.name}</h4>
          <div style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 0.85rem;">${int.category}</div>
          
          <div style="border-top: 1px solid var(--border-light); padding-top: 0.75rem; font-size: 0.75rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <div><strong style="color: #475569;">Items Indexed:</strong> <span style="color: var(--text-main);">${int.records}</span></div>
            <div><strong style="color: #475569;">Sync Speed:</strong> <span style="color: var(--text-main);">${int.sync}</span></div>
            <div><strong style="color: #475569;">Privacy:</strong> <span style="color: var(--text-main);">${int.encryption}</span></div>
          </div>
          <button class="btn-secondary mt-3" style="width: 100%;" id="btn-${int.id}" onclick="testConnection('${int.id}', '${escapeHtml(int.name)}')">
            Test Connection
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function testConnection(appId, appName) {
  const btn = document.getElementById(`btn-${appId}`);
  if (btn) {
    btn.textContent = 'Testing connection...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Verified Healthy';
      btn.style.borderColor = '#10B981';
      btn.style.color = '#065F46';
      showToast(`${appName} connection test passed in 14ms! Everything is in sync.`);
    }, 600);
  }
}

// ============================================================================
// 14. ASK COMPANY AI (RAG SEARCH WITH PROMPT CHIPS)
// ============================================================================

function initRAGPlayground() {
  const submitBtn = document.getElementById('ragSubmitBtn');
  const input = document.getElementById('ragQueryInput');
  const chips = document.querySelectorAll('.prompt-chip');

  if (submitBtn) submitBtn.addEventListener('click', triggerRAGSearch);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') triggerRAGSearch();
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (input && q) {
        input.value = q;
        triggerRAGSearch();
      }
    });
  });

  // Initial trigger for default text
  triggerRAGSearch();
}

function triggerRAGSearch() {
  const input = document.getElementById('ragQueryInput');
  const skeleton = document.getElementById('ragSkeleton');
  const resultCard = document.getElementById('ragResultCard');
  const resultContent = document.getElementById('ragResultContent');

  if (!input || !skeleton || !resultCard || !resultContent) return;

  const query = input.value.trim();
  if (!query) return;

  resultCard.classList.add('hidden');
  skeleton.classList.remove('hidden');

  setTimeout(() => {
    skeleton.classList.add('hidden');
    resultCard.classList.remove('hidden');

    const lower = query.toLowerCase();

    if (lower.includes('vendor') || lower.includes('liability')) {
      resultContent.innerHTML = `
        <p>
          According to our <strong>Company Standard Terms (2026 Master Service Agreement, Section 8.2)</strong>:
        </p>
        <p>
          Standard approved vendor commercial liability limits are <strong>$5,000,000 per incident</strong> (or up to $10,000,000 total).
        </p>
        <div class="callout info">
          <strong>Exceptions Policy:</strong> If a vendor requests a lower limit (under $2M), both our Legal Counsel and Security Lead must approve before signing.
        </div>
      `;
    } else if (lower.includes('who can approve') || lower.includes('50k')) {
      resultContent.innerHTML = `
        <p>
          According to our <strong>European Procurement Guidelines (Workday Approval Matrix)</strong>:
        </p>
        <p>
          Any contract or purchase order <strong>above $50,000</strong> in the EMEA region must be signed by either the <strong>VP of European Operations</strong> or the <strong>Chief Financial Officer</strong>.
        </p>
        <div class="callout success">
          <strong>Current Authorizers:</strong> Elena Rostova (VP EMEA) and Marcus Vance (CFO).
        </div>
      `;
    } else if (lower.includes('ticket') || lower.includes('it support')) {
      resultContent.innerHTML = `
        <p>
          According to the <strong>Helpdesk Support Queue (Jira Service Management)</strong>:
        </p>
        <p>
          There are currently <strong>6 open customer tickets</strong> waiting for customer replies for over 48 hours. None are marked urgent.
        </p>
        <div class="callout info">
          <strong>Suggested Action:</strong> Nexus can send friendly automated follow-up emails to check if those customers still need assistance.
        </div>
      `;
    } else {
      resultContent.innerHTML = `
        <p>
          We compared the numbers across <strong>NetSuite Accounting</strong> and <strong>Engineering Budgets (Jira)</strong> for Q3:
        </p>
        <p>
          Total cloud computing spend was <strong>$842,500</strong>, compared to the approved planned budget of <strong>$689,000</strong>.
        </p>
        <div class="callout warning">
          <strong>Why is there a $153,500 difference?</strong>
          <br>&bull; <strong>$41,200</strong> came from an unassigned test computer cluster in Ohio (WF-204, currently in your approval queue).
          <br>&bull; <strong>$112,300</strong> was due to test databases that were kept running over weekends instead of auto-pausing.
        </div>
      `;
    }

    showToast('Found answer across verified documents.');
  }, 500);
}

function showCitationPreview(docTitle) {
  showToast(`Viewing reference: ${docTitle}. You have full permission to view this.`);
}

// ============================================================================
// 15. START A TASK MODAL
// ============================================================================

function initDispatchModal() {
  const triggerBtn = document.getElementById('triggerAgentModalBtn');
  const openWfBtn = document.getElementById('openCreateWorkflowBtn');
  const overlay = document.getElementById('dispatchModalOverlay');
  const closeBtn = document.getElementById('closeDispatchBtn');
  const cancelBtn = document.getElementById('cancelDispatchBtn');
  const confirmBtn = document.getElementById('confirmDispatchBtn');

  function openModal() {
    if (overlay) overlay.classList.remove('hidden');
  }

  function closeModal() {
    if (overlay) overlay.classList.add('hidden');
  }

  if (triggerBtn) triggerBtn.addEventListener('click', openModal);
  if (openWfBtn) openWfBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const select = document.getElementById('workflowSelect');
      const wfName = select.options[select.selectedIndex].text;
      closeModal();
      startWorkflowSimulation('01', wfName);
    });
  }
}

function closeDispatchModal() {
  const overlay = document.getElementById('dispatchModalOverlay');
  if (overlay) overlay.classList.add('hidden');
}

// ============================================================================
// 16. ACTIVITY HISTORY & AUDIT TRAIL
// ============================================================================

function renderLiveActivities() {
  const container = document.getElementById('liveActivityFeed');
  if (!container) return;

  container.innerHTML = NexusState.liveActivities.map(act => `
    <div class="activity-node">
      <div class="node-marker success">&#10003;</div>
      <div class="node-content">
        <div class="node-header">
          <span class="node-title">${escapeHtml(act.agent)}</span>
          <span class="node-time">${escapeHtml(act.time)}</span>
        </div>
        <div class="node-desc">${escapeHtml(act.action)}</div>
      </div>
    </div>
  `).join('');
}

function renderAuditTable() {
  const tbody = document.getElementById('auditTableBody');
  if (!tbody) return;

  tbody.innerHTML = NexusState.auditLedger.map(item => `
    <tr>
      <td style="font-size: 0.75rem; color: var(--text-muted);">${item.timestamp}</td>
      <td style="font-weight: 600;">${item.actor}</td>
      <td>${item.action}</td>
      <td><span class="badge" style="background: #F1F5F9; color: #334155;">${item.target}</span></td>
      <td><span style="font-size: 0.74rem; color: var(--primary); font-weight: 600;">${item.scope}</span></td>
      <td><span class="badge success">${item.hash}</span></td>
      <td><span class="badge" style="background: #ECFDF5; color: #065F46;">${item.status}</span></td>
    </tr>
  `).join('');

  const exportBtn = document.getElementById('exportAuditBtn');
  if (exportBtn) {
    exportBtn.onclick = exportAuditLedger;
  }
}

function exportAuditLedger() {
  const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(NexusState.auditLedger, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", jsonString);
  dlAnchorElem.setAttribute("download", "nexus_activity_report.json");
  dlAnchorElem.click();
  showToast('Activity report downloaded (JSON).');
}

// ============================================================================
// 17. TOAST NOTIFICATIONS & HELPERS
// ============================================================================

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
